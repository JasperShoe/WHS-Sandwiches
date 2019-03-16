const url = "http://localhost:3000/orders/";
// let favorites_div;
// let regulars_div;
// let regOrderButton, favOrderButton;

$(document).ready(function () {
    $.get(url, {student_email: "rafaelvchaves@gmail.com", is_favorite: true}, function (favoriteOrders) {
        // favorites_div = $('#favorite_orders_div');
        // if (favoriteOrders.length === 0) {
        //     favorites_div.append('<h3>You do not have any favorite orders yet.</h3>');
        // } else {
        //     for (let i = 0; i < favoriteOrders.length; i++) {
        //         favorites_div.append('<p> Favorite Order # ' + i + '</p>');
        //         for (let j = 0; j < favoriteOrders[i].ingredients.length; j++) {
        //             favorites_div.append('<p>' + favoriteOrders[i].ingredients[j].name + '</p>');
        //         }
        //         favorites_div.append('<button class = "favOrderButton" onclick="removeFavorite(this.id)"> Remove as Favorite</button>');
        //         favOrderButton = $('.favOrderButton');
        //         favOrderButton.last().attr("id", favoriteOrders[i]._id);
        //     }
        // }
    });
});
// $(document).ready(function () {
//     $.get(url, {student_email: "rafaelvchaves@gmail.com"}, function (orderHistory) {
//         regulars_div = $('#regular_orders_div');
//         if (orderHistory.length === 0) {
//             regulars_div.append('<h3>You have not placed an order yet.</h3>');
//         } else {
//             for (let i = 0; i < orderHistory.length; i++) {
//                 regulars_div.append('<p> Order # ' + i + '</p>');
//                 for (let j = 0; j < orderHistory[i].ingredients.length; j++) {
//                     regulars_div.append('<p>' + orderHistory[i].ingredients[j].name + '</p>');
//                 }
//                 regulars_div.append('<button class = "orderButtons" onclick="makeFavorite(this.id)"> Save as Favorite</button>');
//                 regOrderButton = $('.orderButtons');
//                 regOrderButton.last().attr("id", orderHistory[i]._id);
//             }
//         }
//     });
// });

//
// function removeFavorite(id) {
//     $.ajax({
//         url: url + id,
//         method: 'PUT',
//         data: {
//             is_favorite: false
//         },
//         success: function () {
//             console.log("Success")
//         }
//     });
// }