let orderDetails;
let it_json, i_json;
$.get('http://localhost:3000/ingredient_types/', function (json) {
    it_json = json;
});
$.get('http://localhost:3000/ingredients/', function (json) {
    i_json = json;
});

let selectedLunch;

// Gets checked ingredients, checks to see if they're a valid order, then builds an order object and goes to the popup menu.
function buildOrder() {

    // Add checked ingredients to order.
    selectedLunch = $("input[name='lunch']:checked");
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    let orderIngredients = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            orderIngredients.push({
                ingredient_type_id: checkboxes[i].parentElement.id.toString(),
         //todo: consider using ingredient id rather than name
                name: checkboxes[i].parentElement.innerText
            });
        }
    }

    if (isValidOrder(orderIngredients)) {
        var today = new Date();
        orderDetails = {
            student_email: getCookie("email"),
            ingredients: orderIngredients,
            which_lunch: selectedLunch.val(),
            is_favorite: false,
            date: today
        };
        displayOrderSummary(orderDetails);
    }
}

// Checks the following errors: no bread selected, over limit, too few ingredients, and no lunch selected.
function isValidOrder(selected_ingredients) {
    if (selected_ingredients.length <= 1) {
        alert(`Error: you must select more than one ingredient.`);
        return false;
    }
    if (!selectedLunch.val()) {
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
        //todo: consider updating Schema to have min and max
        if (counter < it_json[i].limit && i === 0) {
            alert(`Error: you have not selected a bread.`);
            return false;
        } else if (counter > it_json[i].limit) {
            alert(`Error: you have selected too many ${it_json[i].name}s`);
            return false;
        }
    }
    return true;
}

// Clears the checklist once order is validated.
function clearChecklist(checks, radio) {
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            checks[i].checked = false;
        }
    }
    radio.attr('checked', false);
}





