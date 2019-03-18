const url = "http://localhost:3000/orders/";

//todo: scenario - students orders a sandwich today for consumption tomorrow
//todo: scenario - how to prevent / deal with orders with ingredients that become out of stock after they are ordered

$(document).ready(function () {
    $.get(url, {student_email: "rafaelvchaves@gmail.com", daysOfOrders: 1, sort: {date: -1}}, function (orderHistory) {
        let order_div = $('#orders_div');
        if (orderHistory.length === 0) {
            order_div.append('<h3>You have not placed any orders yet.</h3>');
        }
        else {
            for (let i = 0; i < orderHistory.length; i++) {
                let arr = [];
                for (let j = 0; j < orderHistory[i].ingredients.length; j++) {
                    arr.push(orderHistory[i].ingredients[j].name)
                }
                order_div.append('<div class="oldOrder"><p> Order # '+ i + '</p><div class="ingredients">'+ arr + '</div><p>' + orderHistory[i].date + '</p><div class="buttons"><button class = "previousOrderButton" onclick=""> Order</button><button id = "favoriteButton" onclick="moveToFavorites(this.parentElement.id)"> Save as Favorite</button></div></div>');
                // let OrderButton = $('.previousOrderButton');
                // OrderButton.last().attr("id", orderHistory[i]._id);
                // let makeFav = $('#favoriteButton');
                // makeFav.last().attr("id", id);
                let buttons = $(".buttons")
                buttons.last().attr("id", orderHistory[i]._id)
            }
        }
    });

});
function moveToFavorites(id) {
    $.ajax({
        url: url + id,
        method: 'PUT',
        data: {
            is_favorite: true
        },
        success: confirmFavorite(id)

});

}

function confirmFavorite(){
    const msg = $('.alerts');
    msg.append('<div class="alert"><span class="closebtn" onclick="closeAlert(this.parentElement)">&times;</span>Order Saved as Favorite. </div>');
    // let closeBtn = $('.closebtn')
    let alert = document.getElementsByClassName("alert");
    alert[alert.length - 1].style.display = "block";
    // $('.closebtn').attr("id", id);
    // closeBtn.last().style.display = "block";
    $(window).scrollTop(0);
}
function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"; }, 600);
}
// function removeFavorite(id) {
//     $.ajax({
//         url: url + id,
//         method: 'PUT',
//         data: {
//             is_favorite: false
//         },
//         success: function () {
//             console.log("Success")
//         }
//     });
// }