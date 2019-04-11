$(document).ready(function() {
    if (!getCookie('idToken') || getCookie("email") !== "waysubad@gmail.com") {
        window.location.href = "main.html";
    }
    $(".header").load("admin_main.html .header", function () {
        $('#login-button').css("display", "none");
        $('#logout-button').css("display", "block")
    });
    $(".footer").load("admin_main.html .footer");
});