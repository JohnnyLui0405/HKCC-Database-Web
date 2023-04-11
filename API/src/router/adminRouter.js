const express = require("express");
const bodyParser = require("body-parser");
const query = require("../db/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { access } = require("fs");

var adminApi = express.Router();
adminApi.use(bodyParser.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        console.log(result);
        if (!result.isAdmin) return res.sendStatus(403);
        req.felicaCardID = result.felicaCardID;

        next();
    });
}

adminApi.post("/createEvent", authenticateToken, async (req, res) => {
    let eventName = req.body?.eventName;
    // convert eventStartDate from timestamp to date
    let eventStartDate = req.body?.startTime / 1000;
    // convert eventEndDate from timestamp to date
    let eventEndDate = req.body?.endTime / 1000;
    console.log(eventStartDate);
    let sqlQuery = `INSERT INTO game_event (event_name, startTime, endTime) VALUES ('${eventName}', FROM_UNIXTIME(${eventStartDate}), FROM_UNIXTIME(${eventEndDate}))`;
    const result = await query(sqlQuery);

    if (result.insertId) {
        const insertId = result.insertId.toString();
        res.json({
            success: true,
            data: insertId,
        });
    } else {
        res.json({
            success: false,
            data: "Error",
        });
    }
});

adminApi.post("/getWebUsers", authenticateToken, async (req, res) => {
    let page = req.body?.page - 1;
    let limit = req.body?.pageSize;
    let order = req.body?.order;
    let offset = page * limit;
    console.log(req.body);
    let sqlQuery = `
    SELECT
        id as uuid,
        username as userName,
        felica_code as felicaCode,
        isInitalLogin,
        isAdmin,
        register_date as registerDate
    FROM
        web_user_data
    `;
    if (order !== undefined && order !== false) {
        sqlQuery += `
        ORDER BY id ${order}`;
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

adminApi.post("/getWebUsers", authenticateToken, async (req, res) => {
    let page = req.body?.page - 1;
    let limit = req.body?.pageSize;
    let filterValues = req.body?.filterValues;
    let order = req.body?.order;
    let offset = page * limit;
    console.log(req.body);
    let sqlQuery = `
    SELECT
        uuid,
        username as userName,
        felica_code as felicaCode,
        isInitalLogin,
        isAdmin,
        register_date as registerDate
    FROM
        web_user_data
    `;
    if (order !== undefined && order !== false) {
        sqlQuery += `
        ORDER BY userName ${order}`;
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

adminApi.post("/updateWebUser", authenticateToken, async (req, res) => {
    let sqlQuery = `
    UPDATE
        web_user_data
    SET
        username = '${req.body.userName}',
        felica_code = '${req.body.felicaCode}',
        isInitalLogin = ${req.body.isInitalLogin},
        isAdmin = ${req.body.isAdmin}
    WHERE
        uuid = '${req.body.uuid}'
    `;
    let result = await query(sqlQuery);
    res.send({ success: true, data: result });
});

module.exports = adminApi;
