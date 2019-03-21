let it_json, i_json;
$.get('http://localhost:3000/ingredient_types/', function (json) {
    it_json = json;
});
$.get('http://localhost:3000/ingredients/', function (json) {
    i_json = json;
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
    if (isValidOrder(orderIngredients)) {
        createOrderButton.attr("data-toggle", "modal");
        createOrderButton.attr("data-target", "#myModal1");
        orderDetails = {
            student_email: getCookie("email"),
            ingredients: orderIngredients,
            which_lunch: selectedLunch.val(),
            date: new Date().toLocaleString()
        };
        populateOrderModal(orderDetails);
    }
    else {
        createOrderButton.attr("data-toggle", null);
        createOrderButton.attr("data-target", null);
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
    for (let i = 0; i < it_json.length; i++) {
        let counter = 0;
        for (let j = 0; j < selected_ingredients.length; j++) {
            if (selected_ingredients[j].ingredient_type_id === it_json[i]._id) {
                counter++;
            }
        }
        if (counter < it_json[i].minimum) {
            alert(`Error: you have selected too few ${it_json[i].name}s`);
            return false;
        }
        else if (counter > it_json[i].maximum) {
            alert(`Error: you have selected too many ${it_json[i].name}s`);
            return false;
        }
    }
    return true;
}






