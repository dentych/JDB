let clients = [];
let nowPlaying = [];

module.exports = function (io, aliasGenerator) {
    io.on("connection", (socket) => {
        let username = aliasGenerator.generatePlayerName();
        console.log(socket);
        socket.emit("username", username);

        socket.on("disconnect", () => {
            console.log("DISCONNECTED!");
        })
    });
};
