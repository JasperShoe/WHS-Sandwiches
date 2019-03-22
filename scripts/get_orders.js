const orderUrl = "http://localhost:3000/orders/"

//todo: scenario - students orders a sandwich today for consumption tomorrow
//todo: scenario - how to prevent / deal with orders with ingredients that become out of stock after they are ordered

$(document).ready(function () {
    $.get(orderUrl, {student_email: getCookie("email"), daysOfOrders: 1, sort: {date: -1}}, function (orderHistory) {
        let order_div = $('#orders_div');
        if (orderHistory.length === 0) {
            order_div.append('<h3>You have not placed any orders yet.</h3>');
        } else {
            for (let i = 0; i < orderHistory.length; i++) {
                let arr = [];
                for (let j = 0; j < orderHistory[i].ingredients.length; j++) {
                    arr.push(orderHistory[i].ingredients[j].name)
                }
                order_div.append('<div class="oldOrder"><p>' + new Date(orderHistory[i].date).toLocaleString() + '</p><div class="ingredients">' + arr + '</div><div class="buttons"><button class="btn btn-primary" onclick=""> Order</button><button class="btn btn-primary" id = "favoriteButton" onclick="moveToFavorites(this.parentElement.id)"> Save as Favorite</button></div></div>');
                let buttons = $(".buttons");
                buttons.last().attr("id", orderHistory[i]._id)
            }
        }
    });

});

function moveToFavorites(id) {


    showAlert();
    // $.ajax({
    //     url: orderUrl + id,
    //     method: 'PUT',
    //     data: {
    //         is_favorite: true
    //     },
    //     success:
    //
    // });

}