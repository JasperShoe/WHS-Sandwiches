$(document).ready(function () {
    let ingredientPromise = $.get("https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/ingredients/", {
        sort: {ingredient_type_id: 1, name: 1}
    });
    ingredientPromise.success(function (ingredients) {
        for (let i = 0; i < ingredients.length; i++) {
            $('#ingredient-row').append(`<div class="ingredient"><p>${ingredients[i].name}</p><input class="apple-switch" type="checkbox"></div>`);
            let ingredientID = ingredients[i]._id;
            $('.ingredient').last().attr('data-ingredient-id', ingredientID);
            if (!ingredients[i].is_available){
                $(`[data-ingredient-id=${ingredientID}]`).find('.apple-switch').prop("checked", true);
            }
        }
        setupCheckBoxListeners();
    });



});

function setupCheckBoxListeners() {
    let checkboxes = document.getElementsByClassName("apple-switch");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener( 'change', function() {
            $.ajax({
                url: get_api_url() + 'ingredients/' + this.parentElement.getAttribute('data-ingredient-id'),
                method: 'PUT',
                data: {
                    is_available: !this.checked
                }
            });
        });
    }

}



