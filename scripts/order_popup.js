function getPopupMenu(order) {
    // Class that has popup-content class
    var popup = document.getElementById("orderPopup");
    // Close button
    var span = document.getElementsByClassName("close")[0];
    var summary = $('#order_summary');


    summary.append(`<p> name: ${order.student_email} </p>`);
    summary.append(`<ul> ingredients: </ul>`);
    for (var i = 0; i < order.ingredients.length; i++) {
        summary.append(`<li> ${order.ingredients[i].name} </li>`);
    }


    summary.append(`<p> date: ${order.date} </p>`);



    popup.style.display = "block";

// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        popup.style.display = "none";
    };

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    };

}
