let numberOfDisplays = 3;

let term;
let categories;
let city;
let limit;


var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=thai&location=bellevue,WA",
    "method": "GET",
    "headers": {
        // "accept": "application/json",
        // "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
        "cache-control": "no-cache",
        
    }
}
   
$.ajax(settings).done(function (response) {
    let businesses = response.businesses;
    for (let i = 0; i < 3; i++) {
        $("#restaurant-name-"+i).text(businesses[i].name);
        $("#image-"+i).attr("src", businesses[i].image_url);
        $("#rating-"+i).text("Rating: " + businesses[i].rating);
        $("#price-"+i).text("Price: " + businesses[i].price);
    }
    console.log(response);
});