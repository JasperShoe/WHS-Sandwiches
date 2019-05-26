$(document).ready(function () {
    setupListeners();
    configureTable("TODO");
    configureTable("COMPLETED");
});

function setupListeners() {
    $(`#todoSelectBox`).change(function () {
        configureTable("TODO")
    });
    $(`#completedSelectBox`).change(function () {
        configureTable("COMPLETED")
    });
    let nextPickup = new Date();
    nextPickup.setHours(10);
    nextPickup.setMinutes(40);
    nextPickup = getLetterDay(nextPickup) !== null ? nextPickup : getNextPickupDateFrom(nextPickup);
    let dateOptions = [getPreviousPickupDateFrom(nextPickup), nextPickup, getNextPickupDateFrom(nextPickup)];
    $('#dateSelectBox').html(generateDateOptions(dateOptions));
    $(`#dateSelectBox option[value="${nextPickup}"]`).prop('selected', true);
    document.getElementById("dateSelectBox").addEventListener("change", function () {
        configureTable("TODO");
        configureTable("COMPLETED");
    });
}

function generateDateOptions(dates) {
    let selectBoxHTML = ``;
    for (let i = 0; i < dates.length; i++) {
        selectBoxHTML+= `<option value="${dates[i]}">${dates[i].toLocaleDateString()}</option>`
    }
    return selectBoxHTML;
}

function configureTable(table) {
    switch (table) {
        case "TODO": {
            $.get(get_api_url() + "orders", {
                pickup_date: $('#dateSelectBox option:selected').val(),
                sort: {order_date: -1},
                is_completed: false
            }, function(todoOrders){
                let todoPerPage = parseInt($(`#todoSelectBox option:selected`).val());
                createPaginationMenu(todoPerPage, todoOrders, $('#todo-orders-pagination'), $('#incomplete-order-table'));
                getOrdersOnPage(1, todoPerPage, $('#incomplete-order-table'), todoOrders);
            });
            break;
        }
        case "COMPLETED": {
            $.get(get_api_url() + "orders", {
                pickup_date: $('#dateSelectBox option:selected').val(),
                sort: {order_date: -1},
                is_completed: true
            }, function(completedOrders){
                let completedPerPage = parseInt($(`#completedSelectBox option:selected`).val());
                createPaginationMenu(completedPerPage, completedOrders, $('#completed-orders-pagination'), $('#completed-order-table'));
                getOrdersOnPage(1, completedPerPage, $('#completed-order-table'), completedOrders);
            });

            break;
        }
        default: {
            console.log("Unknown Table")
        }
    }

}

function createPaginationMenu(ordersPerPage, typeOfOrders, $pagination, $tableBody) {
    let numPages = typeOfOrders.length / ordersPerPage;
    $pagination.empty();
    for (let i = 0; i < numPages; i++) {
        $pagination.append(`<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`);
        let pageItem = $pagination.find("li").last();
        $pagination.find("li").last().on("click", function () {
            getOrdersOnPage(pageItem.text(), ordersPerPage, $tableBody, typeOfOrders);
        });
    }
}

function getOrdersOnPage(pageNumber, ordersPerPage, $tableBody, typeOfOrders) {
    let start = (pageNumber - 1) * ordersPerPage;
    $tableBody.empty();
    for (let i = start; i < start + ordersPerPage; i++) {
        if (typeOfOrders[i]) {
            let ingredientNames = [];
            for (let j = 0; j < typeOfOrders[i].ingredients.length; j++) {
                ingredientNames.push(typeOfOrders[i].ingredients[j].name)
            }
            $tableBody.append(`<tr class="order-view" data-order-id="${typeOfOrders[i]._id}"><th scope="row">${typeOfOrders[i].student_email.split('@')[0]}</th><td>${new Date(typeOfOrders[i].order_date).toLocaleString()}</td><td>${new Date(typeOfOrders[i].pickup_date).toLocaleDateString()}</td><td class="ingredients-td">${ingredientNames}</td><td class="align-center">${toOrdinalNumber(typeOfOrders[i].which_lunch)}</td><td class="align-center order-checkbox"><input type="checkbox" class="orderChecker" name="checkbox"></td></tr>`);
            let orderCheckBox = $(`[data-order-id=${typeOfOrders[i]._id}]`).find('.orderChecker');
            orderCheckBox.prop("checked", typeOfOrders[i].is_completed);
            orderCheckBox.change(function () {
                updateOrderStatus(orderCheckBox.parent().parent().attr('data-order-id'), orderCheckBox.prop('checked'))
            })
        }
    }
}

function updateOrderStatus(id, isChecked) {
    $.ajax({
        url: get_api_url() + 'orders/' + id,
        method: 'PUT',
        data: {
            is_completed: isChecked
        },
        success: function () {
            configureTable("TODO");
            configureTable("COMPLETED");
        }
    });
}

function toOrdinalNumber(lunchVal) {
    switch (lunchVal) {
        case 1:
            return `1st`;
        case 2:
            return `2nd`;
        case 3:
            return `3rd`;
    }
}