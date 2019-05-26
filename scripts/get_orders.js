let orders;
let perPage;
$(document).ready(function () {
    let orderPromise = $.get(get_api_url() + "orders", {
        student_email: getCookie("email"),
        sort: {order_date: -1}
    });
    orderPromise.success(function (orderHistory) {
        orders = orderHistory;
        if (orders.length === 0) {
            $('#orders_div').html('<h3>You have not placed any orders yet.</h3>');
        } else {
            configurePageCountSelector();
            createPagination(5);
            getOrderHistoryPage(1);
        }

    });

});

function createPagination(ordersPerPage) {
    perPage = ordersPerPage;
    const pagination = $('.pagination');
    let numPages = orders.length / perPage;
    pagination.empty();
    for (let i = 0; i < numPages; i++) {
        pagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getOrderHistoryPage(this.text)">${i + 1}</a></li>`)
    }

}

function getOrderHistoryPage(pageNumber) {
    const table_body = $('#table-body');
    let start = (pageNumber - 1) * perPage;
    table_body.empty();
    for (let i = start; i < start + perPage; i++) {
        if (orders[i]) {
            let arr = [];
            for (let j = 0; j < orders[i].ingredients.length; j++) {
                arr.push(orders[i].ingredients[j].name)
            }
            table_body.append(`<tr class="order-row"><th scope="row">${new Date(orders[i].order_date).toLocaleString()}</th><td>${new Date(orders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${arr}</td><td class="lunch-td">${orders[i].which_lunch}</td><td class="cancel-button-wrapper"></td></tr>`)
            let thisPickupDate = new Date(orders[i].pickup_date)
            thisPickupDate.setHours(8);
            if (new Date() < thisPickupDate) {
                $('.cancel-button-wrapper').last().append(`<button type="button" class="btn-default btn-sm btn" id="cancelButton">Cancel Order</button>`);
                $('#cancelButton').on("click", function () {
                    cancelOrder(orders[i]._id);
                })
            }


        }
    }
}

function cancelOrder(order_id) {
    $.ajax({
        url: get_api_url() + "orders/" + order_id,
        type: 'DELETE',
        success: function() {
            let orderRow = $(`[data-order-id=${order_id}]`).parent().parent();
            orderRow.css("opacity", 0);
            orderRow.remove()
            showAlert("Order Successfully Deleted")
            setTimeout(function () {
                window.location.reload()
            }, 300)
        }
    });
}

function configurePageCountSelector() {
    let a = document.getElementById("mySelectBox");
    a.addEventListener("change", function () {
        let selected_option = $('#mySelectBox option:selected');
        createPagination(selected_option.val());
        getOrderHistoryPage(1);
    });
}