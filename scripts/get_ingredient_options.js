$(document).ready(function () {
    let ingredientTypePromise = getIngredientTypeData();
    ingredientTypePromise.success(function () {
        let ingredientPromise = getIngredientDataOn(getCurrentPath());
        ingredientPromise.success(configureAccordions())
    });


});
<<<<<<< HEAD
/** Get ingredient type data create accordions for each. Store ID values in HTML attributes. */
=======
>>>>>>> bea4bfda03b01ecc8817e8ff7e2e78e5288807ea
function getIngredientTypeData() {
    return $.getJSON(get_api_url() + 'ingredient_types', function (ingredient_types_json) {
        const ingredientOptions = $('#ingredients-list');
        for (let i = 0; i < ingredient_types_json.length; i++) {
<<<<<<< HEAD
            let limit_wording = (ingredient_types_json[i].minimum === ingredient_types_json[i].maximum) ? ingredient_types_json[i].minimum : "up to " + ingredient_types_json[i].maximum;
            ingredientOptions.append(`<button class = "accordion">${ingredient_types_json[i].name} (select ${limit_wording}) </button>`);
=======
            if (ingredient_types_json[i].minimum === ingredient_types_json[i].maximum) {
                ingredientOptions.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select ' + ingredient_types_json[i].minimum + ') </button>');
            } else {
                ingredientOptions.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select up to ' + ingredient_types_json[i].maximum + ') </button>');
            }
>>>>>>> bea4bfda03b01ecc8817e8ff7e2e78e5288807ea
            let ingredientTypeID = ingredient_types_json[i]._id;
            let ingredientTypeButton = $('.accordion');
            ingredientTypeButton.last().attr("data-ingredient-type-id", ingredientTypeID);
        }
    });
}

<<<<<<< HEAD
/** Get ingredient data and insert each ingredient under the correct ingredient type accordion. Store ID values in HTML attributes. */
=======
>>>>>>> bea4bfda03b01ecc8817e8ff7e2e78e5288807ea
function getIngredientDataOn(page) {
    return $.getJSON(get_api_url() + 'ingredients', {sort: {name: -1}}, function (ingredients_json) {
        let ingredientTypeAccordions = document.getElementsByClassName('accordion');
        for (let i = 0; i < ingredientTypeAccordions.length; i++) {
            let thisIngredientTypeID = ingredientTypeAccordions[i].getAttribute("data-ingredient-type-id");
            let accordionWithID = $("#ingredients-list").find(`[data-ingredient-type-id='${thisIngredientTypeID}']`);
            for (let j = 0; j < ingredients_json.length; j++) {
                if (ingredients_json[j].ingredient_type_id === thisIngredientTypeID) {
                    accordionWithID.after('<div class = "panel"><br><label class="checkcontainer">' + ingredients_json[j].name + '<input class = "ingredientcheckbox" type="checkbox" class = "available"><span class="checkmark"></span></label><br></div>')

                    let ingredientID = ingredients_json[j]._id;
                    let panel = accordionWithID.next();
                    panel.attr("data-ingredient-id", ingredientID);
                    panel.attr("data-ingredient-type-id", thisIngredientTypeID);
                    if (!ingredients_json[j].is_available && page.includes("customize.html")) {
                        let ingredientWithID = $(`[data-ingredient-id=${ingredients_json[j]._id}]`);
                        ingredientWithID.find('.ingredientcheckbox').attr("disabled", "disabled");
                        ingredientWithID.find('.checkcontainer').append(`<strong>item unavailable</strong>`);
                    }
                }
            }
            accordionWithID.after('<hr>');
        }

    });
}

<<<<<<< HEAD
/** Add listeners to the ingredient type accordions so that they will expand when clicked. */
function configureAccordions() {

    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            while (panel) {
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
=======
function configureAccordions() {


    // Loop through each of the accordions on the doc
    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {

        // Add a click lister that will execute the inside function whenever the accordion is clicked on.
        acc[i].addEventListener("click", function () {


            // Everything in here will execute whenever an accordion is clicked.
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            while (panel) { // While the next element exists
                if (panel.style.maxHeight) { // If the panel has a maxHeight (meaning it's open), then close it
                    panel.style.maxHeight = null;
                } else { // If the panel doesn't have a maxHeight, it is closed.
                    panel.style.maxHeight = panel.scrollHeight + "px"; // This opens the panel.
                }

                // Keep going to the next element to open it until we hit something that's not an ingredient panel
>>>>>>> bea4bfda03b01ecc8817e8ff7e2e78e5288807ea
                if (panel.nextElementSibling === null)
                    panel = null;
                else if (panel.nextElementSibling.className !== "panel")
                    panel = null;
                else
                    panel = panel.nextElementSibling;
            }
        });
    }
}