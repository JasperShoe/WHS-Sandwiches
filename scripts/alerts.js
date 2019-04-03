function showAlert(msg){
    let alert = document.getElementsByClassName("alert")[0];
    const alert_text = $(".alert-msg");
    alert_text.text("");
    $(window).scrollTop(0);
    alert.style.display = "block";
    alert.style.opacity = "100";
    alert_text.text(msg)
}
function closeAlert(div){
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"}, 600);
}