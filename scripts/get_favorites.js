$(document).ready(function () {
    getFavoritesOn(window.location.pathname);
    configureFavoriteNameEditor();
});

function getFavoritesOn(page){
    let favoritesPromise = $.get(get_api_url() + "favorite_orders", {student_email: getCookie("email"), sort: {favorite_name: 1}});
    favoritesPromise.success(function (favoriteOrders) {
        let divToModify, favoriteOrderDiv;
        if (page.includes("favorites.html")) {
            divToModify = $('.cards');
        }
        else if (page.includes("customize.html")) {
            divToModify = $('#favoriteSelector');
        }
        divToModify.empty();
        if (favoriteOrders.length === 0) {
            divToModify.html('<h3 class="get-favorites-error">You do not have any favorites yet.</h3>');
        }
        else {
            for (let i = 0; i < favoriteOrders.length; i++) {
                let ingredientNames = [];
                for (let j = 0; j < favoriteOrders[i].ingredients.length; j++) {
                    ingredientNames.push(favoriteOrders[i].ingredients[j].name)
                }
                if (page.includes("favorites.html")) {
                    divToModify.append(`<div class="card"><h3 class="card-header">"${favoriteOrders[i].favorite_name}"</h3><div class="card-body"><h3 class="card-title">Ingredients:</h3><p class="card-text">${ingredientNames}</p><button class="btn btn-primary" data-toggle="modal" data-target="#myModal1" onclick="identifyFavorite(this.parentElement.getAttribute('data-favorite-order-id'))">Edit Favorite</button><button class="btn btn-primary" onclick="deleteFavorite(this.parentElement.getAttribute('data-favorite-order-id'))">Delete Favorite</button></div></div>`);
                    favoriteOrderDiv = $(".card-body")
                }
                else if (page.includes("customize.html")) {
                    divToModify.append(`<option class="favoriteOption">${favoriteOrders[i].favorite_name}</option>`)
                    favoriteOrderDiv = $(".favoriteOption");
                }
                favoriteOrderDiv.last().attr("data-favorite-order-id", favoriteOrders[i]._id);
            }
        }
    })
}

function configureFavoriteNameEditor() {
    let editableTitle = document.getElementById("favoriteName");
    editableTitle.addEventListener('keypress', function (e) {
        let key = e.which || e.keyCode;
        if (key === 13) {
            editableTitle.blur();
        }
    });
    editableTitle.addEventListener('blur', function () {
        newFavoriteName = editableTitle.innerText;
    });
}