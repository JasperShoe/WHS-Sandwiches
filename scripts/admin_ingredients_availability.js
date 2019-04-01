$(document).ready(function () {
    let ingredientPromise = $.get("http://localhost:3000/ingredients/", {
        sort: {ingredient_type_id: 1, name: 1}
    });
    ingredientPromise.success(function (ingredients) {
        for (let i = 0; i < ingredients.length; i++) {
            $('.list-group').append(`<li class="list-group-item">${ingredients[i].name}<div class="material-switch pull-right"><input id="someSwitchOptionDanger" name="someSwitchOption001" type="checkbox"/><label for="someSwitchOptionDanger" class="label-danger"></label></div></li>`)
        }

    });


});


