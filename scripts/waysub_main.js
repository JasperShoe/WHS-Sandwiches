$(document).ready(function () {
    processPagePermissions();
    loadHeaderAndFooter(getCurrentPath());
    setupDateListeners();
});

/*----------------------------URL/PATH HELPERS----------------------------*/

/** Returns api url based on where app is running. */
function get_api_url() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        return "http://localhost:3000/";
    } else {
        return "https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/";
    }
}

/** Gets the current path. */
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

let admin_emails = {};

/** Checks if the current user is permitted to access this page. If not, redirect them to their designated home page. */
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
            admin_emails = data['Admin']['emails'];
            let user_type = admin_emails.indexOf(getCookie('email')) > -1 ? data['Admin'] : data['Student'];
            user_type['forbiddenPages'].forEach(function (page) {
                if (getCurrentPath() === page) {
                    window.location.href = user_type['homePage'];
                }
            });
            data['Admin']['emails'].forEach(function (email) {
                admin_emails.push(email);
            });
        });
    }
}

/*----------------------------HEADERS/FOOTERS FOR NON-INDEX PAGES----------------------------*/

/** Loads the header and the footer of the page from the user's source page. */
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

/** Returns the next pickup date from the given start date. */
function getNextPickupDateFrom(startDate) {
    let nextPickupDate = new Date(startDate);
    if (startDate.getHours() >= 8) {
        nextPickupDate.setDate(startDate.getDate() + 1);
    }
    while (!isPickupDate(nextPickupDate)) {
        nextPickupDate.setDate(nextPickupDate.getDate() + 1)
    }
    nextPickupDate.setHours(10);
    nextPickupDate.setMinutes(40);
    return nextPickupDate;


}

/** Returns the previous pickup date from the given start date. */
function getPreviousPickupDateFrom(startDate) {
    let prevPickupDate = new Date(startDate);
    if (isPickupDate(startDate)) {
        prevPickupDate.setDate(startDate.getDate()-1)
    }
    while (!isPickupDate(prevPickupDate)) {
        prevPickupDate.setDate(prevPickupDate.getDate() - 1)
    }
    prevPickupDate.setHours(10);
    prevPickupDate.setMinutes(40);
    return prevPickupDate;
}

/** Returns true iff date argument is a Mon, Tues, or Wed. */
function isPickupDate(date) {
    let pickup_date_numbers = [1, 2, 3];
    return pickup_date_numbers.indexOf(date.getDay()) > -1;
}

/*----------------------------ALERTS----------------------------*/

/** Displays an HTML alert with msg as its text. */
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

/** Creates a holiday in the closed_dates collection. */
function createHoliday(name, month, date, year) {
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

/** Creates a date object given an array with values [month, date, year]. */
function createDateObject([month, date, year]) {
    return new Date(year, month - 1, date);
}

/** Provides functionality to the buttons on admin's closing dates page. */
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

/** Returns text of given text file. */
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status === 0) {
                var allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return rawFile.responseText;
}

/** Returns the letter day [A..H] of given date.
 * Returns null if given date is not a school day. */
function getLetterDay(desired_date) {
    desired_date = desired_date.toISOString().split("T")[0];
    // Break up the imported calendar file into each of its lines.
    let calendar_lines = readTextFile('2019-20_calendar.ics').split("\n");
    let events = [];
    let events_i = 0;
    for (i = 0; i < calendar_lines.length; i++) {
        // If 'DTSTART' is found, it's the date of an event (date is written after the colon), so convert the date and store it in a field in this object in events.
        if (calendar_lines[i].includes('DTSTART')) {
            let date = calendar_lines[i].split(":");
            events[events_i] = {date: convertDate(date[1])};
        }
        // The summary of the event, in this case, is the letter day, so store this value in another field.
        else if (calendar_lines[i].includes('SUMMARY')) {
            let title = calendar_lines[i].split(":");
            events[events_i]["title"] = title[1];
        }
        // 'END:VEVENT' indicates the end of an event entry, so go on to create the next event by incrementing events_i.
        else if (calendar_lines[i].includes('END:VEVENT')) {
            events_i++;
        }
    }
    // Now that we have the events array, find the event that corresponds to the date argument.
    const result = events.filter(event => event['date'] === desired_date);

    if (result.length){
        for (let i = 0; i < result.length; i++) {
            if (isLetterDay(result[i].title)) return result[i].title + " Day"
        }
    }
    return null;
}

/** Returns true iff given String is a letter day letter. */
function isLetterDay(letter) {
    letter = letter.trim()
    switch (letter) {
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
        case "G":
        case "H":
            return true;
        default:
            return false;

    }
}

/** Returns date with dashes (e.g. convertDate(20191031) returns 2019-10-31). */
function convertDate(dateNumber) {
    let dateString = dateNumber.toString();
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let date = dateString.substring(6, 8);
    return `${year}-${month}-${date}`
}