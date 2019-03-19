let finalOrder;

function clearModalsOnClick() {
    const order_summary = $('#order_summary_modal');
    const make_favorite = $('#make_favorite_modal');
    const close = document.getElementsByClassName("close-button");
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            order_summary.empty();
            make_favorite.empty();
        };
    }

}
function populateOrderModal(order_details) {
    const order_summary = $('#order_summary_modal');

    order_summary.append(`<p> email: ${order_details.student_email} </p>`);
    order_summary.append(`<ul> ingredients: </ul>`);
    for (let i = 0; i < order_details.ingredients.length; i++) {
        order_summary.append(`<li>${order_details.ingredients[i].name}</li>`);
    }
    order_summary.append(`<p> date: ${order_details.date} </p>`);
    order_summary.append(`<p> lunch: ${order_details.which_lunch} </p>`);

    clearModalsOnClick();
    finalOrder = order_details;
}

function postOrder() {
    $.ajax({
        url: "http://localhost:3000/orders/",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(finalOrder),
        dataType: 'json',
        // success: function (data){
        //     orderCompleted(data.ingredients);
        // }
    });
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    const selectedLunch = $("input[name='lunch']:checked");
    clearChecklist(checkboxes, selectedLunch);
    collapseAll();
}

function nameFavoriteOrder() {
    const saveFavoriteButton = $('#save_favorite_button');
    saveFavoriteButton.attr("data-dismiss", null);
    const make_favorite = $('#make_favorite_modal');
    make_favorite.append(`<div class="favoriteSaver"><input id="favoriteName" type="text" maxlength="15" placeholder="Name this Favorite"></div>`);
}


function saveFavoriteOrder(){
    const saveFavoriteButton = $('#save_favorite_button');
    let favName = document.getElementById("favoriteName").value;
    if (favName){
        saveFavoriteButton.attr("data-dismiss", "modal");
        let favOrder = {
            student_email: getCookie("email"),
            ingredients: finalOrder.ingredients,
            favorite_name: favName
        };
        $.ajax({
            url: "http://localhost:3000/favorite_orders/",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(favOrder),
            dataType: 'json',
            success: function (data){
                confirmFavoriteAddition(data.favorite_name);
            }
        });
        const order_summary = $('#order_summary_modal');
        const make_favorite = $('#make_favorite_modal');
        order_summary.empty();
        make_favorite.empty();
    }
    else {
        alert("Please enter name for this favorite.")
    }
}

function clearChecklist(checks, radio) {
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            checks[i].checked = false;
        }
    }
    radio.attr('checked', false);
}

function confirmFavoriteAddition(name){
    const msg = $(".alerts");
    msg.append(`<div class="alert"><span class="closebtn" onclick="closeAlert(this.parentElement)">&times;</span>"${name}" has been saved to your favorites. </div>`);
    let alert = document.getElementsByClassName("alert")[0];
    alert.style.display = "block";
    alert.style.opacity = "100";
    $(window).scrollTop(0);
}
function closeAlert(div){
    const alerts = $(".alerts");
    div.style.opacity = "0";
    setTimeout(function(){ alerts.empty(); }, 600);

}

function collapseAll() {
    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {
        acc[i].classList.remove("active");
        let panel = acc[i].nextElementSibling;
        while (panel) { // While the next element exists
            if (panel.style.maxHeight) { // If the panel has a maxHeight (meaning it's open), then close it
                panel.style.maxHeight = null;
            }

            // Keep going to the next element to open it until we hit the next accordion (which will be a button).
            // If we hit a button, terminate the while loop by setting the panel to null.
            if (panel.nextElementSibling === null)
                panel = null;
            else if (panel.nextElementSibling.nodeName.toLowerCase() === "button")
                panel = null;
            else
                panel = panel.nextElementSibling;
        }

    }
}
