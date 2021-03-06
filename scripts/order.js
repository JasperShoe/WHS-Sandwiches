/** Gets new order data and configures HTML for the lunch button and letter day reminders. */
$(document).ready(function () {
    getLastOrderDate();
    getOrdersLength();
    let nextPickup = getNextPickupDateFrom(new Date());
    let letterDayReminderHTML = getLetterDay(nextPickup) !== null ? `(${nextPickup.toDateString()} is a ${getLetterDay(nextPickup)})` : ``;
    $('#letter-day-reminder').html(`<h3>Select Lunch ${letterDayReminderHTML}</h3>`)
    $('#getLunchButton').on("click", function () {
        getLunch($('#classSelectBox option:selected').val(), $('#quarterSelectBox option:selected').val(), function (selected_lunch) {
            $(`input[type=radio][value=${selected_lunch}]`).prop("checked",true);
        })
    })
});

/** Gets the lunch number that corresponds to the class name and quarter and passes it into the callback function. */
function getLunch(className, quarter, callback){
    $.getJSON('res/lunches.json', function (lunches) {
        let lunch = lunches['Quarter' + quarter][className]
        callback(lunch);
    })

}

let lastOrdersPickupDate;
let dailyOrderCount;

/** Gets the date of the last order and stores it in lastOrdersPickupDate. */
function getLastOrderDate(){
    let ordersPromise = $.get(get_api_url() + "orders", {
        student_email: getCookie("email"),
        sort: {order_date: -1}
    });
    ordersPromise.success(function (orders) {
        if (orders.length !== 0) {
            lastOrdersPickupDate = new Date(orders[0].pickup_date)
        }
    })
}

/** Gets the number of orders that have been submitted today and stores it in dailyOrderCount. */
function getOrdersLength(){
    let ordersPromise = $.get(get_api_url() + "orders", {
        pickup_date: getNextPickupDateFrom(new Date()),
        sort: {order_date: -1}
    });
    ordersPromise.success(function (newest_orders) {
        dailyOrderCount = newest_orders.length;
    })
}

let ingredient_types_json, ingredients_json, favorites_json;
$.get(get_api_url() + 'ingredient_types', function (json) {
    ingredient_types_json = json;
});
$.get(get_api_url() + 'ingredients', function (json) {
    ingredients_json = json;
});
$.get(get_api_url() + 'favorite_orders', function (json) {
    favorites_json = json;
});

/** Toggles the order customizer. */
function showCustomizer(bool) {
    let customize = document.getElementById('orderFromCustomize');
    let favorite = document.getElementById('orderFromFavorite');
    customize.classList.toggle("active");
    favorite.classList.toggle("active");
    let customizer_div = $('#customizer');
    let favorite_div = $('#favorite-chooser');
    if (bool) {
        customizer_div.css("display", "");
        favorite_div.css("display", "none")
    }
    else {
        customizer_div.css("display", "none");
        favorite_div.css("display", "")
    }
}


let orderDetails, selectedLunch;

/** Processes selected ingredient and builds the user's order from them. */
function buildOrder() {
    let customizer_div = $('#customizer');
    let favoriter_div = $('#favorite-chooser');
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    let orderIngredients = [];
    $('#customizeFinalizeButton').css("display", customizer_div.css("display"));
    $('#favoriteFinalizeButton').css("display", favoriter_div.css("display"));
    if(customizer_div.css("display") !== "none") {
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                let ingredientPanel = checkboxes[i].parentElement.parentElement;
                orderIngredients.push({
                    ingredient_type_id: ingredientPanel.getAttribute("data-ingredient-type-id"),
                    _id: ingredientPanel.getAttribute("data-ingredient-id"),
                    name: checkboxes[i].parentElement.innerText
                });
            }
        }
    }
    else {
        let favoriteID = $('#favoriteSelector option:selected').attr("data-favorite-order-id");
        for (let i = 0; i < favorites_json.length; i++) {
            if (favorites_json[i]._id === favoriteID) {
                orderIngredients = favorites_json[i].ingredients;
            }
        }
    }
    selectedLunch = $("input[name='lunch']:checked");
    let currentDate = new Date();
    let createOrderButton = $('#createOrder');
    if (ingredientsAreAvailable(orderIngredients) && isValidOrder(orderIngredients) && !alreadyOrderedToday(getNextPickupDateFrom(new Date())) && underOrderCapacity()) {
        createOrderButton.attr("data-toggle", "modal");
        createOrderButton.attr("data-target", "#myModal1");
        orderDetails = {
            student_email: getCookie("email"),
            ingredients: orderIngredients,
            which_lunch: selectedLunch.val(),
            order_date: currentDate,
            pickup_date: getNextPickupDateFrom(new Date())
        };
        populateOrderModal(orderDetails);
    } else {
        createOrderButton.attr("data-toggle", null);
        createOrderButton.attr("data-target", null);
    }
}

/** Returns true iff the selected ingredients are all available. */
function ingredientsAreAvailable(selected_ingredients) {
    let unavailableIngredients = [];
    for (let i = 0; i < ingredients_json.length; i++) {
        for (let j = 0; j < selected_ingredients.length; j++) {
            let thisIngredientID = selected_ingredients[j]._id;
            if (thisIngredientID === ingredients_json[i]._id && !ingredients_json[i].is_available) {
                unavailableIngredients.push(ingredients_json[i].name);
            }
        }
    }
    if (unavailableIngredients.length === 0) {
        return true;
    }
    else {
        alert(`Error: the following ingredients are not available today: ${unavailableIngredients}`);
        return false;
    }

}

