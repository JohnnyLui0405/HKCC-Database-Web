const express = require("express");
const bodyParser = require("body-parser");
const query = require("../db/index");
const jwt = require("jsonwebtoken");

var userApi = express.Router();
userApi.use(bodyParser.json());

userApi.post("/login", async (req, res) => {
    if (req.body?.accessCode === undefined) {
        res.send("login invalid");
        return;
    }
    console.log(req.body?.accessCode === "00023837519807228797");
    let accessCode = req.body?.accessCode;
    let sqlQuery = `SELECT * FROM felica_card WHERE luid = '${accessCode}'`;
    const result = await query(sqlQuery);
    console.log(result);
    if (result.length !== 0) {
        const token = jwt.sign({ _id: accessCode }, process.env.TOKEN_SECRET, {
            expiresIn: "1 day",
        });
        res.send({ success: true, token });
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
