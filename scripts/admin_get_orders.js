let orders;
let perPage;
$(document).ready(function () {
    let orderPromise = $.get("http://localhost:3000/orders/", {
        daysOfOrders: 1,
        sort: {pickup_date: -1}
    });
    orderPromise.success(function (orderHistory) {
        orders = orderHistory;
        let order_div = $('#orders_div');
        if (orders.length === 0) {
            order_div.append('<h3>You have not placed any orders yet.</h3>');
        } else {
            configurePageCountSelector();
            getSpecifiedNumberOfOrders(5);
            getOrderPage(1);
        }

    });

});

function getSpecifiedNumberOfOrders(ordersPerPage) {
    perPage = ordersPerPage;
    const pagination = $('.pagination');
    let numPages = orders.length / perPage;
    pagination.empty();
    for (let i = 0; i < numPages; i++) {
        pagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getOrderPage(this.text)">${i + 1}</a></li>`)
    }

}

function getOrderPage(pageNumber) {
    const table_body = $('#table-body');
    let start = (pageNumber - 1) * perPage;
    table_body.empty();
    for (let i = start; i < start + perPage; i++) {
        if (orders[i]) {
            let ingredientNames = [];
            for (let j = 0; j < orders[i].ingredients.length; j++) {
                ingredientNames.push(orders[i].ingredients[j].name)
            }
            let shortenedEmail = orders[i].student_email.split('@')[0];
            let lunch;
            switch(orders[i].which_lunch){
                case 1:
                    lunch = `${orders[i].which_lunch}st`;
                    break;
                case 2:
                    lunch = `${orders[i].which_lunch}nd`;
                    break;
                case 3:
                    lunch = `${orders[i].which_lunch}rd`;
                    break;
                default:
                    lunch = `${orders[i].which_lunch}`
            }
            table_body.append(`<tr><th scope="row">${shortenedEmail}</th><td>${new Date(orders[i].order_date).toLocaleString()}</td><td>${new Date(orders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${lunch}</td><td class="align-center"><input type="checkbox" name="orderChecker"></td></tr>`)
        }
    }
}

function configurePageCountSelector() {
    let a = document.getElementById("mySelectBox");
    a.addEventListener("change", function () {
        let selected_option = $('#mySelectBox option:selected');
        getSpecifiedNumberOfOrders(selected_option.val());
        getOrderPage(1);
    });
}
