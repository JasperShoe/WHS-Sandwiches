function getChecked(tableRow, checkbox) {
    const completedOrderTable = $('#complete-order-table');
    const todoOrderTable = $('#incomplete-order-table');
    if (checkbox.checked){
        // If you check a box, put the row in the completed table and set the is_completed boolean to true.
        completedOrderTable.append(tableRow);
        $.ajax({
            url: 'http://localhost:3000/orders/' + tableRow.getAttribute('data-order-id'),
            method: 'PUT',
            data: {
                is_completed: true
            }
        });
    }
    else {
        // If you uncheck a box, put the row in the to-do table and set the is_completed boolean to false.
        todoOrderTable.append(tableRow);
        $.ajax({
            url: 'http://localhost:3000/orders/' + tableRow.getAttribute('data-order-id'),
            method: 'PUT',
            data: {
                is_completed: false
            }
        });
    }
}


