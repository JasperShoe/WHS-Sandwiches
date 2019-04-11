var purify = require("purify-css")

var content = "orders.html";
var css = "./styles/newnavbar.css";
var options = {
    output: "./styles/navbar.css"
};
purify(content, css, options);