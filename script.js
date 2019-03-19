"use strict";

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

database = firebase.database();

// global variables to be set when user selects values in modal
let searchName;
let searchCity;

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

    // checking if there is a user logged in
    var email, uid;
    firebase.auth().onAuthStateChanged(function (user) {
        $('#exampleModalCenter').modal('show');
        if (user) {
            // User is signed in.
            email = user.email;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            console.log(email, uid);
            console.log("you're logged in");

            // store user's email and user ID in firebase database
            // using user ID as key to store all necessary information in that key
            database.ref(uid).set({
                email: email,
            });

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

               
                //   use Firebase function to add userEmail/password combo
                firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword);


                $("#userEmail").val("");
                $("#userPassword").val("");

                // TODO add logic to only hide modal after succesful login/sign up
                $("#login-modal").modal("hide");
            });
        }
    });

    // load emoji/city modal
    $('#exampleModalCenter').modal('show');

    // hides the account info dropdown
    $("#account").hide();


    // grabs values from emojis and city and stores them in variables to pass into API call
    $(".radio").on("click", function () {
        searchName = this.value;
        return searchName;
    });

// save to firebase if logged in else local
    $("#save-button").on("click", function () {
        if (searchCity && searchName) {
            console.log(searchName);

            // if user is signed in save location and cuisine type to firebase
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    database.ref(uid).set({
                        location: searchName,
                        categories: searchName,
                    });
                } 
                // if user is not signed in save data to local storage
                else {
                    localStorage.setItem("searchName", searchName);
                    localStorage.setItem("searchCity", searchCity);
                }
        
                
            });
            // hide modal
            $("#exampleModalCenter").modal("hide");
        }   
    });


// see if there is a user logged in as page loads
var user = firebase.auth().currentUser;
console.log(user);

// function for login info submit button
// Sign in button function

// load modal on button click 
$("#modal-button").on("click", function () {
    $("#login-modal").modal("show")
});

// check if user is logged in
var email, uid;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user)
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
        console.log("No user signed in");
        $("#exampleModalCenter").modal("show")
    }
});

// create an account
$("#create-button").on("click", function (event) {
    event.preventDefault();
    // Grabs user input
    var signUpEmail = $("#userEmail").val().trim();
    var signUpPassword = $("#userPassword").val().trim();

    firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword)
        .then(function (data) {
            console.log(data);
            // hide modal if successful
            $("#login-modal").modal("hide");
        }).catch(function (error) {
            // alert user that entry was invalid
            $("#auth-message").html(error.message);
        })
    // clear fields
    // $("#userEmail").val("");
    // $("#userPassword").val("");
});

// login 

$("#login-button").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var loginEmail = $("#userEmail").val().trim();
    var loginPassword = $("#userPassword").val().trim();

    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (data) {
            console.log(data);
            $("#login-modal").modal("hide");
        }).catch(function (error) {
            // alert user entry was invalid
            $("#auth-message").html(error.message);
        })
    // Clears it out
    // $("#userEmail").val("");
    // $("#userPassword").val("");

});

// hides the account info dropdown
$("#account").hide();

$("#logout-button").on("click", function (event) {
    event.preventDefault();
    // use Firebase function to add userEmail/password combo
    firebase.auth().signOut();
    $("#account").hide();
    $("#modal-button").show();
    console.log("user signed out");
});

// eatin new API call
// grabbing cuisine

let recipeCuisine;
let recipePrep;
let recipeCalories;

$("#recipe-cuisine").on("change", function () {
    recipeCuisine = this.value;
    return recipeCuisine;
});

$("#recipe-prep-time").on("change", function () {
    recipePrep = this.value;
    return recipePrep;
});

$("#recipe-calories").on("change", function () {
    recipeCalories = this.value;
    return recipeCalories;
});

// close the save button only if searchName and searchCity are truthy
$("#submit-recipe-filters").on("click", function () {
    if (recipeCuisine && recipePrep && recipeCalories) {
        console.log(recipeCuisine);
        console.log(recipePrep);
        console.log(recipeCalories);
        // set variables to local storage
        localStorage.setItem("recipeCuisine", recipeCuisine);
        localStorage.setItem("recipePrep", recipePrep);
        localStorage.setItem("recipeCalories", recipeCalories);

        $("#recipe-cuisine").val("");
        $("#recipe-prep-time").val("");
        $("#recipe-calories").val("");

        newRecipesDisplay();
    }
});

function newRecipesDisplay() {

    // retrieve from local storage
    recipeCuisine = localStorage.getItem("recipeCuisine");
    recipePrep = localStorage.getItem("recipePrep");
    recipeCalories = localStorage.getItem("recipeCalories");

    // run displayRecipes function
    let search = {
        name: recipeCuisine,
        prep: recipePrep,
        calories: recipeCalories,
        // health: "alcohol-free",
    }

    //for API call
    let queryURL = `https://api.edamam.com/search?q=${search.name}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=${search.calories}&time=${search.prep}`
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
        // health: "alcohol-free",
    }

    //for API call
    let queryURL = `https://api.edamam.com/search?q=${search.name}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=${search.calories}`
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
function displayRestaurants() {
    // retrieve from local storage
    searchName = localStorage.getItem("searchName");
    searchCity = localStorage.getItem("searchCity");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchName + "&location=" + searchCity + "&limit=3",
        "method": "GET",
        "headers": {
            // "accept": "application/json",
            // "Access-Control-Allow-Origin": "*",
            "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
            "cache-control": "no-cache",
        }
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#recipes-container").empty();
        // let businesses = response.businesses;
        for (let i = 0; i < response.businesses.length; i++) {
            let businessName = response.businesses[i].name;
            let businessImage = response.businesses[i].image_url;
            let businessRating = response.businesses[i].rating;
            let businessReviewCount = response.businesses[i].review_count;
            let businessPrice = response.businesses[i].price;
            let businessPhone = response.businesses[i].phone;
            let businessAddress = response.businesses[i].location.address1;
            let businessCity = response.businesses[i].location.city;

            // $("#restaurant-name-" + i).text(businesses[i].name);
            // $("#image-" + i).attr("src", businesses[i].image_url);
            // $("#rating-" + i).text("Rating: " + businesses[i].rating);
            // $("#price-" + i).text("Price: " + businesses[i].price);

            let imageDiv = $("<div>").addClass("restaurant-image m-2");
            let restaurantImage = $("<img>").attr("src", businessImage);
            let restaurantName = $("<p>").text(businessName).addClass("restaurant-name p-2");
            let restaurantRating = $("<p>").text(businessRating).addClass("restaurant-rating p-2");
            let restaurantPrice = $("<p>").text(businessPrice).addClass("restaurant-price p-2");
            let restaurantReviewCount = $("<p>").text(businessReviewCount).addClass("restaurant-review-count p-2");
            let restaurantPhone = $("<p>").text(businessPhone).addClass("restaurant-phone p-2");
            let restaurantAddress = $("<p>").text(businessAddress).addClass("restaurant-address p-2");
            let restaurantCity = $("<p>").text(businessCity).addClass("restaurant-city p-2");

            imageDiv.append(restaurantImage).append(restaurantName).append(restaurantRating).append(restaurantReviewCount).append(restaurantPrice).append(restaurantPhone).append(restaurantAddress).append(restaurantCity);
            $("#restaurants-container").append(imageDiv);
        }
    });
};
      