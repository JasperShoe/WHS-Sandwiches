let orders;
let perPage;
$(document).ready(function () {
    let orderPromise = $.get("http://localhost:3000/orders/", {
        daysOfOrders: 1,
        sort: {pickup_date: -1}
    });
    orderPromise.success(function (orderHistory) {
        orders = orderHistory;
        if (orders.length !== 0) {
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
    const incomplete_orders = $('#incomplete-order-table');
    const complete_orders = $('#complete-order-table');
    let start = (pageNumber - 1) * perPage;
    incomplete_orders.empty();
    complete_orders.empty();
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
            let table_row = `<tr class="order-view" data-order-id="${orders[i]._id}"><th scope="row">${shortenedEmail}</th><td>${new Date(orders[i].order_date).toLocaleString()}</td><td>${new Date(orders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${lunch}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="getChecked(this.parentElement.parentElement, this)"></td></tr>`;
            if (orders[i].is_completed) {
                complete_orders.append(table_row);
                $(`[data-order-id=${orders[i]._id}]`).find('.orderChecker').prop("checked", true)
            }
            else {
                incomplete_orders.append(table_row);
            }


        }
    }
}

function configurePageCountSelector() {
    let selectBox = document.getElementById("mySelectBox");
    selectBox.addEventListener("change", function () {
        let selected_option = $('#mySelectBox option:selected');
        getSpecifiedNumberOfOrders(selected_option.val());
        getOrderPage(1);
    });
}
