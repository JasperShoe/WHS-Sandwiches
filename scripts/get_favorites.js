$(document).ready(function () {
    getFavorites();
    configureFavoriteNameEditor();
});

// When the page loads, push all of the user's favorite orders onto the page.
function getFavorites(){
    let favoritesPromise = $.get("http://localhost:3000/favorite_orders/", {student_email: getCookie("email"), sort: {favorite_name: 1}});
    favoritesPromise.success(function (favoriteOrders) {
        let favorites_div = $('.cards');
        favorites_div.empty();
        if (favoriteOrders.length === 0) {
            favorites_div.append('<h3 class="get-favorites-error">You do not have any favorites yet.</h3>');
        }
        else {
            for (let i = 0; i < favoriteOrders.length; i++) {
                let ingredientNames = [];
                for (let j = 0; j < favoriteOrders[i].ingredients.length; j++) {
                    ingredientNames.push(favoriteOrders[i].ingredients[j].name)
                }

                favorites_div.append(`<div class="card"><h3 class="card-header">"${favoriteOrders[i].favorite_name}"</h3><div class="card-body"><h3 class="card-title">Ingredients:</h3><p class="card-text">${ingredientNames}</p><button class="btn btn-primary" onclick="orderFavorite(this.parentElement.getAttribute('data-favorite-order-id'))">Order</button><button class="btn btn-primary" data-toggle="modal" data-target="#myModal1" onclick="identifyFavorite(this.parentElement.getAttribute('data-favorite-order-id'))">Edit Favorite</button><button class="btn btn-primary" onclick="deleteFavorite(this.parentElement.getAttribute('data-favorite-order-id'))">Delete Favorite</button></div></div>`);
                let favoriteCard = $(".card-body");
                favoriteCard.last().attr("data-favorite-order-id", favoriteOrders[i]._id);
            }
        }
    })
}

// Adds two listeners to the favorite order title.
function configureFavoriteNameEditor() {
    let editableTitle = document.getElementById("favoriteName");

    // If the user clicks enter when editing the title, then it will stop editing.
    editableTitle.addEventListener('keypress', function (e) {
        let key = e.which || e.keyCode;
        if (key === 13) {
            editableTitle.blur();
        }
    });

    // When the user presses enter, set the new favorite name (in the other js file) to whatever they changed it to in the title.
    editableTitle.addEventListener('blur', function () {
        newFavoriteName = editableTitle.innerText;
    });
}