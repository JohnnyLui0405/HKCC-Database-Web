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
        req.felicaCardID = result.felicaCardID;

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
                wud.uuid as userUUID,
                wud.username as userName,
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
        console.log(result[0].extID);
        const token = jwt.sign(
            { felicaCardID: result[0].extID },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.send({ success: true, token });
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
    let sqlQuery = `INSERT INTO web_user_data (uuid, username, felica_code, password_salted) VALUES ('${uuidv1()}','${username}', '1','${saltedPassword}')`;
    const result = await query(sqlQuery);
    console.log(result);
    if (result.affectedRows !== 0) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

userApi.get("/profile", authenticateToken, async (req, res) => {
    let accessCode = req.accessCode;
    let sqlQuery = `SELECT * FROM web_user_data WHERE uuid = '${accessCode}'`;
    const result = await query(sqlQuery);
    if (result.length !== 0) {
        res.json({ success: true, data: result });
    } else {
        res.json({ success: false });
    }
});

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

module.exports = userApi;
