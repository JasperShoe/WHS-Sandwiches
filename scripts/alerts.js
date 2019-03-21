function showAlert(msg){
    let alert = document.getElementsByClassName("alert")[0];
    const alert_text = $(".alert-msg");
    alert_text.text("");
    $(window).scrollTop(0);
    alert.style.display = "block";
    alert.style.opacity = "100";
    if (window.location.pathname === "/WHS-Sandwiches/pages/customize.html") {
        alert_text.text(`"${msg}" has been saved to your favorites.`)
    }
    else if (window.location.pathname === "/WHS-Sandwiches/pages/favorites.html") {
        alert_text.text(`"${msg}" has been updated.`)
    }
    else if (window.location.pathname === "/WHS-Sandwiches/pages/orders.html") {
        alert_text.text(`Order Saved as favorite.`)
    }

}
function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"}, 600);

}