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

    jwt.verify(token, process.env.TOKEN_SECRET, (err, accessCode) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.accessCode = accessCode;

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
        sqlQuery = `SELECT luid as accessCode FROM ext_felica_card WHERE luid = '${accessCode}'`;
    } else if (userName && password) {
        let saltedPassword = crypto
            .createHash("md5")
            .update(password + process.env.SALT)
            .digest("hex");
        sqlQuery = `
            SELECT
                wud.uuid as userUUID,
                wud.username as userName,
                efc.luid as accessCode
            FROM
                web_user_data wud
            JOIN ext_felica_card efc ON efc.id = wud.felica_code 
            WHERE
                username = '${userName}' AND password_salted = '${saltedPassword}';
        `;
    }

    const result = await query(sqlQuery);
    if (result.length !== 0) {
        const token = jwt.sign(
            { _id: result.accessCode },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "10m",
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

userApi.put("/", (req, res) => {
    user.age += 1;
    res.json("return user info is " + JSON.stringify(user));
});

userApi.delete("/", (req, res) => {
    res.send("user is deleted : " + user.name);
});

module.exports = userApi;
