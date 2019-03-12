function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
    console.log(error);
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var user_name = profile.getName();
    alert(user_name);
}

function renderButton() {
    gapi.signin2.render('signin', {
        'scope': 'profile email',
        // 'size': 130,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
