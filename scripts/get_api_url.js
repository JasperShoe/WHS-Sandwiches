function get_api_url(){
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        return "http://localhost:3000/";
    }
    else {
        return "https://s5bezpvqp6.execute-api.us-east-1.amazonaws.com/dev/";
    }
}