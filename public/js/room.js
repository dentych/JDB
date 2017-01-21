var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(function () {
    $("#session-name")[0].innerText = getUrlParameter("id");
});

var socket = io.connect(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port);

let isInBeef = false;

socket.on("username", (data) => {
    console.log("username: " + data);
    HideAllViews();
    $("#player-name")[0].innerText = data;
    $(".waiting-for-players").show();
});

socket.on("player-joined", (data) => {
    console.log("player-joined: " + data);
    HideAllViews();

    if(!isInBeef){
        $(".game-overview").show();
        $("#score-table tr:last").after('<tr>data</tr><tr></tr><tr>0</tr>');
    }
});

socket.on("player-leave", (data) => {
    console.log("player-leave: " + data);

    if(!isInBeef){
        HideAllViews();
    }
});

socket.on("beef", (data) => {
    console.log("beef: " + data);

    data.forEach(function (element) {
        if (element.name == $("#player-name")[0].innerText) {
            isInBeef = true;
            HideAllViews();
            $(".playing").show();
        }
        else {
            $(".opponent-name").text(element.name);
        }
    });
});

socket.on("shot", (data) => {
    console.log("shot: " + data);
    isInBeef = false;
    HideAllViews();
    $(".game-overview").show();
});

socket.on("current-data", (data) => {
    console.log("current-data: " + data);
});

function HideAllViews() {
    console.log("Hiding all views...");
    $("div.card > div").hide();
    console.log("All views hidden!")
}

$("#green").click(function () {
    console.log("emitting love");
    socket.emit('input', "love")
});

$("#red").click(function () {
    console.log("emitting hate");
    socket.emit('input', "hate")
});
