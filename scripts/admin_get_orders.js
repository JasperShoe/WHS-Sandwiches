let todoOrders, completedOrders, todoPerPage, completedPerPage, lastTodoPage, lastCompletedPage;

$(document).ready(function () {
    lastTodoPage = 1;
    lastCompletedPage = 1;
    setupDateSelectBox();
    setupTables();
});

function setupTables() {
    console.log("selected value: " + $('#dateSelectBox option:selected').val())
    let orderPromise = $.get(get_api_url() + "orders", {
        pickup_date: $('#dateSelectBox option:selected').val(),
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

function setupDateSelectBox() {
    let today = new Date();
    let dateSelectBox = $('#dateSelectBox') ;
    dateSelectBox.append(`<option value="${getPreviousPickupDate()}">${getPreviousPickupDate().toLocaleDateString()}</option>`)
    dateSelectBox.append(`<option value="${today}">${today.toLocaleDateString()}</option>`)
    dateSelectBox.append(`<option value="${getNextPickupDate()}">${getNextPickupDate().toLocaleDateString()}</option>`);
    $(`#dateSelectBox option[value="${today}"]`).prop('selected', true);
    dateSelectBox = document.getElementById("dateSelectBox")
    dateSelectBox.addEventListener("change", function () {
        setupTables();
    });
}

function configureTodoTable() {
    createTodoPaginationMenu(parseInt($('#todoSelectBox option:selected').val()));
    getTodoOrdersOnPage(lastTodoPage);
}

function configureCompletedTable() {
    createCompletedPaginationMenu(parseInt($('#completedSelectBox option:selected').val()));
    getCompletedOrdersOnPage(lastCompletedPage);

}

function createTodoPaginationMenu(ordersPerPage) {
    todoPerPage = ordersPerPage;
    let numPages = todoOrders.length / todoPerPage;
    if (lastTodoPage > Math.ceil(numPages) && Math.ceil(numPages) !== 0) {
        lastTodoPage = numPages
    }
    let thisPagination = $('#todo-orders-pagination');
    thisPagination.empty();
    for (let i = 0; i < numPages; i++) {
        thisPagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getTodoOrdersOnPage(this.text)">${i + 1}</a></li>`);
    }
}

function getTodoOrdersOnPage(pageNumber) {
    lastTodoPage = pageNumber;
    let start = (pageNumber - 1) * todoPerPage;
    let thisTableBody = $('#incomplete-order-table');
    thisTableBody.empty();
    let theseOrders = todoOrders;
    for (let i = start; i < start + todoPerPage; i++) {
        if (theseOrders[i]) {
            let ingredientNames = [];
            for (let j = 0; j < theseOrders[i].ingredients.length; j++) {
                ingredientNames.push(theseOrders[i].ingredients[j].name)
            }
            let table_row = `<tr class="order-view" data-order-id="${theseOrders[i]._id}"><th scope="row">${theseOrders[i].student_email.split('@')[0]}</th><td>${new Date(theseOrders[i].order_date).toLocaleString()}</td><td>${new Date(theseOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${toOrdinalNumber(theseOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="updateOrderStatus(this.parentElement.parentElement, this)"></td></tr>`;
            thisTableBody.append(table_row);
        }
    }
}

function createCompletedPaginationMenu(ordersPerPage) {
    completedPerPage = ordersPerPage;
    let numPages = completedOrders.length / completedPerPage;
    if (lastCompletedPage > Math.ceil(numPages) && Math.ceil(numPages) !== 0) {
        lastCompletedPage = numPages;
    }
    let thisPagination = $('#completed-orders-pagination');
    thisPagination.empty();
    for (let i = 0; i < numPages; i++) {
        thisPagination.append(`<li class="page-item"><a class="page-link" href="#" onclick="getCompletedOrdersOnPage(this.text)">${i + 1}</a></li>`);
    }
}

function getCompletedOrdersOnPage(pageNumber) {
    lastCompletedPage = pageNumber;
    let start = (pageNumber - 1) * completedPerPage;
    let thisTableBody = $('#completed-order-table');
    thisTableBody.empty();
    let theseOrders = completedOrders;
    for (let i = start; i < start + completedPerPage; i++) {
        if (theseOrders[i]) {
            let ingredientNames = [];
            for (let j = 0; j < theseOrders[i].ingredients.length; j++) {
                ingredientNames.push(theseOrders[i].ingredients[j].name)
            }
            let table_row = `<tr class="order-view" data-order-id="${theseOrders[i]._id}"><th scope="row">${theseOrders[i].student_email.split('@')[0]}</th><td>${new Date(theseOrders[i].order_date).toLocaleString()}</td><td>${new Date(theseOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${toOrdinalNumber(theseOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox" onclick="updateOrderStatus(this.parentElement.parentElement, this)"></td></tr>`;
            thisTableBody.append(table_row);
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
        createTodoPaginationMenu(parseInt(selected_option.val()));
        getTodoOrdersOnPage(lastTodoPage);
    });
    completedSelectBox.addEventListener("change", function () {
        configureCompletedTable();
        let selected_option = $('#completedSelectBox option:selected');
        createCompletedPaginationMenu(parseInt(selected_option.val()));
        getCompletedOrdersOnPage(lastCompletedPage);
    });
}

function updateOrderStatus(tableRow, checkbox) {
    $.ajax({
        url: get_api_url() + 'orders/' + tableRow.getAttribute('data-order-id'),
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