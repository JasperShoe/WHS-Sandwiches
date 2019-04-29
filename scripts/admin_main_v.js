$(document).ready(function () {
    let signInButton = $('#login-button');
    let signOutButton = $('#logout-button');
    if (getCookie("idToken") && getCookie("email") === "waysubad@gmail.com") {
        signInButton.css("display", "none");
        signOutButton.css("display", "block")
    } else {
        window.location.href = "main.html";
        signInButton.css("display", "block");
        signOutButton.css("display", "none")
    }
});