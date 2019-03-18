const url = "http://localhost:3000/orders/";

$(document).ready(function () {
    $.get(url, {student_email: "rafaelvchaves@gmail.com", is_favorite: true, sort: {favorite_name: 1}}, function (favoriteOrders) {
        let favorites_div = $('#favorites_div');
        if (favoriteOrders.length === 0) {
            favorites_div.append('<h3>You do not have any favorites yet.</h3>');
        }
        else {
            for (let i = 0; i < favoriteOrders.length; i++) {
                let arr = [];
                for (let j = 0; j < favoriteOrders[i].ingredients.length; j++) {
                    arr.push(favoriteOrders[i].ingredients[j].name)
                }
                favorites_div.append('<div class="oldOrder"><p> Order # '+ i + '</p><div class="ingredients">'+ arr + '</div><p>' + favoriteOrders[i].date + '</p><div class="buttons"><button class = "previousOrderButton" onclick=""> Order</button></div></div>');
                // let OrderButton = $('.previousOrderButton');
                // OrderButton.last().attr("id", orderHistory[i]._id);
                // let makeFav = $('#favoriteButton');
                // makeFav.last().attr("id", id);
                let buttons = $(".buttons")
                buttons.last().attr("id", orderHistory[i]._id)
            }
        }
    });

});