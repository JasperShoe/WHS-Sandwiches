$(document).ready(function () {
    $('#login-button').click(function () {
        if (auth2)
            auth2.signIn();
    });
});

function getCookie(name) {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    let d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

// Load the auth2 library, then initialize the GoogleAuth object.
var start = function () {
    gapi.load('auth2', initSigninV2);
};

let auth2;
let googleUser;
var initSigninV2 = function () {
    auth2 = gapi.auth2.init({
        client_id: '137343299835-5vtibq9c072o11ullqob6d7snqes1530.apps.googleusercontent.com',
        scope: 'profile'
    });
    auth2.currentUser.listen(userChanged);
    if (auth2.isSignedIn.get() === true)
        auth2.signIn();
    refreshValues();
};

let userChanged = function (user) {
    googleUser = user;
    let id_token = googleUser.getAuthResponse().id_token;
    if (id_token) {
        let email = googleUser.getBasicProfile().getEmail();
        let domain = googleUser.getHostedDomain();
        showSignOutButton();
        if (domain === "student.wayland.k12.ma.us" || readTextFile("whitelist").includes(email.toLowerCase())) {
            setCookie("idToken", id_token, 7);
            setCookie("email", email);
            let currentPath = getCurrentPath();
            if (email === "waysubad@gmail.com" && (currentPath === "/main.html" || currentPath === "/")) {
                window.location.href = "admin_main.html"
            }
        }
        else {
            logOut();
        }

    }

};

var refreshValues = function () {
    if (auth2) {
        googleUser = auth2.currentUser.get();
    }
};

function goToPage(url) {
    if (getCookie("idToken")) {
        window.location.href = url;
    } else {
        alert("Error: You are not signed in.");
        start();
    }

}

function logIn() {
    if (auth2) {
        auth2.signIn();
    } else {
        start();
    }
}

function logOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
        auth2.disconnect();
        auth2.signOut().then(signOutCallback());
    } else
        signOutCallback();

}

function signOutCallback() {
    deleteCookie("idToken");
    deleteCookie("email");
    showSignInButton();
    let currentPath = getCurrentPath();
    if (currentPath !== "/main.html" || currentPath !== "/") {
        window.location.href = "main.html";
    }
}