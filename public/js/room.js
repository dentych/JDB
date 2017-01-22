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

    $(".waiting-for-players").show();
});

var socket = io.connect(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port);

let myUsername = "no username";
let users = [];
let currentBeef = [];

socket.on("username", (data) => {
    console.log("username: " + data);

    myUsername = data;
    $("#player-name")[0].innerText = data;

    socket.emit("join-room");
});

socket.on("player-joined", (data) => {
    console.log("player-joined: " + data);
    if (data.name != myUsername) {
        users.push({name: data.name, consumed: 0});
    }
});

socket.on("player-leave", (data) => {
    console.log("player-leave: " + data);

    let index = users.findIndex(function (user) {
        return user.name == data;
    });
    users.splice(index, 1);

    if (users.length < 2) {
        HideAllViews();
        $(".waiting-for-players").show();
    }
});

socket.on("beef", (data) => {
    console.log("beef: " + data);

    HideAllViews();

    currentBeef = data;

    let userIndex = findUserInBeef(data);
    let opponentIndex = userIndex == 0 ? 1 : 0;

    if (userIndex >= 0) {
        $(".opponent-name").text(data[opponentIndex].name);
        $(".playing").show();
    } else {
        showOverview();
    }
});

socket.on("shot", (data) => {
    console.log("shot: " + data);

    data.forEach(function (drinkingPlayer) {
        let index = users.findIndex(function (user) {
            return user.name == drinkingPlayer.name;
        });
        users[index].consumed += drinkingPlayer.consumed;
    });
});

socket.on("current-data", (data) => {
    console.log("current-data: ");
    console.log(data);

    data.players.forEach(function (element) {
        users.push({
            name: element.name,
            consumed: element.consumed
        });
    });

    currentBeef = data.nowPlaying;

    if (users.length > 2) {
        HideAllViews();
        showOverview();
    }
});


socket.on("result", function (data) {
    HideAllViews();
    switch (data) {
        case "lost":
            $(".result-lost").show();
            break;
        case "enemy":
            $(".result-enemy").show();
            break;
        case "diplomat":
            $(".result-friend").show();
            break;
        case "won":
            $(".result-won").show();
            break;
    }
});

function HideAllViews(duration = 400) {
    console.log("Hiding all views...");
    $("div.card > div").hide(duration);
    console.log("All views hidden!")
}

$("#green").click(function () {
    console.log("emitting love");
    OnChoiceSelected();
    socket.emit('input', "love")
});

$("#red").click(function () {
    console.log("emitting hate");
    OnChoiceSelected();
    socket.emit('input', "hate")
});

function OnChoiceSelected() {
    HideAllViews();
    $(".choice-registered").show();
}

function findUserInBeef(beefData) {
    return beefData.findIndex(function (beefUser) {
        return beefUser.name == $("#player-name")[0].innerText;
    });
}

function showOverview() {
    var tbody = $("#score-table tbody");
    tbody.empty();
    users.forEach((user) => {
        var metadata = "";
        if (user.name == myUsername) {
            metadata = "(you)";
        } else if (isPlaying(user)) {
            metadata = "Playing";
        }
        tbody.append("<tr><td>" + user.name + "</td><td>" + metadata + "</td><td>" + user.consumed + "</td></tr>")
    });
    $(".game-overview").show();
}

function isPlaying(user) {
    var index = currentBeef.findIndex(function (element) {
        return element.name == user.name;
    });

    return index >= 0;
}