/** = whether the user has already placed an order today. */
function alreadyOrderedToday(pick_up_date) {
    if (!lastOrdersPickupDate) {
        return false;
    }
    if (pick_up_date.getDate() === lastOrdersPickupDate.getDate()) {
        alert(`Error: you already have an order placed for ${lastOrdersPickupDate.toLocaleDateString()}`);
        return true
    }
    else {
        return false;
    }

}

/** Returns true if under order capacity. Returns false otherwise and alerts user. */
function underOrderCapacity() {
    if (dailyOrderCount < 25) {
        return true;
    }
    else {
        alert(`We have already received the maximum number of orders for ${getNextPickupDateFrom(new Date()).toLocaleDateString()}`);
        return false;
    }
}


/** Checks the following errors: no bread selected, over limit, too few ingredients, and no lunch selected.
 * If none of these errors exist, return true. Otherwise, return false and alert user. */
function isValidOrder(selected_ingredients) {
    if (selected_ingredients.length <= 1) {
        alert(`Error: you must select more than one ingredient.`);
        return false;
    }
    if (selectedLunch && !selectedLunch.val()) {
        alert(`Error: you must select a lunch.`);
        return false;
    }
    for (let i = 0; i < ingredient_types_json.length; i++) {
        let counter = 0;
        for (let j = 0; j < selected_ingredients.length; j++) {
            if (selected_ingredients[j].ingredient_type_id === ingredient_types_json[i]._id) {
                counter++;
            }
        }
        if (counter < ingredient_types_json[i].minimum) {
            alert(`Error: you have selected too few ${ingredient_types_json[i].name}s`);
            return false;
        } else if (counter > ingredient_types_json[i].maximum) {
            alert(`Error: you have selected too many ${ingredient_types_json[i].name}s`);
            return false;
        }
    }
    return true;
}

let finalOrder;

/** Populates order modal with the details of the user's order. */
function populateOrderModal(order_details) {
    const order_summary = $('#order_summary_modal');
    order_summary.empty();
    order_summary.append(`<tr><td><i class="fa fa-envelope" aria-hidden="true"></i></td><td><h3>email: ${order_details.student_email} </h3></td></tr>`);
    let arr = [];
    for (let i = 0; i < order_details.ingredients.length; i++) {
        arr.push(order_details.ingredients[i].name);
    }
    order_summary.append(`<tr><td><i class="fas fa-utensils"></i></td><td><h3>ingredients: ${arr}</h3></td></tr>`);
    order_summary.append(`<tr><td><i class="far fa-calendar"></i></td><td><h3> order date: ${order_details.order_date.toLocaleString()} </h3></td></tr>`);
    order_summary.append(`<tr><td><i class="far fa-calendar-check"></td><td><h3> pickup date: ${order_details.pickup_date.toLocaleDateString()} </h3></td></tr>`);
    order_summary.append(`<tr><td><i class="fa fa-list-ol" aria-hidden="true"></td><td><h3> lunch: ${order_details.which_lunch} </h3></td></tr>`);
    order_summary.append(`<tr><td></td><td><h3 style="color: red;font-size: 1em;margin-left: -20px">Please make sure that you still pay for your sandwich. Also note that if you <br> submit an order and do not pick it up at lunch, your lunch account will still be <br>charged.</h3></td></tr>`);
    clearModalsOnClick();
    finalOrder = order_details;
}

/** Posts order to the db. */
function postOrder() {
    $.ajax({
        url: get_api_url() + "orders",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(finalOrder),
        success: function(){
            getLastOrderDate();
            getOrdersLength();
        },
        dataType: 'json'
    });
    showAlert(`Your order has been submitted.`);
    $(window).scrollTop(0);
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    const selectedLunch = $("input[name='lunch']:checked");
    clearChecklist(checkboxes, selectedLunch);
    collapseAll();
}

/** Requires user to name their favorite order. */
function nameFavoriteOrder() {
    $('#save_favorite_button').attr("data-dismiss", null);
}

/** Saves a favorite order to the db. */
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
            url: get_api_url() + "favorite_orders/",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(favOrder),
            dataType: 'json',
            success: function (new_favorite_order){
                showAlert(`"${new_favorite_order.favorite_name}" has been saved to your favorites.`);
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

/** Deselects all selected boxes on page. */
function clearChecklist(checks, radio) {
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            checks[i].checked = false;
        }
    }
    radio.attr('checked', false);
}

/** Collapses all accordions on page. */
function collapseAll() {
    const acc = document.getElementsByClassName('accordion');
    for (let i = 0; i < acc.length; i++) {
        acc[i].classList.remove("active");
        let panel = acc[i].nextElementSibling;
        while (panel) {
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            if (panel.nextElementSibling === null)
                panel = null;
            else if (panel.nextElementSibling.nodeName.toLowerCase() === "button")
                panel = null;
            else
                panel = panel.nextElementSibling;
        }

    }
}

/** When the modal is closed by the user, clear it and update order data. */
function clearModalsOnClick() {
    const order_summary = $('#order_summary_modal');
    const name_input = $('#favoriteName');
    const close = document.getElementsByClassName("close-button");
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            order_summary.empty();
            name_input.val("");
            getLastOrderDate();
            getOrdersLength();
        };
    }

}