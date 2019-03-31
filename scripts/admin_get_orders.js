let perPage, todoTableBody, completedTableBody, todoPagination, completedPagination, todoOrders, completedOrders;

$(document).ready(function () {
    setupTables();
});

function setupTables() {

    todoTableBody = $('#incomplete-order-table');
    completedTableBody = $('#completed-order-table');
    todoPagination = $('#todo-orders-pagination');
    completedPagination = $('#completed-orders-pagination');
    let orderPromise = $.get("http://localhost:3000/orders/", {
        daysOfOrders: 1,
        sort: {order_date: -1}
    });
    orderPromise.success(function (orderHistory) {
        todoOrders = [];
        completedOrders = [];
        for (let i = 0; i < orderHistory.length; i++) {
            if (orderHistory[i].is_completed) {
                completedOrders.push(orderHistory[i]);
            } else {
                todoOrders.push(orderHistory[i])
            }
        }
        configurePageCountSelectors();
    });

}

function createTodoPages(ordersPerPage) {
    perPage = ordersPerPage;
    let numPages = todoOrders.length / perPage;
    todoPagination.empty();
    for (let i = 0; i < numPages; i++) {
        todoPagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getTodoOrderPage(this.text)">${i + 1}</a></li>`)
    }

}

function createCompletedPages(ordersPerPage) {
    perPage = ordersPerPage;
    let numPages = completedOrders.length / perPage;
    completedPagination.empty();
    for (let i = 0; i < numPages; i++) {
        completedPagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getCompletedOrderPage(this.text)">${i + 1}</a></li>`)
    }

}

function getTodoOrderPage(pageNumber) {
    let start = (pageNumber - 1) * perPage;
    todoTableBody.empty();
    for (let i = start; i < start + perPage; i++) {
        if (todoOrders[i] && !todoOrders[i].is_completed) {
            let ingredientNames = [];
            for (let j = 0; j < todoOrders[i].ingredients.length; j++) {
                ingredientNames.push(todoOrders[i].ingredients[j].name)
            }
            let table_row = `<tr class="order-view" data-order-id="${todoOrders[i]._id}"><th scope="row">${todoOrders[i].student_email.split('@')[0]}</th><td>${new Date(todoOrders[i].order_date).toLocaleString()}</td><td>${new Date(todoOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${lunchToString(todoOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="updateOrderStatus(this.parentElement.parentElement, this)"></td></tr>`;
            todoTableBody.append(table_row);
        }
    }
}

function getCompletedOrderPage(pageNumber) {
    let start = (pageNumber - 1) * perPage;
    completedTableBody.empty();
    for (let i = start; i < start + perPage; i++) {
        if (completedOrders[i] && completedOrders[i].is_completed) {
            let ingredientNames = [];
            for (let j = 0; j < completedOrders[i].ingredients.length; j++) {
                ingredientNames.push(completedOrders[i].ingredients[j].name)
            }
            let table_row = `<tr class="order-view" data-order-id="${completedOrders[i]._id}"><th scope="row">${completedOrders[i].student_email.split('@')[0]}</th><td>${new Date(completedOrders[i].order_date).toLocaleString()}</td><td>${new Date(completedOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${lunchToString(completedOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="updateOrderStatus(this.parentElement.parentElement, this)"></td></tr>`;
            completedTableBody.append(table_row);
            $(`[data-order-id=${completedOrders[i]._id}]`).find('.orderChecker').prop("checked", true)

        }
    }
}

function updateOrderStatus(tableRow, checkbox) {
    $.ajax({
        url: 'http://localhost:3000/orders/' + tableRow.getAttribute('data-order-id'),
        method: 'PUT',
        data: {
            is_completed: checkbox.checked
        },
        success: function () {
            setupTables();
            configurePageCountSelectors();
        }
    });
}

function configurePageCountSelectors() {
    createTodoPages(5);
    createCompletedPages(5);
    getTodoOrderPage(1);
    getCompletedOrderPage(1);
    let todoSelectBox = document.getElementById("todoSelectBox");
    let completedSelectBox = document.getElementById("completedSelectBox");
    todoSelectBox.addEventListener("change", function () {
        let selected_option = $('#todoSelectBox option:selected');
        createTodoPages(selected_option.val());
        getTodoOrderPage(1);
    });
    completedSelectBox.addEventListener("change", function () {
        let selected_option = $('#completedSelectBox option:selected');
        createCompletedPages(selected_option.val());
        getCompletedOrderPage(1);
    });
}

function lunchToString(lunchVal) {
    let lunchString;
    switch (lunchVal) {
        case 1:
            lunchString = `${lunchVal}st`;
            break;
        case 2:
            lunchString = `${lunchVal}nd`;
            break;
        case 3:
            lunchString = `${lunchVal}rd`;
            break;
    }
    return lunchString;
}
