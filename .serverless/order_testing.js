$(document).ready(function () {
    if (location.hostname === "localhost") {
        $('.middlecol').prepend(`<button onclick="clearOrders()">Clear All Orders</button><button onclick="fillOrderCapacity()">Fill Capacity</button><button onclick="placeRandomOrders(30)">Place Random Orders</button>`)
    }
});

function clearOrders(){
    let ordersPromise = $.get(get_api_url() + "orders");
    ordersPromise.success(function (orders) {
        for (let i = 0; i < orders.length; i++) {
            let orderID = orders[i]._id;
            $.ajax({
                url: get_api_url() + "orders/" + orderID,
                type: 'DELETE',
                success: function () {
                    console.log("Order Successfully Deleted")
                }
            });
        }
    })
}
function placeRandomOrders(numOrders){
    let ingrs = [];
    let favoritesPromise = $.get(get_api_url() + "favorite_orders", {});
    favoritesPromise.success(function (favoriteOrders) {
        console.log(favoriteOrders[0]);
        console.log(favoriteOrders[0].ingredients);
        for (let i = 0; i < favoriteOrders[0].ingredients.length; i++) {
            ingrs.push(favoriteOrders[0].ingredients[i])
        }
    });
    let today = new Date();
    let order_date = new Date(today);
    for (let i = 0; i < numOrders; i++) {
        order_date.setDate(Math.floor(Math.random() * 30 + 1));
        order_date.setHours(Math.floor(Math.random() * 4 + 6));
        $.ajax({
            url: get_api_url() + "orders",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                student_email: 'rafaelvchaves@gmail.com',
                ingredients: ingrs,
                which_lunch: 1,
                order_date: order_date,
                pickup_date: getNextPickupDateFrom(order_date)
            }),
            success: function(){
                console.log("Success")
            },
        });
    }
}
function fillOrderCapacity(){
    let ingrs = [];
    let favoritesPromise = $.get(get_api_url() + "favorite_orders", {});
    favoritesPromise.success(function (favoriteOrders) {
        console.log(favoriteOrders[0]);
        console.log(favoriteOrders[0].ingredients);
        for (let i = 0; i < favoriteOrders[0].ingredients.length; i++) {
            ingrs.push(favoriteOrders[0].ingredients[i])
        }
    });
    let today = new Date();
    for (let i = 0; i < 30; i++) {
        $.ajax({
            url: get_api_url() + "orders",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                student_email: 'rafaelvchaves@gmail.com',
                ingredients: ingrs,
                which_lunch: 1,
                order_date: today,
                pickup_date: getNextPickupDateFrom(today)
            }),
            success: function(){
                console.log("Success")
            },
        });
    }
}