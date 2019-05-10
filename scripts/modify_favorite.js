const favoriteOrdersURL = get_api_url() + "favorite_orders";
let newFavoriteName, thisOrderID;

// Gets the favorite order that the user clicked on from the database.
function identifyFavorite(favoriteOrderID) {
    const modalTitle = document.getElementById("favoriteName");
    const saveFavoriteButton = $('#save_favorite_button');
    saveFavoriteButton.attr("data-dismiss", null);
    $(".ingredientcheckbox").prop("checked", false);
    let favoriteOrderPromise = $.get(get_api_url() + "favorite_orders/" + favoriteOrderID);
    favoriteOrderPromise.success(function (favoriteOrder) {
        modalTitle.innerText = favoriteOrder.favorite_name;
        newFavoriteName = favoriteOrder.favorite_name;
        thisOrderID = favoriteOrderID;
        editFavorite(favoriteOrder);
    })

}

// Once the favorite is identified, set the modal body so that all of the accordions are expanded and the ingredients from the favorite are checked.
function editFavorite(thisFavoriteOrder) {
    expandAllAccordions();
    for (let i = 0; i < thisFavoriteOrder.ingredients.length; i++) {
        let ingredientID = thisFavoriteOrder.ingredients[i]._id;
        let ingredientWithSameID = $(`[data-ingredient-id=${ingredientID}]`);
        ingredientWithSameID.find(".ingredientcheckbox").prop("checked", true);
    }

}

function expandAllAccordions() {
    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {
        acc[i].classList.toggle("active");
        let panel = acc[i].nextElementSibling;
        while (panel) {
            panel.style.maxHeight = "60px";
            if (panel.nextElementSibling === null)
                panel = null;
            else if (panel.nextElementSibling.className !== "panel")
                panel = null;
            else
                panel = panel.nextElementSibling;
        }
    }
}

// Once the user has edited their favorite order, loop through the checked boxes and create a new ingredient list.
function confirmFavoriteSave() {
    const saveFavoriteButton = $('#save_favorite_button');
    const checkboxes = document.getElementsByClassName("ingredientcheckbox");
    let favoriteOrderIngredients = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            let ingredientPanel = checkboxes[i].parentElement.parentElement;
            favoriteOrderIngredients.push({
                ingredient_type_id: ingredientPanel.getAttribute("data-ingredient-type-id"),
                _id: ingredientPanel.getAttribute("data-ingredient-id"),
                name: checkboxes[i].parentElement.innerText
            });
        }
    }
    // Then, after making sure the favorite order still has a name and a valid ingredient set, call an http put request to update the favorite in the db.
    if (newFavoriteName && isValidOrder(favoriteOrderIngredients)) {
        saveFavoriteButton.attr("data-dismiss", "modal");
        $.ajax({
            url: get_api_url() + "favorite_orders/" + thisOrderID,
            method: 'PUT',
            data: {
                ingredients: favoriteOrderIngredients,
                favorite_name: newFavoriteName
            },
            // Once the favorite order is successfully updated, change the html on the page with the new favorite order info.
            success: function (updated_favorite_order) {
                getFavoritesOn();
                showAlert(`"${updated_favorite_order.favorite_name}" has been updated.`);
            }
        });
    } else if (!newFavoriteName) {
        alert("Please enter name for this favorite.")
    }
}

function deleteFavorite(favoriteOrderID){
    $.ajax({
        url: get_api_url() + "favorite_orders/" + favoriteOrderID,
        type: 'DELETE',
        success: function() {
            setTimeout(function() {
                let favOrderContainer = $(`[data-favorite-order-id=${favoriteOrderID}]`).parent();
                favOrderContainer.css("opacity", 0);
                favOrderContainer.remove()
            }, 100);
            window.location.reload();
        }
    });

}


