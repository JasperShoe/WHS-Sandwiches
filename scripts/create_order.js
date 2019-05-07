$(document).ready(function () {
    getLastOrderDate();
    getOrdersLength();
});
let lastOrdersPickupDate;
let dailyOrderCount;
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

function getOrdersLength(){
    let ordersPromise = $.get(get_api_url() + "orders", {
        pickup_date: getNextPickupDate(),
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


let orderDetails, selectedLunch;

function getNextPickupDate() {
    let currentDate = new Date();
    let pickupDate = new Date(currentDate);
    if (currentDate.getHours() >= 8) {
        pickupDate.setDate(currentDate.getDate() + 1);
    }
    switch (pickupDate.getDay()) {
        case 0: {
            pickupDate.setDate(pickupDate.getDate() + 1);
            break;
        }
        case 4:
        case 5:
        case 6:{
            pickupDate.setDate(pickupDate.getDate() + (8 - pickupDate.getDay()));
        }
    }
    return pickupDate;

}

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
    if (ingredientsAreAvailable(orderIngredients) && isValidOrder(orderIngredients) && !alreadyOrderedToday(getNextPickupDate()) && underOrderCapacity()) {
    // if (ingredientsAreAvailable(orderIngredients) && isValidOrder(orderIngredients) && underOrderCapacity()) {
        createOrderButton.attr("data-toggle", "modal");
        createOrderButton.attr("data-target", "#myModal1");
        orderDetails = {
            student_email: getCookie("email"),
            ingredients: orderIngredients,
            which_lunch: selectedLunch.val(),
            order_date: currentDate,
            pickup_date: getNextPickupDate()
        };
        populateOrderModal(orderDetails);
    } else {
        createOrderButton.attr("data-toggle", null);
        createOrderButton.attr("data-target", null);
    }
}

function ingredientsAreAvailable(selected_ingredients) {
    let unavailableIngredientsInOrder = [];
    for (let i = 0; i < ingredients_json.length; i++) {
        for (let j = 0; j < selected_ingredients.length; j++) {
            let thisIngredientID = selected_ingredients[j]._id;
            if (thisIngredientID === ingredients_json[i]._id && !ingredients_json[i].is_available) {
                unavailableIngredientsInOrder.push(ingredients_json[i].name);
            }
        }
    }
    if (unavailableIngredientsInOrder.length === 0) {
        return true;
    }
    else {
        alert(`Error: the following ingredients are not available today: ${unavailableIngredientsInOrder}`);
        return false;
    }

}

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

function underOrderCapacity() {
    console.log(dailyOrderCount);
    if (dailyOrderCount < 25) {
        return true;
    }
    else {
        alert(`We have already received the maximum number of orders for ${getNextPickupDate().toLocaleDateString()}`);
        return false;
    }
}


// Checks the following errors: no bread selected, over limit, too few ingredients, and no lunch selected.
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






