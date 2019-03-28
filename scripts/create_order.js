//todo: ability to order favorites.
$(document).ready(function () {
    getLastOrderDate()

});
let lastOrdersPickupDate;
function getLastOrderDate(){
    let ordersPromise = $.get("http://localhost:3000/orders/", {
        // student_email: getCookie("email"),
        student_email: "rafael_chaves@student.wayland.k12.ma.us",
        sort: {order_date: -1}
    });
    ordersPromise.success(function (orders) {
        if (orders.length !== 0) {
            lastOrdersPickupDate = new Date(orders[0].pickup_date)
        }
    })
}

let ingredient_types_json, ingredients_json;
$.get('http://localhost:3000/ingredient_types/', function (json) {
    ingredient_types_json = json;
});
$.get('http://localhost:3000/ingredients/', function (json) {
    ingredients_json = json;
});


let orderDetails, selectedLunch;

// Gets checked ingredients, checks to see if they're a valid order, then builds an order object and goes to the popup menu.
function buildOrder() {
    const alert = $(".alert-msg");
    alert.text("");


    // Add checked ingredients to order.
    selectedLunch = $("input[name='lunch']:checked");
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    let createOrderButton = $('#createOrder');
    let orderIngredients = [];
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
    let currentDate = new Date();
    let pickupDate = new Date(currentDate);
    console.log(pickupDate);
    currentDate.getHours();
    if (currentDate.getHours() >= 8) {
        pickupDate.setDate(currentDate.getDate() + 1);
    }
    // if (isValidOrder(orderIngredients) && !alreadyOrderedToday(pickupDate)) {
    if (isValidOrder(orderIngredients)) {
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






