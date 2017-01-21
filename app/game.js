let clients = [];
let nowPlaying = [];

module.exports = function (io, aliasGenerator) {
    io.on("connection", (socket) => {
        let username = aliasGenerator.generatePlayerName();
        console.log(socket);
        socket.emit("username", username);

        socket.on("disconnect", () => {
            console.log("DISCONNECTED!");
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
            
        });
    });
};


