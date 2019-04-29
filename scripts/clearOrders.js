function clearOrders(){
    let ordersPromise = $.get(get_api_url() + "orders");
    ordersPromise.success(function (orders) {
        for (let i = 0; i < orders.length; i++) {
            let orderID = orders[i]._id;
            $.ajax({
                url: get_api_url() + "orders" + orderID,
                type: 'DELETE',
                success: function () {
                    console.log("Order Successfully Deleted")
                }
            });
        }
    })
}