function getOrder(){
    var ingredients = document.getElementsByClassName("ingredientcheckbox");
    var orderIngredients = [];

    // console.log(all);
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].checked) {
            orderIngredients.push(ingredients[i].parentElement.innerText);
        }
    }
    console.log(orderIngredients);
    clearChecklist(ingredients);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3000/orders', false);
    var data = new FormData();
    data.append('student_email', 'rafavchaves@gmail.com');
    data.append('ingredients', 'orderIngredients');
    data.append('which_lunch', '1');

    xhr.send();
}

function clearChecklist(ingrs){
    for (var i = 0; i < ingrs.length; i++) {
        if (ingrs[i].checked){
            ingrs[i].checked = false;
        }
    }
}