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

socket.on("username", (data) => {
    console.log(data);
    $("#player-name")[0].innerText = data;
    HideAllViews();
    $(".waiting-for-players").show();
});

socket.on("player-joined", (data) => {
    console.log(data);
    HideAllViews();
    $(".game-overview").show();
    $("#score-table tr:last").after('<tr>data</tr><tr></tr><tr>0</tr>');
});

socket.on("player-leave", (data) => {
    console.log(data);
    HideAllViews();
});

socket.on("beef", (data) => {
    console.log(data);
    HideAllViews();
    $(".playing").show();

});

socket.on("shot", (data) => {
    console.log(data);
    HideAllViews();
    $(".game-overview").show();
});

socket.on("current-data", (data) => {
    console.log(data);
});

function HideAllViews() {
    $("div.card > div").hide();
}
