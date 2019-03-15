let term;
let categories;
let location;
let limit;

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=delis&latitude=47.608648&longitude=-122.335963",
    "method": "GET",
    "headers": {
        "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
        "cache-control": "no-cache",
    }
}
   
$.ajax(settings).done(function (response) {
    console.log(response);
});