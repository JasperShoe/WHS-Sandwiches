function clearOrders(){
    let ordersPromise = $.get("http://localhost:3000/orders/");
    ordersPromise.success(function (orders) {
        for (let i = 0; i < orders.length; i++) {
            let orderID = orders[i]._id;
            $.ajax({
                url: "http://localhost:3000/orders/" + orderID,
                type: 'DELETE',
                success: function () {
                    console.log("Order Successfully Deleted")
                }
            });
        }
    })
}