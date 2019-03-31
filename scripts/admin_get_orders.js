let perPage, todoOrders, completedOrders;

$(document).ready(function () {
    setupTables();
});

function setupTables() {
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
        configureTodoTable();
        configureCompletedTable();
        setupListeners();
    });

}
let theseOrders, thisPagination, thisTableBody, isCompletedOrderTable;
function configureTodoTable() {
    isCompletedOrderTable = false;
    theseOrders = todoOrders;
    thisPagination = $('#todo-orders-pagination');
    thisTableBody = $('#incomplete-order-table');
    createPaginationMenu($('#todoSelectBox option:selected').val());
    getOrdersOnPage(1);
}

function configureCompletedTable() {
    isCompletedOrderTable = true;
    theseOrders = completedOrders;
    thisPagination = $('#completed-orders-pagination');
    thisTableBody = $('#completed-order-table');
    createPaginationMenu($('#completedSelectBox option:selected').val());
    getOrdersOnPage(1);

}

function createPaginationMenu(ordersPerPage) {
    perPage = ordersPerPage;
    let numPages = theseOrders.length / perPage;
    thisPagination.empty();
    for (let i = 0; i < numPages; i++) {
        thisPagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getOrdersOnPage(this.text)">${i + 1}</a></li>`)
    }
}

function getOrdersOnPage(pageNumber) {
    let start = (pageNumber - 1) * perPage;
    thisTableBody.empty();
    for (let i = start; i < start + perPage; i++) {
        if (theseOrders[i]) {
            let ingredientNames = [];
            for (let j = 0; j < theseOrders[i].ingredients.length; j++) {
                ingredientNames.push(theseOrders[i].ingredients[j].name)
            }
            let table_row = `<tr class="order-view" data-order-id="${theseOrders[i]._id}"><th scope="row">${theseOrders[i].student_email.split('@')[0]}</th><td>${new Date(theseOrders[i].order_date).toLocaleString()}</td><td>${new Date(theseOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${toOrdinalNumber(theseOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="updateOrderStatus(this.parentElement.parentElement, this)"></td></tr>`;
            thisTableBody.append(table_row);
            if (isCompletedOrderTable)
                $(`[data-order-id=${completedOrders[i]._id}]`).find('.orderChecker').prop("checked", true)
        }
    }
}
function setupListeners() {
    let todoSelectBox = document.getElementById("todoSelectBox");
    let completedSelectBox = document.getElementById("completedSelectBox");
    todoSelectBox.addEventListener("change", function () {
        configureTodoTable();
        let selected_option = $('#todoSelectBox option:selected');
        createPaginationMenu(selected_option.val());
        getOrdersOnPage(1);
    });
    completedSelectBox.addEventListener("change", function () {
        configureCompletedTable();
        let selected_option = $('#completedSelectBox option:selected');
        createPaginationMenu(selected_option.val());
        getOrdersOnPage(1);
    });
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
        }
    });
}


function toOrdinalNumber(lunchVal) {
    switch (lunchVal) {
        case 1:
            return `${lunchVal}st`;
        case 2:
            return `${lunchVal}nd`;
        case 3:
            return `${lunchVal}rd`;
    }
}