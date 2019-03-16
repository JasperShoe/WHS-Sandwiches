let order;
const url = "http://localhost:3000/orders/";

// Populates the popup menu with an order summary and 'Finalize Order' button, then displays it on the screen.
function getPopupMenu(ord) {
    order = ord;
    const popup = document.getElementById("orderPopup");
    const span = document.getElementsByClassName("close")[0];
    const summary = $('#order_summary');
    summary.append('<p> Order Summary: </p>');
    summary.append(`<p> name: ${ord.student_email} </p>`);
    summary.append(`<ul> ingredients: </ul>`);
    for (let i = 0; i < ord.ingredients.length; i++) {
        summary.append(`<li> ${ord.ingredients[i].name} </li>`);
    }
    summary.append(`<p> date: ${ord.date} </p>`);
    summary.append('<button id = "confirm" onclick="postOrder()">Finalize Order</button>');
    popup.style.display = "block";
    span.onclick = function () {
        popup.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    };

}

// Called with 'Finalize Order' button. Puts the order into the database with a post request, then calls completeOrder().
function postOrder() {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(order),
        dataType: 'json',
        success: function (data){
            completeOrder(data._id);
        }
        // xhrFields: {
        //     withCredentials: true
        // }
    });

}

// Replaces popup text with confirmation message and save as favorite button, which calls a put method for the order.
function completeOrder(id) {
    const popup = document.getElementById("orderPopup");
    const span = document.getElementsByClassName("close")[0];
    const summary = $('#order_summary');
    summary.empty();
    summary.append(`<p> Your Order Has Been Submitted. </p>`);
    summary.append('<button class = "favoriteButton" onclick="makeFavorite(this.id)"> Save as Favorite</button>');
    var favButton = $('.favoriteButton');
    favButton.last().attr("id", id);
    popup.style.display = "block";

    span.onclick = function () {
        popup.style.display = "none";
        summary.empty();
    };
    window.onclick = function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
            summary.empty();
        }
    };

}

// Called when 'Save as Favorite' button is clicked - put request into db.
function makeFavorite(id) {
    $.ajax({
        url: url + id,
        method: 'PUT',
        data: {
            is_favorite: true
        },
        success: function () {
        }
    });

}

