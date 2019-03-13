function getOrder(){
    // var ingredients = document.getElementsByClassName("checkcontainer");
    // console.log(ingredients);


    var checkboxes = document.getElementsByClassName("ingredientcheckbox");
    var orderIngredients = [];

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            console.log(checkboxes[i].parentElement.innerText);
            orderIngredients.push(checkboxes[i].parentElement.innerText);
        }
    }
    clearChecklist(checkboxes);
    console.log(orderIngredients)
}

function clearChecklist(ingrs){
    for (var i = 0; i < ingrs.length; i++) {
        if (ingrs[i].checked){
            ingrs[i].checked = false;
        }
    }
}