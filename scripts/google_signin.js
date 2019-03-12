// Initializes the sign-in client. Called when page is loaded.
function start() {
    gapi.load('auth2', function () {
        console.log("started");
        auth2 = gapi.auth2.init({
            client_id: '137343299835-5vtibq9c072o11ullqob6d7snqes1530.apps.googleusercontent.com'
        })
    });
}

// Called when someone clicks on the "Create Your Sandwich" tab.
function signIn() {

    // Check if user is signed in. If they are, go straight to customize page. If not, go to sign-in screen.
    if (auth2.isSignedIn.get()) {
        window.location.href = "customize.html";
    } else
        auth2.grantOfflineAccess().then(signInCallback);
}

function signInCallback(authResult) {
    if (authResult['code']) {
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
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
