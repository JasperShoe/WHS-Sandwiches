//todo: only allow sign in from Wayland student domain.
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

// Initializes the sign-in client. Called when page is loaded.
function start() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '137343299835-5vtibq9c072o11ullqob6d7snqes1530.apps.googleusercontent.com',
            ux_mode: 'redirect',
            hosted_domain: "student.wayland.k12.ma.us",
            fetch_basic_profile: true
        });
        auth2.then(function () {
            auth2.currentUser.listen(userChanged);
            if (window.location.pathname === "/WHS-Sandwiches/pages/login.html") {
                if (auth2.isSignedIn.get() && getCookie('authCode') !== null) {
                    window.location.replace(document.referrer);
                }
                else {
                    auth2.grantOfflineAccess().catch(notSignedIn).then(signInCallback);
                }
            }

        });


    });
}

let userChanged = function (user) {
    if (user){
        setCookie("email", user.getBasicProfile().getEmail(), 7);
        console.log(user.getHostedDomain());
    }
};

function notSignedIn() {
    window.location.href = "main.html";
}


function signInCallback(authResult) {
    // auth2.currentUser.listen(userChanged);
    setTimeout(function () {
        if (authResult['code']) {
            if (auth2.currentUser.get().getHostedDomain() === "student.wayland.k12.ma.us") {
                setCookie("authCode", authResult['code'], 7);
                window.location.replace(document.referrer);
            }
            else{
                alert(`Please sign in with your student email`)
            }
        }
        else {
            alert("There was an error signing in.");
        }
    }, 1000);

}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        window.location.href = "main.html";
        deleteCookie("authCode");
        deleteCookie("email");
        auth2.currentUser.listen(userChanged);
        console.log('User signed out.');
    });
}
