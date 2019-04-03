$(document).ready(function () {
    getLastOrderDate();

});
let lastOrdersPickupDate;
function getLastOrderDate(){
    let ordersPromise = $.get("http://localhost:3000/orders/", {
        student_email: getCookie("email"),
        sort: {order_date: -1}
    });
    ordersPromise.success(function (orders) {
        if (orders.length !== 0) {
            lastOrdersPickupDate = new Date(orders[0].pickup_date)
        }
    })
}

let ingredient_types_json, ingredients_json, favorites_json;
$.get('http://localhost:3000/ingredient_types/', function (json) {
    ingredient_types_json = json;
});
$.get('http://localhost:3000/ingredients/', function (json) {
    ingredients_json = json;
});
$.get('http://localhost:3000/favorite_orders/', function (json) {
    favorites_json = json;
});


let orderDetails, selectedLunch;

function buildOrder() {
    // const alert = $(".alert-msg");
    // alert.text("");
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
    let pickupDate = new Date(currentDate);
    let createOrderButton = $('#createOrder');
    currentDate.getHours();
    if (currentDate.getHours() >= 9) {
        pickupDate.setDate(currentDate.getDate() + 1);
    }

    if (ingredientsAreAvailable(orderIngredients) && isValidOrder(orderIngredients) && !alreadyOrderedToday(pickupDate)) {
        createOrderButton.attr("data-toggle", "modal");
        createOrderButton.attr("data-target", "#myModal1");
        orderDetails = {
            student_email: getCookie("email"),
            ingredients: orderIngredients,
            which_lunch: selectedLunch.val(),
            order_date: currentDate,
            pickup_date: pickupDate
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






