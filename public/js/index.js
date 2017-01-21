$(document).ready(function() {
    $("#btnCreate").click(function () {
        var id = $.get(
            "/create-room",
            function (data) {
                window.location.href = "/room?id=" + data.id;
            }
        );
    });
});