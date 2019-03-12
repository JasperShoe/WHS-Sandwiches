// This function will execute when this html page loads.
$(document).ready(function () {
    var id;
    // Gets the data from the ingredient_types and ingredients collections.
    $.getJSON('http://localhost:3000/ingredient_types', function (json) {
        $.getJSON('http://localhost:3000/ingredients', function (json2) {

            // Loop through the list of ingredient types ("json") and add their names to the accordions.
            for (var i = 0; i < json.length; i++) {
                if (json[i].name === "Bread")
                    $('#it-div').append('<button class = "accordion">' + json[i].name + ' (select ' + json[i].limit + ') </button><hr>');
                else
                    $('#it-div').append('<button class = "accordion">' + json[i].name + ' (select up to ' + json[i].limit + ') </button><hr>');

                // Hold on to the id of each ingredient type so that we can identify the ingredients.
                id = json[i]._id;

                // Now, loop through the list of ingredients, "json2" (we're still in the first loop).
                // Get all of the ingredients that are of the type so that we can separate them into the panels of the accordions.
                for (var j = 0; j < json2.length; j++) {
                    if (json2[j].ingredient_type_id === id) {
                        $('#it-div').append('<div class = "panel"><br><label class="checkcontainer">' + json2[j].name + '<input type="checkbox"><span class="checkmark"></span></label><br></div>')
                    }
                }
            }
        });
    });
});


