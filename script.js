"use strict";

// global variables to be set when user selects values in modal
let searchName;
let searchCity;

// loads modal on page load
$(window).on('load', function () {
    $('#exampleModalCenter').modal('show')
});

// load modal on button click 
$("#modal-button").on('click', function (event) {
    $("#login-modal").modal('show')
});

// function run after DOM loads
$(document).ready(function () {

    // checking if there is a user logged in
    var email, uid;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            email = user.email;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            console.log(email, uid);
            console.log("you're logged in");
            // hide the login modal
            $("#modal-button").hide();

            // show account info/setting dropdown in Navbar if logged in
            $("#account").show();

        } else {
            // No user is signed in.
            console.log("No user signed in");
            $("#create-button").on("click", function (event) {
                event.preventDefault();

                // Grabs user input
                var signUpEmail = $("#userEmail").val().trim();
                var signUpPassword = $("#userPassword").val().trim();

                // Creates local obj for train data
                // var loginObject = {
                //     email: emailLogin,
                //     password: passwordLogin,
                // };
                // var loginObject = {
                //     email: emailLogin,
                //     password: passwordLogin,
                // };
                //   use Firebase function to add userEmail/password combo

                firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword);
                // catch(function(error) {
                //     // Handle Errors here.
                //     var errorCode = error.code;
                //     var errorMessage = error.message;
                //     // ...


                $("#userEmail").val("");
                $("#userPassword").val("");

                // checking for if user logged into firebase 




                // TODO add logic to only hide modal after succesful login/sign up
                $("#login-modal").modal("hide");
            });
        }
    });

    // load emoji/city modal
    $('#exampleModalCenter').modal('show')

    // hides the account info dropdown
    $("#account").hide();

    // see if there is a user logged in as page loads
    var user = firebase.auth().currentUser;
    console.log(user);
    // grabs values from emojis and city and stores them in variables to pass into API call
    $(".radio").on("click", function () {
        searchName = this.value;
        return searchName;
    });

    // "change" fires for input, select, textarea - need blank city to force a change to grab value for city
    $("#select-city").on("change", function () {
        searchCity = this.value;
        return searchCity;
    });

    // close the save button only if searchName and searchCity are truthy
    $("#save-button").on("click", function () {
        if (searchCity && searchName) {
            console.log(searchName);
            // set variables to local storage
            localStorage.setItem("searchName", searchName);
            localStorage.setItem("searchCity", searchCity);
            // hide modal
            $("#exampleModalCenter").modal("hide");
        }
    });
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAtSkxYOaVlS4XMUa2Ja2zsU-Q9Z2hbEg0",
    authDomain: "project-1-7fdb3.firebaseapp.com",
    databaseURL: "https://project-1-7fdb3.firebaseio.com",
    projectId: "project-1-7fdb3",
    storageBucket: "project-1-7fdb3.appspot.com",
    messagingSenderId: "926155997785"
};
firebase.initializeApp(config);

// function for login info submit button
// sign up button function

// Sign in button function
$("#login-button").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var loginEmail = $("#userEmail").val().trim();
    var loginPassword = $("#userPassword").val().trim();

    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);

    // // Clears it out
    $("#userEmail").val("");
    $("#userPassword").val("");

    // TODO set up with promise and then display message in navbar if user is logged in

    // TODO add logic to only hide modal after succesful login/sign up
    $("#login-modal").modal("hide");
});

$("#logout-button").on("click", function (event) {
    event.preventDefault();
    // use Firebase function to add userEmail/password combo
    firebase.auth().signOut();
    $("#account").hide();
    $("#modal-button").show();
    console.log("user signed out");
});

// API Calls
// function to call Edamam API, call is on eatin.html
function displayRecipes() {

    // retrieve from local storage
    searchName = localStorage.getItem("searchName");
    searchCity = localStorage.getItem("searchCity");

    // run displayRecipes function
    let search = {
        name: searchName,
        calories: "500-1200",
        health: "alcohol-free",
    }

    //for API call
    let queryURL = `https://api.edamam.com/search?q=${search.name}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=${search.calories}&health=${search.health}`
    // note: calories returned in JSON response is yield, need to divide by yield: to get calories per serving - for future calculation calories / yield of the recipe

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        $("#recipes-container").empty();

        // go through results and add attr to display on DOM
        for (let i = 0; i < response.hits.length; i++) {
            let image = response.hits[i].recipe.image;
            let label = response.hits[i].recipe.label;
            console.log(image);
            console.log(label);

            let imageDiv = $("<div>").addClass("recipe-pictures m-2");
            let recipeImage = $("<img>").attr("src", image);
            let recipeLabel = $("<p>").text(label).addClass("recipe-label p-2");
            imageDiv.append(recipeImage).append(recipeLabel);
            $("#recipes-container").append(imageDiv);
        }
    });
};

// Restaurant API call
let numberOfDisplays = 3;
let limit;

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchName + "&location=" + searchCity,
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
    for (let i = 0; i < numberOfDisplays; i++) {
        $("#restaurant-name-" + i).text(businesses[i].name);
        $("#image-" + i).attr("src", businesses[i].image_url);
        $("#rating-" + i).text("Rating: " + businesses[i].rating);
        $("#price-" + i).text("Price: " + businesses[i].price);
    }
    console.log(response);
});

