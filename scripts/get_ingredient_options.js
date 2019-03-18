// This function will execute when this html page loads.
$(document).ready(function () {
    get_ingredient_options(expand);
});

function get_ingredient_options(onSuccess) {
    // Gets the data from the ingredient_types and ingredients collections.
    $.getJSON('http://localhost:3000/ingredient_types', function (ingredient_types_json) {
        $.getJSON('http://localhost:3000/ingredients', function (ingredients_json) {
            let typeid;
            // Loop through the list of ingredient types and add their names to the accordions.
            const it_div = $('#it-div');
            for (let i = 0; i < ingredient_types_json.length; i++) {
                //todo: use min and max to determine the label
                if (ingredient_types_json[i].name === "Bread")
                    it_div.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select ' + ingredient_types_json[i].limit + ') </button><hr>');
                else
                    it_div.append('<button class = "accordion">' + ingredient_types_json[i].name + ' (select up to ' + ingredient_types_json[i].limit + ') </button><hr>');

                // Hold on to the id of each ingredient type so that we can identify the ingredients.
                typeid = ingredient_types_json[i]._id;

                // Now, loop through the list of ingredients, "json2" (we're still in the first loop).
                // Get all of the ingredients that are of the type so that we can separate them into the panels of the accordions.
                for (let j = 0; j < ingredients_json.length; j++) {
                    if (ingredients_json[j].ingredient_type_id === typeid) {
                        if (ingredients_json[j].is_available) {
                            it_div.append('<div class = "panel"><br><label class="checkcontainer" id ="temp">' + ingredients_json[j].name + '<input class = "ingredientcheckbox" type="checkbox" id = "available"><span class="checkmark"></span></label><br></div>')

                        } else {
                            //todo: use classes instead of ids for unavailable and available
                            it_div.append('<div class = "panel"><br><label class="checkcontainer" id ="temp">' + ingredients_json[j].name + ' !Item Unavailable' +'<input class = "ingredientcheckbox" type="checkbox" id = "unavailable"><span class="checkmark"></span></label><br></div>')
                            $(".ingredientcheckbox").last().attr("disabled", "disabled")
                        }
                        const checkcontainer = $(".checkcontainer");
                        checkcontainer.last().attr("id", typeid);
                    }
                }
            }
        });
    });
    //todo: figure out how to put onSuccess in a way that it will be called after the getJSONs are completed.

    // As it stands, the onsuccess is being called before the two are finished.
    // Quick fix for now: move onSuccess() call to the end of the ingredient getJSON call.
    onSuccess();
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

// function setUnavailable(id) {
//     console.log(id);
//     $.ajax({
//         url: 'http://localhost:3000/ingredients/' + id,
//         method: 'PUT',
//         data: {
//             is_available: false
//         }
//     });
// }


