$(document).ready(function () {
    let ingredientTypePromise = getIngredientTypeData();
    ingredientTypePromise.success(function () {
        let ingredientPromise = getIngredientData();
        ingredientPromise.success(expand())
    });


});
function getIngredientTypeData() {
    return $.getJSON('http://localhost:3000/ingredient_types', function (ingredient_types_json) {
        const ingredientOptions = $('#ingredients-list');
        for (let i = 0; i < ingredient_types_json.length; i++) {
            if (ingredient_types_json[i].minimum === ingredient_types_json[i].maximum) {
                ingredientOptions.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select ' + ingredient_types_json[i].minimum + ') </button>');
            } else {
                ingredientOptions.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select up to ' + ingredient_types_json[i].maximum + ') </button>');
            }
            let ingredientTypeID = ingredient_types_json[i]._id;
            let ingredientTypeButton = $('.accordion');
            ingredientTypeButton.last().attr("data-ingredient-type-id", ingredientTypeID);
        }
    });
}

function getIngredientData() {
    return $.getJSON('http://localhost:3000/ingredients', function (ingredients_json) {
        let ingredientTypeAccordions = document.getElementsByClassName('accordion');
        for (let i = 0; i < ingredientTypeAccordions.length; i++) {
            let thisIngredientTypeID = ingredientTypeAccordions[i].getAttribute("data-ingredient-type-id");
            let accordionWithID = $("#ingredients-list").find(`[data-ingredient-type-id='${thisIngredientTypeID}']`);
            for (let j = 0; j < ingredients_json.length; j++) {
                if (ingredients_json[j].ingredient_type_id === thisIngredientTypeID) {
                    if (ingredients_json[j].is_available) {
                        accordionWithID.after('<div class = "panel"><br><label class="checkcontainer">' + ingredients_json[j].name + '<input class = "ingredientcheckbox" type="checkbox" class = "available"><span class="checkmark"></span></label><br></div>')
                    } else {
                        accordionWithID.after('<div class = "panel"><br><label class="checkcontainer">' + ingredients_json[j].name + ' !Item Unavailable' + '<input class = "ingredientcheckbox" type="checkbox" class = "unavailable"><span class="checkmark"></span></label><br></div>')
                        $(".ingredientcheckbox").last().attr("disabled", "disabled")
                    }
                    let ingredientID = ingredients_json[j]._id;
                    let panel = accordionWithID.next();
                    panel.attr("data-ingredient-id", ingredientID);
                    panel.attr("data-ingredient-type-id", thisIngredientTypeID);
                }
            }
            accordionWithID.after('<hr>');
        }

    });
}

function expand() {


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

                // Keep going to the next element to open it until we hit the next accordion (which will be a button).
                // If we hit a button, terminate the while loop by setting the panel to null.
                if (panel.nextElementSibling === null)
                    panel = null;
                else if (panel.nextElementSibling.nodeName.toLowerCase() === "button")
                    panel = null;
                else
                    panel = panel.nextElementSibling;
            }
        });
    }
}

