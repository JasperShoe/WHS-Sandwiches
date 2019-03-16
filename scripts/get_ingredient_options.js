// This function will execute when this html page loads.
$(document).ready(function () {
    // Gets the data from the ingredient_types and ingredients collections.
    $.getJSON('http://localhost:3000/ingredient_types', function (json) {
        $.getJSON('http://localhost:3000/ingredients', function (json2) {
            let typeid;
            // Loop through the list of ingredient types ("json") and add their names to the accordions.
            const it_div = $('#it-div');
            for (let i = 0; i < json.length; i++) {
                if (json[i].name === "Bread")
                    it_div.append('<button class = "accordion">' + json[i].name + ' (select ' + json[i].limit + ') </button><hr>');
                else
                    it_div.append('<button class = "accordion">' + json[i].name + ' (select up to ' + json[i].limit + ') </button><hr>');

                // Hold on to the id of each ingredient type so that we can identify the ingredients.
                typeid = json[i]._id;

                // Now, loop through the list of ingredients, "json2" (we're still in the first loop).
                // Get all of the ingredients that are of the type so that we can separate them into the panels of the accordions.
                for (let j = 0; j < json2.length; j++) {
                    if (json2[j].ingredient_type_id === typeid) {
                        it_div.append('<div class = "panel"><br><label class="checkcontainer" id ="temp">' + json2[j].name + '<input class = "ingredientcheckbox" type="checkbox" id = "available"><span class="checkmark"></span></label><br></div>')
                        const checkcontainer = $(".checkcontainer");
                        if (checkcontainer.last().attr("id") === "temp"){

                            // The attr method by default gets the first element, so we also have to call last() before it.
                            checkcontainer.last().attr("id", typeid);
                        }
                        if(!json2[j].is_available){
                            $(".ingredientcheckbox").last().attr("id", "unavailable");
                            $("#unavailable").last().attr("disabled", "disabled")
                        }


                    }
                }
            }
        });
    });
});


