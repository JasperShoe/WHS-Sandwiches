$(document).ready(function () {
    processPagePermissions();
    loadHeaderAndFooter(getCurrentPath());
    setupDateListeners();
});

/*----------------------------URL/PATH HELPERS----------------------------*/

function get_api_url() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        return "http://localhost:3000/";
    } else {
        return "https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/";
    }
}

function getCurrentPath() {
    if (window.location.hostname === "localhost") {
        return "/" + window.location.pathname.split('/')[2];
    } else {
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

function processPagePermissions() {
    if (!getCookie('idToken')) {
        if (getCurrentPath() !== "/main.html") {
            window.location.href = "main.html";
        }
        showSignInButton();
    } else {
        showSignOutButton();
        let perms = $.getJSON('user_types.json');
        perms.success(function (data) {
            emails = data['Admin']['emails'];
            let user_type = emails.indexOf(getCookie('email')) > -1 ? data['Admin'] : data['Student'];
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

/*----------------------------HEADERS/FOOTERS FOR NON-INDEX PAGES----------------------------*/

function loadHeaderAndFooter(url) {
    if (!url.includes("main")) {
        let source_page;
        if (url.includes("admin")) {
            source_page = "admin_main.html"
        } else {
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
    while (getLetterDay(nextPickupDate) === null) {
        nextPickupDate.setDate(nextPickupDate.getDate() + 1)
    }
    return nextPickupDate;


}

function getPreviousPickupDateFrom(startDate) {
    let prevPickupDate = new Date(startDate);
    if (getLetterDay(startDate) !== null) {
        prevPickupDate.setDate(startDate.getDate() - 1)
    }
    while (getLetterDay(prevPickupDate) === null) {
        prevPickupDate.setDate(prevPickupDate.getDate() - 1)
    }
    return prevPickupDate;
}

/*----------------------------ALERTS----------------------------*/
function showAlert(msg) {
    let alert = document.getElementsByClassName("alert")[0];
    const alert_text = $(".alert-msg");
    alert_text.text("");
    $(window).scrollTop(0);
    alert.style.display = "block";
    alert.style.opacity = "100";
    alert_text.text(msg)
}

function closeAlert(div) {
    div.style.opacity = "0";
    setTimeout(function () {
        div.style.display = "none"
    }, 600);
}

/*----------------------------DATES/LETTER DAYS----------------------------*/

function createHoliday(name, month, date, year) {
    console.log(name, month, date, year);
    let date_obj = createDateObject([month, date, year])
    $.ajax({
        url: get_api_url() + "closed_dates/",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            date: date_obj,
            year: year,
        }),
        dataType: 'json'
    });
}


function createDateObject([month, date, year]) {
    return new Date(year, month - 1, date);
}

function setupDateListeners() {
    $('#holiday-confirm').on("click", function () {
        let date = new Date($('#holiday-input').val());
        let holidayName = $('#holiday-name').val()
        if (date && holidayName){
            createHoliday(holidayName, date.getMonth() + 1, date.getDate(), date.getFullYear())
            showAlert("Holiday successfully created.")
        }
        else
            alert('Invalid date or holiday name')
    });
}

function getLetterDay(desired_date) {
    desired_date = desired_date.toISOString().split("T")[0];
    let lines = readTextFile('/WHS-Sandwiches/letter_days.ics').split("\n");
    let events = [];
    let events_i = 0;
    for (i = 0; i < lines.length; i++) {
        if (lines[i].includes('DTSTART')) {
            var date = lines[i].split(":");
            events[events_i] = {date: convertDate(date[1])};
        } else if (lines[i].includes('SUMMARY')) {
            var title = lines[i].split(":");
            events[events_i]["title"] = title[1];
        } else if (lines[i].includes('END:VEVENT')) {
            events_i++;
        }
    }
    const result = events.filter(event => event['date'] === desired_date);
    if (result.length)
        return result[0].title + " Day";
    else
        return null;
}
function convertDate(dateNumber) {
    let dateString = dateNumber.toString();
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let date = dateString.substring(6, 8);
    return `${year}-${month}-${date}`
}