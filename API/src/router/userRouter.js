const express = require("express");
const bodyParser = require("body-parser");
const query = require("../db/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { access } = require("fs");

var userApi = express.Router();
userApi.use(bodyParser.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
        console.log(err);

        if (err) return res.sendStatus(403);
        req.felicaCardID = result?.felicaCardID;
        req.webUserID = result?.webUserID;

        next();
    });
}

userApi.post("/login", async (req, res) => {
    if (
        req.body?.accessCode === undefined &&
        (req.body?.userName === undefined || req.body?.password === undefined)
    ) {
        res.send("login invalid");
        return;
    }
    let accessCode = req.body?.accessCode;
    let userName = req.body?.userName;
    let password = req.body?.password;
    let sqlQuery;

    if (accessCode) {
        sqlQuery = `SELECT ext_id as extID FROM ext_felica_card WHERE luid = '${accessCode}'`;
    } else if (userName && password) {
        let saltedPassword = crypto
            .createHash("md5")
            .update(password + process.env.SALT)
            .digest("hex");
        sqlQuery = `
SELECT
    wud.id as userID,
    wud.username as userName,
    wud.isAdmin as isAdmin,
    efc.ext_id as extID
FROM
    web_user_data wud
JOIN ext_felica_card efc ON efc.id = wud.felica_code 
WHERE
    username = '${userName}' AND password_salted = '${saltedPassword}';
        `;
    }

    const result = await query(sqlQuery);
    if (result.length !== 0) {
        console.log(result[0]);
        const token = jwt.sign(
            {
                felicaCardID: result[0].extID,
                isAdmin: result[0].isAdmin,
                webUserID: result[0].userID,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        );
        res.send({
            success: true,
            token,
            payload: {
                felicaCardID: result[0].extID,
                isAdmin: result[0].isAdmin,
            },
        });
    } else {
        res.json({ success: false });
    }
});

userApi.post("/register", async (req, res) => {
    if (req.body?.username === undefined && req.body?.password === undefined) {
        res.send("login invalid");
        return;
    }
    let username = req.body?.userName;
    let password = req.body?.password;
    let saltedPassword = crypto
        .createHash("md5")
        .update(password + process.env.SALT)
        .digest("hex");
    let sqlQuery = `INSERT INTO web_user_data ( username, felica_code, password_salted) VALUES ('${username}', '1','${saltedPassword}')`;
    const result = await query(sqlQuery);
    console.log(result);
    if (result.affectedRows !== 0) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// userApi.get("/profile", authenticateToken, async (req, res) => {
//     let accessCode = req.accessCode;
//     let sqlQuery = `SELECT * FROM web_user_data WHERE uuid = '${accessCode}'`;
//     const result = await query(sqlQuery);
//     if (result.length !== 0) {
//         res.json({ success: true, data: result });
//     } else {
//         res.json({ success: false });
//     }
// });

userApi.post("/getUserInfo", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;
    let sqlQuery = `
    SELECT
        user_name as userName,
        register_time as registerTime,
        access_time as accessTime,
        battle_point as battlePoint,
        last_game_date as lastGameDate
    FROM
        ext_felica_card
    JOIN user_data ON
        user_data.felica_card_id = ext_felica_card.id
    WHERE
        ext_id = '${extID}'
    `;
    const result = await query(sqlQuery);
    res.json({ success: true, data: result });
});

userApi.post("/getEvents", authenticateToken, async (req, res) => {
    let page = req.body?.page - 1;
    let limit = req.body?.pageSize;
    let filterValues = req.body?.filterValues;
    let order = req.body?.order;
    let offset = page * limit;
    console.log(req.body);
    let sqlQuery = `
    SELECT Event_name as eventName, startTime, endTime FROM game_event ge
    `;
    if (order !== undefined && order !== false) {
        sqlQuery += `
        ORDER BY Event_name ${order}`;
    }
    sqlQuery += `
        LIMIT ${offset}, ${limit}`;
    let totalCountQuery = `SELECT COUNT(1) as count FROM game_event`;
    const result = await query(sqlQuery);
    const totalCountresult = await query(totalCountQuery);
    const count = totalCountresult[0].count.toString();
    res.json({
        success: true,
        data: result,
        totalRecords: count,
    });
});

userApi.post("/getUserOptions", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;
    let sqlQuery = `
    SELECT 
        ud.user_id,
        abort,
        color_field as colorField,
        color_lane as colorLane,
        color_wall as colorWall,
        disp_battle_pt as displayBattlePoint,
        disp_player_lv as displayPlayerLevel,
        headphone_amp as headphoneAMP,
        adj_judge_tA as adjJudgeTA,
        adj_judge_tB as adjJudgeTB,
        disp_judge_type as displayJudgeType,
        tap_sound as tapSound,
        break_sound as breakSound,
        IsMirror as isMirror,
        Tap_amp as tapAMP,
        Bell_amp as bellAMP,
        CBreak_amp as CBreakAMP,
        Hold_amp as holdAMP
    FROM
        ext_felica_card efc
    JOIN user_data ud ON
        ud.felica_card_id = efc.id
    JOIN user_game_opts ugo ON
        ugo.user_id = ud.user_id
    WHERE 
        efc.ext_id = '${extID}';
    `;
    const result = await query(sqlQuery);
    res.json({ success: true, data: result });
});

userApi.post("/updateUserOptions", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;

    // update user_game_opts
    let data = req.body?.data;
    let sqlQuery = `
    UPDATE user_game_opts ugo
    JOIN user_data ud ON
        ud.user_id = ugo.user_id
    JOIN ext_felica_card efc ON
        efc.id = ud.felica_card_id
    SET
        abort = ${data.abort},
        color_field = ${data.colorField},   
        color_lane = ${data.colorLane},
        color_wall = ${data.colorWall},
        disp_battle_pt = ${data.displayBattlePoint},
        disp_player_lv = ${data.displayPlayerLevel},
        headphone_amp = ${data.headphoneAMP},
        adj_judge_tA = ${data.adjJudgeTA},
        adj_judge_tB = ${data.adjJudgeTB},
        disp_judge_type = '${data.displayJudgeType}',
        tap_sound = ${data.tapSound},
        break_sound = ${data.breakSound},
        IsMirror = ${data.isMirror},
        Tap_amp = ${data.tapAMP},
        Bell_amp = ${data.bellAMP},
        CBreak_amp = ${data.CBreakAMP},
        Hold_amp = ${data.holdAMP}
    WHERE
        efc.ext_id = '${extID}';
    `;
    const result = await query(sqlQuery);
    res.json({ success: true });
});

