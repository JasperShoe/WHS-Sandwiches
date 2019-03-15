var order;

function submitOrder() {
    var radioButton = $("input[name='lunch']:checked");
    var checkboxes = document.getElementsByClassName("ingredientcheckbox");
    var orderIngredients = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            orderIngredients.push({
                ingredient_type_id: checkboxes[i].parentElement.id.toString(),
                name: checkboxes[i].parentElement.innerText
            });
        }
    }
    if (isValidOrder(orderIngredients)) {
        order = {
            student_email: "rafaelvchaves@gmail.com",
            ingredients: orderIngredients,
            which_lunch: radioButton.val(),
            is_favorite: true,
            date: Date()
        };
        console.log(order);
        getPopupMenu(order);
        clearChecklist(checkboxes, radioButton);
    }
}

function finalize() {
    $.ajax({
        url: "http://localhost:3000/orders/",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(order),
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // }
    });
    // window.location.href = "main.html";
    alert("Your order has been submitted!");
}


// Delete Order:
// $.ajax({
//     url: "http://localhost:3000/orders/",
//     type: 'DELETE',
//     contentType: 'application/json',
//     data: JSON.stringify(order),
//     dataType: 'json'
// });

function getOrderWithQuery() {
    $.get("http://localhost:3000/orders/", {
        student_email: "rafaelvchaves@gmail.com",
        is_favorite: true
    }, function (data) {
        console.log(data);
        alert("Data: " + data);
    });
}

function clearChecklist(checks, radio) {
    for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            checks[i].checked = false;
        }
    }
    radio.attr('checked', false);
}

var it_json;
$.get('http://localhost:3000/ingredient_types/', function (json) {
    it_json = json;
});
var i_json;
$.get('http://localhost:3000/ingredients/', function (json) {
    i_json = json;
});


function isValidOrder(selected_ingredients) {
    for (var i = 0; i < it_json.length; i++) {
        var counter = 0;
        for (var j = 0; j < selected_ingredients.length; j++) {
            if (selected_ingredients[j].ingredient_type_id === it_json[i]._id) {
                counter++;
            }
        }
        if (counter < it_json[i].limit && i === 0) {
            console.log(`Error: you have not selected a bread.`);
            return false;
        } else if (counter > it_json[i].limit) {
            console.log(`Error: you have selected too many ${it_json[i].name}s`);
            return false;
        }
        if (selected_ingredients.length <= 1) {
            console.log(`Error: you must select more than one ingredient.`);
            return false;
        }
        var radioValue = $("input[name='lunch']:checked").val();
        if (!radioValue) {
            console.log(`Error: you must select a lunch.`);
            return false;
        }


    }
    return true;
}


