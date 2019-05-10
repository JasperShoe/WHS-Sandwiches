function completePastOrders() {
    let orderPromise = $.get(get_api_url() + "orders");
    orderPromise.success(function (pastOrders) {
        for (let i = 0; i < pastOrders.length; i++) {
            $.ajax({
                url: get_api_url() + "orders/" + pastOrders[i]._id,
                method: 'PUT',
                data: {
                    is_completed: pastOrders[i].pickup_date < new Date()
                }
            });
        }
    });
}