var express = require("express");
var cors = require("cors");
const app = express();
const port = 3310;
require("dotenv").config();

app.use(cors());
app.use("/api/user", require("./router/userRouter"));
app.use("/api/admin", require("./router/adminRouter"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
