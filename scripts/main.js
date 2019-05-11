$(document).ready(function () {
    processPagePermissions();
    loadHeaderAndFooter(getCurrentPath());
    completeOldOrders();
});

/*----------------------------URL/PATH HELPERS----------------------------*/

function get_api_url(){
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        return "http://localhost:3000/";
    }
    else {
        return "https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/";
    }
}

function getCurrentPath() {
    if (window.location.hostname === "localhost"){
        return "/" + window.location.pathname.split('/')[2];
    }
    else {
        return window.location.pathname;
    }
}

/*----------------------------SIGN IN/PERMISSIONS----------------------------*/

function showSignInButton() {
    $('#login-button').css("display", "block");
    $('#logout-button').css("display", "none")
}

function showSignOutButton() {
    $('#login-button').css("display", "none");
    $('#logout-button').css("display", "block")
}

let emails = {};
function processPagePermissions(){
    if (!getCookie('idToken')) {
        if (getCurrentPath() !== "/main.html") {
            window.location.href = "main.html";
        }
        showSignInButton();
    }
    else {
        showSignOutButton();
        let perms = $.getJSON('user_types.json');
        perms.success(function (data) {
            emails = data['Admin']['emails'];
            let user_type = isAdmin(getCookie('email'))? data['Admin'] : data['Student'];
            user_type['forbiddenPages'].forEach(function (page) {
                if (getCurrentPath() === page) {
                    window.location.href = user_type['homePage'];
                }
            });
            data['Admin']['emails'].forEach(function (email) {
                emails.push(email);
            });
        });
    }
}

function isAdmin(email) {
    for (let i = 0; i < emails.length; i++) {
        return (email === emails[i]);
    }

}

/*----------------------------HEADERS/FOOTERS FOR NON-INDEX PAGES----------------------------*/

function loadHeaderAndFooter(url) {
    if (!url.includes("main")) {
        let source_page;
        if (url.includes("admin")) {
            source_page = "admin_main.html"
        }
        else {
            source_page = "main.html"
        }
        $(".header").load(`${source_page} .header`, function () {
            showSignOutButton();
        });
        $(".footer").load(`${source_page} .footer`);
    }

}

/*----------------------------PICKUP DATE/ORDER FUNCTIONS----------------------------*/
function getNextPickupDateFrom(startDate) {
    let nextPickupDate = new Date(startDate);
    if (startDate.getHours() >= 8) {
        nextPickupDate.setDate(startDate.getDate() + 1);
    }
    while (!isPickupDate(nextPickupDate)) {
        nextPickupDate.setDate(nextPickupDate.getDate() + 1)
    }
    return nextPickupDate;


}
function getPreviousPickupDateFrom(startDate) {
    let prevPickupDate = new Date(startDate);
    if (isPickupDate(startDate)) {
        prevPickupDate.setDate(startDate.getDate()-1)
    }
    while (!isPickupDate(prevPickupDate)) {
        prevPickupDate.setDate(prevPickupDate.getDate() - 1)
    }
    return prevPickupDate;
}

function isPickupDate(date) {
    switch (date.getDay()) {
        case 1:
        case 2:
        case 3:
            return true;
        default:
            return false;
    }
}

function completeOldOrders() {
    let orderPromise = $.get(get_api_url() + "orders");
    orderPromise.success(function (pastOrders) {
        for (let i = 0; i < pastOrders.length; i++) {
            $.ajax({
                url: get_api_url() + "orders/" + pastOrders[i]._id,
                method: 'PUT',
                data: {
                    is_completed: new Date(pastOrders[i].pickup_date) < new Date()
                }
            });
        }
    });
}

/*----------------------------ALERTS----------------------------*/
function showAlert(msg){
    let alert = document.getElementsByClassName("alert")[0];
    const alert_text = $(".alert-msg");
    alert_text.text("");
    $(window).scrollTop(0);
    alert.style.display = "block";
    alert.style.opacity = "100";
    alert_text.text(msg)
}

function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"}, 600);
}