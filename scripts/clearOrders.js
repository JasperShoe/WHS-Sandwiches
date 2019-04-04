function clearOrders(){
    let ordersPromise = $.get("https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/orders/");
    ordersPromise.success(function (orders) {
        for (let i = 0; i < orders.length; i++) {
            let orderID = orders[i]._id;
            $.ajax({
                url: "https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/orders/" + orderID,
                type: 'DELETE',
                success: function () {
                    console.log("Order Successfully Deleted")
                }
            });
        }
    })
}