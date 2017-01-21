let path = require("path");
let morgan = require("morgan");
let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

let aliasGen = require("./app/alias-generator");
const nounReader = new aliasGen.WordReader('./appData/nounlist.txt');
const adjReader = new aliasGen.WordReader('./appData/adjectiveList.txt');
let generator = new aliasGen.AliasGenerator(nounReader.wordArray, adjReader.wordArray);

app.use(morgan("dev"));
app.use("/static", express.static("public"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));
app.use("/js", express.static("public/js"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/room", (req, res) => {
    res.sendFile(path.join(__dirname, "public/room.html"));
});

app.get("/socket-test", (req, res) => {
    res.sendFile(path.join(__dirname, "public/test-socket.html"));
});

app.get("/create-room", (req, res) => {
    res.json({id: generator.generateRoomCode()});
});

require("./app/game")(io, generator);

server.listen(3000, () => {
    console.log("Listening on port 3000");
});