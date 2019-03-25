let finalOrder;
function clearModalsOnClick() {
    const order_summary = $('#order_summary_modal');
    const name_input = $('#favoriteName');
    const close = document.getElementsByClassName("close-button");
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            order_summary.empty();
            name_input.val("");
            getLastOrderDate();
        };
    }

}
function populateOrderModal(order_details) {
    const order_summary = $('#order_summary_modal');
    order_summary.append(`<tr><td><i class="fa fa-envelope" aria-hidden="true"></i></td><td><h3>email: ${order_details.student_email} </h3></td></tr>`);
    let arr = [];
    for (let i = 0; i < order_details.ingredients.length; i++) {
        arr.push(order_details.ingredients[i].name);
    }
    order_summary.append(`<tr><td><i class="fas fa-utensils"></i></td><td><h3>ingredients: ${arr}</h3></td></tr>`);
    order_summary.append(`<tr><td><i class="far fa-calendar"></i></td><td><h3> order date: ${order_details.order_date.toLocaleString()} </h3></td></tr>`);
    order_summary.append(`<tr><td><i class="far fa-calendar-check"></td><td><h3> pickup date: ${order_details.pickup_date.toLocaleDateString()} </h3></td></tr>`);
    order_summary.append(`<tr><td><i class="fa fa-list-ol" aria-hidden="true"></td><td><h3> lunch: ${order_details.which_lunch} </h3></td></tr>`);

    clearModalsOnClick();
    finalOrder = order_details;
}

function postOrder() {
    $.ajax({
        url: "http://localhost:3000/orders/",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(finalOrder),
        dataType: 'json'
    });
    $(window).scrollTop(0);
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    const selectedLunch = $("input[name='lunch']:checked");
    clearChecklist(checkboxes, selectedLunch);
    collapseAll();
}

function nameFavoriteOrder() {
    const saveFavoriteButton = $('#save_favorite_button');
    saveFavoriteButton.attr("data-dismiss", null);
    // const make_favorite = $('#make_favorite_modal');
    // make_favorite.append(`<input class="customInput" id="favoriteName" type="text" maxlength="15" placeholder="Name this Favorite">`);
}


function saveFavoriteOrder(){
    getLastOrderDate();
    const saveFavoriteButton = $('#save_favorite_button');
    let favName = document.getElementById("favoriteName").value;
    if (favName){
        saveFavoriteButton.attr("data-dismiss", "modal");
        let favOrder = {
            student_email: getCookie("email"),
            ingredients: finalOrder.ingredients,
            favorite_name: favName
        };
        $.ajax({
            url: "http://localhost:3000/favorite_orders/",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(favOrder),
            dataType: 'json',
            success: function (new_favorite_order){
                showAlert(new_favorite_order.favorite_name);
            }
        });
        const order_summary = $('#order_summary_modal');
        order_summary.empty();
        const name_input = $('#favoriteName');
        name_input.val("");
    }
    else {
        alert("Please enter name for this favorite.")
    }
}

function clearChecklist(checks, radio) {
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            checks[i].checked = false;
        }
    }
    radio.attr('checked', false);
}

function collapseAll() {
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
