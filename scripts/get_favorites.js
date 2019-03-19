$(document).ready(function () {
    $.get("http://localhost:3000/favorite_orders/", {student_email: getCookie("email"), sort: {favorite_name: 1}}, function (favoriteOrders) {
        let favorites_div = $('#favorites_div');
        if (!getCookie("email")){
            favorites_div.append('<h3>Please sign in to view your favorites.</h3>');
        }
        else if (favoriteOrders.length === 0) {
            favorites_div.append('<h3>You do not have any favorites yet.</h3>');
        }
        else {
            for (let i = 0; i < favoriteOrders.length; i++) {
                let arr = [];
                for (let j = 0; j < favoriteOrders[i].ingredients.length; j++) {
                    arr.push(favoriteOrders[i].ingredients[j].name)
                }
                favorites_div.append(`<div class="oldOrder"><p> "${favoriteOrders[i].favorite_name}": </p><div class="ingredients"> ${arr} </div><div class="buttons"></div></div>`);
            }
        }
    });

});