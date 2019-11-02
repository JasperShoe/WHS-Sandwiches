let auth2;
let googleUser;

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

var start = function() {
    gapi.load('auth2', initSigninV2);
};

var initSigninV2 = function() {
    auth2 = gapi.auth2.init({
        client_id: '137343299835-5vtibq9c072o11ullqob6d7snqes1530.apps.googleusercontent.com',
        scope: 'profile',
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
        showSignOutButton()
        if (googleUser.getHostedDomain() === "student.wayland.k12.ma.us") {
            setCookie("idToken", id_token, 7);
            setCookie("email", googleUser.getBasicProfile().getEmail());
        }
        else if (googleUser.getBasicProfile().getEmail() === "waysubad@gmail.com") {
            setCookie("idToken", id_token, 7);
            setCookie("email", googleUser.getBasicProfile().getEmail());
            let currentPath = getCurrentPath();
            if (currentPath === "/main.html" || currentPath === "/"){
                window.location.href = "admin_main.html"
            }
        }
        else{
            logOut();
        }

    }

};

var refreshValues = function() {
    if (auth2){
        googleUser = auth2.currentUser.get();
    }
};

function goToPage(url) {
    auth2.currentUser.listen(userChanged);
    if (googleUser.isSignedIn()) {
        if(!readTextFile("/WHS-Sandwiches/blacklist").includes(googleUser.getBasicProfile().getEmail().toLowerCase())) {
            if (googleUser.getHostedDomain() === "student.wayland.k12.ma.us" || getCookie("email") === "waysubad@gmail.com") {
                window.location.href = url;
            } else {
                alert('Please use your student email to sign in')
            }
        } else {
            alert('You are blacklisted');
            window.location.href = "https://blcklst.com"
        }
    }
    else {
        alert('Error: you are not signed in');
    }
}
function logIn() {
    if (auth2){
        auth2.signIn();
    }
    else {
        start();
    }
}

function logOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
        auth2.disconnect();
        auth2.signOut().then(signOutCallback());
    }
    else
        signOutCallback();

}

function signOutCallback() {
    deleteCookie("idToken");
    deleteCookie("email");
    showSignInButton();
    let currentPath = getCurrentPath();
    if (currentPath !== "/main.html" || currentPath !== "/"){
        window.location.href = "main.html";
    }
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return rawFile.responseText;
}