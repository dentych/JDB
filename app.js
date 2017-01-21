let path = require("path");
let morgan = require("morgan");
let express = require("express");
let app = express();

app.use(morgan("dev"));
app.use("/static", express.static("public"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/room", (req, res) => {
    res.sendFile(path.join(__dirname, "public/room.html"));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
