let clients = [];
let connectedClients = 0;
let nowPlaying = [];
let index = 0;

module.exports = function (io, aliasGenerator) {
    io.on("connection", (socket) => {
        socket.name = aliasGenerator.generatePlayerName();
        socket.consumed = 0;
        socket.emit("username", socket.name);
        clients.push(socket);
        connectedClients++;

        console.log("Connected: " + socket.name);

        if (connectedClients >= 2 && nowPlaying.length == 0) {
            startBeef(io);
        }

        socket.on("disconnect", () => {
            console.log("DISCONNECTED!");
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.on("input", (data) => {
            let playerIndex = nowPlaying.indexOf(socket);
            let player2Index = playerIndex == 0 ? 1 : 0;

            if (data == "hate") {
                nowPlaying[playerIndex].answer = data;
            } else if (data == "love") {
                nowPlaying[playerIndex].answer = data;
            }

            if (nowPlaying[playerIndex].answer != null && nowPlaying[player2Index].answer != null){
                console.log("Both players has answered...");
                let shotsConsumed = [];
                if (nowPlaying[playerIndex].answer == "hate" && nowPlaying[player2Index].answer == "hate"){
                    socket.consumed += 1;
                    nowPlaying.forEach((element) => {
                        shotsConsumed.push({
                            name: element.name,
                            consumed: 1
                        });
                    });
                }
                else if (nowPlaying[playerIndex].answer == "love" && nowPlaying[player2Index].answer == "hate"){
                    socket.consumed += 2;
                    shotsConsumed.push({
                        name: socket.name,
                        consumed: 2
                    });
                }

                io.emit("shot", shotsConsumed);
            }
        });

        socket.on("current-data", (data) => {

        });

        socket.on("join-room", (data) => {
            let gamedata  = new GameData();
            console.log(gamedata);
            //socket.emit("current-data", new GameData() )
        });
    });
};

function startBeef(io) {
    let player1 = clients[index];
    index = index + 1 >= connectedClients ? 0 : index + 1;
    let player2 = clients[index];
    index = index + 1 >= connectedClients ? 0 : index + 1;

    nowPlaying.push(player1);
    nowPlaying.push(player2);

    console.log("BEEF: " + player1.name + " & " + player2.name);

    io.emit("beef", [
        {id: player1.id, name: player1.name},
        {id: player2.id, name: player2.name}
    ]);
}

class GameData {
    constructor(){
        this.numOfPlayers = clients.length;
        this.players = clients.map((client) => {
            return {
                name: client.name,
                consumed: client.consumed
            }
        });
        this.currentPlayers = nowPlaying.map((client) => {
            return {
                name: client.name
            }
        });
    }
}
