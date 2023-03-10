var express = require("express");
var cors = require("cors");
const app = express();
const port = 3310;

app.use(cors());
app.use(express.static("dist"));
app.use("/api/user", require("./router/userRouter"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
