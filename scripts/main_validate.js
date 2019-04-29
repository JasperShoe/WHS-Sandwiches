$(document).ready(function () {
    let signInButton = $('#login-button');
    let signOutButton = $('#logout-button');
    if (getCookie("idToken")) {
        if(getCookie('email') === 'waysubad@gmail.com'){
            window.location.href = "admin_main.html";
        }
        signInButton.css("display", "none");
        signOutButton.css("display", "block")
    } else {
        signInButton.css("display", "block");
        signOutButton.css("display", "none")
    }
});