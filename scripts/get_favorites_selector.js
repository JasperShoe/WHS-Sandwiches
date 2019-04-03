$(document).ready(function () {
    getFavoritesSelector();
});

// When the page loads, push all of the user's favorite orders onto the page.
function getFavoritesSelector(){
    let favoritesPromise = $.get("http://localhost:3000/favorite_orders/", {student_email: getCookie("email"), sort: {favorite_name: 1}});
    favoritesPromise.success(function (favoriteOrders) {
        let favorites_div = $('#favoriteSelector');
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
                favorites_div.append(`<option class="favoriteOption">${favoriteOrders[i].favorite_name}</option>`);
                let favoriteCard = $(".favoriteOption");
                favoriteCard.last().attr("data-favorite-order-id", favoriteOrders[i]._id);
            }
        }
    })
}