userApi.post("/getUserGameDeck", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;
    let sqlQuery = `
    SELECT
        vugd.user_id as userID,
        deck_id as deckID,
        card_name as cardName,
        nick_name as nickName,
        attribute,
        character_id as characterId,
        school,
        section,
        rarity ,
        skill_id as skill_id,
        cho_kaika_skill_id as chokaikaSkillId,
        card_number as cardNumber,
        version
    FROM
        view_user_game_deck vugd
    JOIN user_data ud ON
        ud.user_id = vugd.user_id
    JOIN ext_felica_card efc ON
        efc.id = ud.felica_card_id
    WHERE
        efc.ext_id = ${extID}
    ORDER BY
        deckID ASC;`;
    const result = await query(sqlQuery);
    res.json({ success: true, data: result });
});

userApi.post("/getMusicPlaysCount", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;
    let sqlQuery = `
    SELECT
        GROUP_CONCAT(music_name ORDER BY played_time_all_users DESC) as labels,
        GROUP_CONCAT(played_time_all_users ORDER BY played_time_all_users DESC) as data
    FROM
        music_played_times_all_users mptau`;
    const result = await query(sqlQuery);
    const data = {
        labels: result[0].labels.split(","),
        data: JSON.parse(`[${result[0].data}]`),
    };
    res.json({ success: true, data: data });
});

userApi.post("/getPlayerRank", authenticateToken, async (req, res) => {
    let extID = req.felicaCardID;
    let sqlQuery = `
    SELECT 
        GROUP_CONCAT(player_rating ORDER BY player_rating DESC) as data,
        GROUP_CONCAT(user_name ORDER BY player_rating DESC) as labels
    FROM
        player_rating_desc vupr`;
    const result = await query(sqlQuery);
    const data = {
        labels: result[0].labels.split(","),
        data: JSON.parse(`[${result[0].data}]`),
    };
    res.json({ success: true, data: data });
});

module.exports = userApi;
