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
            let player = socket;
            let opponentIndex = nowPlaying.indexOf(player) == 0 ? 1 : 0;
            let opponent = nowPlaying[opponentIndex];

            if (data == "hate") {
                player.answer = data;
            } else if (data == "love") {
                player.answer = data;
            }

            if (player.answer != null && opponent.answer != null) {
                console.log("Both players has answered...");
                let shotsConsumed = [];
                if (player.answer == "hate" && opponent.answer == "hate") {
                    player.consumed += 1;
                    nowPlaying.forEach((element) => {
                        shotsConsumed.push({
                            name: element.name,
                            consumed: 1
                        });

                        element.emit("result", "enemy");
                    });
                } else if (player.answer == "love" && opponent.answer == "hate") {
                    player.consumed += 2;
                    player.emit("result", "lost");
                    opponent.emit("result", "won");

                    shotsConsumed.push({
                        name: player.name,
                        consumed: 2
                    });
                } else if (player.answer == "hate" && opponent.answer == "love") {
                    player.emit("result", "won");
                    opponent.emit("result", "lost");

                    shotsConsumed.push({
                        name: opponent.name,
                        consumed: 2
                    });
                } else {
                    nowPlaying.forEach((element) => {
                        element.emit("result", "diplomat");
                    });
                }

                io.emit("shot", shotsConsumed);
                nowPlaying = [];
                setTimeout((io) => {
                    startBeef(io);
                }, 5000, io);
            }
        });

        socket.on("join-room", (data) => {
            let gamedata = new GameData();
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
    constructor() {
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
