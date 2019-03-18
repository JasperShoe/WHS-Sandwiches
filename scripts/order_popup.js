let order;
const orderUrl = "http://localhost:3000/orders/";

// Populates the popup menu with an order summary and 'Finalize Order' button, then displays it on the screen.
function displayOrderSummary(ord) {
    order = ord;
    const popup = document.getElementById("orderPopup");
    const close = document.getElementsByClassName("close")[0];
    const summary = $('#order_summary');
    summary.append('<br><p> Order Summary: </p>');
    summary.append(`<p> name: ${ord.student_email} </p>`);
    summary.append(`<ul> ingredients: </ul>`);
    for (let i = 0; i < ord.ingredients.length; i++) {
        summary.append(`<li>${ord.ingredients[i].name}</li>`);
    }
    summary.append(`<p> date: ${ord.date} </p>`);
    summary.append(`<p> lunch: ${ord.which_lunch} </p>`);
    summary.append('<button id = "confirm" onclick="postOrder()">Finalize Order</button>');
    popup.style.display = "block";
    close.onclick = function () {
        summary.empty();
        popup.style.display = "none";
        $(window).scrollTop(0);
    };
}

// Called with 'Finalize Order' button. Puts the order into the database with a post request, then calls orderCompleted().
function postOrder() {
    $.ajax({
        url: orderUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(order),
        dataType: 'json',
        success: function (data){
            orderCompleted(data._id);
        }
    });
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    const selectedLunch = $("input[name='lunch']:checked");
    clearChecklist(checkboxes, selectedLunch);

}

// Replaces popup text with confirmation message and save as favorite button, which calls a put method for the order.
function orderCompleted(order_id) {
    const popup = document.getElementById("orderPopup");
    const close = document.getElementsByClassName("close")[0];
    const summary = $('#order_summary');
    //todo: consider having two popups and hide one of them instead of clearing it
    summary.empty();
    summary.append(`<p> Your Order Has Been Submitted. </p>`);
    summary.append(`<div class="favoriteSaver"><input id="favoriteName" type="text" maxlength="15" placeholder="Name this Favorite"><button id = "favoriteButton" onclick="makeFavorite('${order_id}')"> Save as Favorite</button></div>`);

    // let favButton = $('#favoriteButton');
    // favButton.last().attr("id", order_id);
    popup.style.display = "block";

    close.onclick = function () {
        summary.empty();
        popup.style.display = "none";
        $(window).scrollTop(0);
        collapseAll();
    };
}

// Called when 'Save as Favorite' button is clicked - put request into db.
function makeFavorite(id) {
    let favName = document.getElementById("favoriteName").value;
    if (favName){
        $.ajax({
            url: orderUrl + id,
            method: 'PUT',
            data: {
                is_favorite: true,
                favorite_name: favName
                // to remove favorite, set favorite_name to null
            },
            success: confirmFavoriteAddition(favName)
        });
    }
    else {
        alert("Please name this favorite.")
    }
}

function confirmFavoriteAddition(name){
    const msg = $(".alerts");
    msg.append(`<div class="alert"><span class="closebtn" onclick="closeAlert(this.parentElement)">&times;</span>"${name}" has been saved to your favorites. </div>`);

    collapseAll();
    const popup = document.getElementById("orderPopup");
    const summary = $('#order_summary');
    summary.empty();
    popup.style.display = "none";
    $(window).scrollTop(0);

    let alert = document.getElementsByClassName("alert")[0];
    alert.style.display = "block";
    alert.style.opacity = "100";
}
function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"; }, 600);
}

function collapseAll(){
    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {
        acc[i].classList.remove("active");
        let panel = acc[i].nextElementSibling;
        while (panel) { // While the next element exists
            if (panel.style.maxHeight) { // If the panel has a maxHeight (meaning it's open), then close it
                panel.style.maxHeight = null;
            }

            // Keep going to the next element to open it until we hit the next accordion (which will be a button).
            // If we hit a button, terminate the while loop by setting the panel to null.
            if (panel.nextElementSibling === null)
                panel = null;
            else if (panel.nextElementSibling.nodeName.toLowerCase() === "button")
                panel = null;
            else
                panel = panel.nextElementSibling;
        }

    }
}

function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"; }, 600);
}

