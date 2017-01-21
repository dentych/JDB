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

        });

        socket.on("current-data", (data) => {

        });

        socket.on("join-room", (data) => {

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
