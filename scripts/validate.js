$(document).ready(function() {
    if (!getCookie('idToken')) {
        alert('Error: you are not signed in');
        window.location.href = "main.html";
    }
    else if(getCookie('email') === 'waysubad@gmail.com'){
        window.location.href = "admin_main.html";
    }
    $(".header").load("main.html .header", function () {
        $('#login-button').css("display", "none");
        $('#logout-button').css("display", "block")
    });
    $(".footer").load("main.html .footer");
});