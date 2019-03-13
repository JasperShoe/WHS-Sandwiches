function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
function deleteCookie(name) { setCookie(name, '', -1); }

// Initializes the sign-in client. Called when page is loaded.
function start() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '137343299835-5vtibq9c072o11ullqob6d7snqes1530.apps.googleusercontent.com'
        });
        auth2.then(function () {

                if (!auth2.isSignedIn.get() && (window.location.pathname === "/WHS-Sandwiches/pages/login.html"
                    || window.location.pathname === "/WHS-Sandwiches/pages/customize.html")){
                    auth2.grantOfflineAccess().catch(notSignedIn).then(signInCallback);
                }
                else if(auth2.isSignedIn.get() && window.location.pathname === "/WHS-Sandwiches/pages/login.html"){
                    window.location.href = "customize.html";
                }


        })
    });
}
function notSignedIn(){
    window.location.href = "main.html";
}


function signInCallback(authResult) {
    if (authResult['code']) {
        setCookie("authCode", authResult['code'], 7);
        window.location.href = "customize.html";

        // Send the code to the server
        $.ajax({
            type: 'POST',
            url: 'http://example.com/storeauthcode',
            // Always include an `X-Requested-With` header in every AJAX request,
            // to protect against CSRF attacks.
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            contentType: 'application/octet-stream; charset=utf-8',
            success: function (result) {
                // Handle or verify the server response.
            },
            processData: false,
            data: authResult['code']
        });
    } else {
        // There was an error.
    }
}

function signOut() {
    if (window.location.pathname === "/WHS-Sandwiches/pages/customize.html")
        window.location.href = "main.html";
    deleteCookie("authCode");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
