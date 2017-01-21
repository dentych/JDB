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
let myUsername = "no username";

let users = [];

socket.on("username", (data) => {
    console.log("username: " + data);
    HideAllViews();

    myUsername = data;
    $("#player-name")[0].innerText = data;
    $(".waiting-for-players").show();
});

socket.on("player-joined", (data) => {
    console.log("player-joined: " + data);
    HideAllViews();
    users.push({name: data.name, consumed: 0});

    if (!isInBeef) {
        $(".game-overview").show();
        $("#score-table tr:last").after('<tr>data</tr><tr></tr><tr>0</tr>');
    }
});

socket.on("player-leave", (data) => {
    console.log("player-leave: " + data);

    let index = users.findIndex(function (element) {
        return element.name == data;
    });
    users.splice(index, 1);
});

socket.on("beef", (data) => {
    console.log("beef: " + data);

    $(".choice-registered").hide();

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

    data.forEach(function (drinkingPlayer) {
        let index = users.findIndex(function (user) {
            return user.name == data.name;
        });
        users[index].consumed += drinkingPlayer.consumed;
    });
});

socket.on("current-data", (data) => {
    console.log("current-data: " + data);
});


socket.on("result", function(data){
    HideAllViews();
   switch (data){
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