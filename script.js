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

let database = firebase.database();

// global variables to be set when user selects values in modal
let searchCuisine;
let searchCity;
let restaurantArr = []; // here is where we'll store the info of favorited restaurants
let recipeArr = []; // here is where we'll store the info of favorited recipes


// grabs values from emojis and city and stores them in variables to pass into API call
$(".radio").on("click", function () {
    searchCuisine = this.value;
    return searchCuisine;
});

// "change" fires for input, select, textarea - need blank city to force a change to grab value for city
$("#select-city").on("change", function () {
    searchCity = this.value;
    return searchCity;
});

// checking if there is a user logged in
var email, uid;
firebase.auth().onAuthStateChanged(function (user) {
    // When User is logged in allow the user to change 
    // $('#exampleModalCenter').modal('show');
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
        database.ref(uid).update({
            email: email
        });
        localStorage.setItem("seshID", uid);

        // hide the login modal
        $("#modal-button").hide();

        // show account info/setting dropdown in Navbar if logged in
        $("#account").show();
        $("")
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

// favorites page
function displayFavorites() {
    // use localStorage to grab uid to pull from firebase
    let localID = localStorage.getItem("seshID");
    // pulls from firebase and grabs the favRecipes and favRestaurants array
    database.ref(localID).once("value").then(function(snapshot) {
        
        recipeArr = JSON.parse(snapshot.val().favRecipes);
        restaurantArr= JSON.parse(snapshot.val().favRestaurants);
        console.log(recipeArr);
        console.log(restaurantArr);

        //populate restaurant-row in favorites page
        for (let i = 0; i < restaurantArr.length; i++) {
            let cardDiv = $("<div>").addClass("restaurant m-2 p-1 card col-3 animated slideInUp").attr("id", "restaurant_" + i);
            let restaurantImage = $("<img>").attr("src", restaurantArr[i].image).attr("style", 'width: 100%;height:auto;overflow:auto;').addClass("card-top-img restaurant-img");
            let cardBlock = $("<div>").addClass("card-block")
            let restaurantName = $("<h4>").text(restaurantArr[i].name).addClass("restaurant-name p-2");
            let restaurantRating = $("<li>").text("Rating: " + restaurantArr[i].rating).addClass("restaurant-rating p-2");
            let restaurantPrice = $("<li>").text("Price: " + restaurantArr[i].price).addClass("restaurant-price p-2");
            let restaurantReviewCount = $("<li>").text("Number of Reviews: " + restaurantArr[i].reviewCount).addClass("restaurant-review-count p-2");
            let restaurantPhone = $("<li>").text("Phone Number: " + restaurantArr[i].phone).addClass("restaurant-phone p-2");
            let restaurantAddress = $("<li>").text("Address: " + restaurantArr[i].address).addClass("restaurant-address p-2");
            let restaurantCity = $("<li>").text(restaurantArr[i].city).addClass("restaurant-city p-2");
            // instead of favorite button, add unfavorite button to remove selected from favorites
            let removeBtn = $("<button>").addClass("removeBtn align-self-end").attr("id", i).text("Remove Favorites");

            cardDiv.append(restaurantImage).append(cardBlock).append(restaurantName).append(restaurantRating).append(restaurantReviewCount).append(restaurantPrice).append(restaurantPhone).append(restaurantAddress).append(restaurantCity).append(removeBtn);
            $("#fav-rest-row").append(cardDiv);
        }
        
        // populate recipe-row in favorites page
        for (let i = 0; i < recipeArr.length; i++) {
            let imageDiv = $("<div>").addClass("card recipe-pictures m-2 p-1 col-3 animated slideInUp");
            let recipeImage = $("<img>").addClass("card-top-img").attr("src", recipeArr[i].image).attr("style", 'width: 100%;height:auto;overflow:auto;');
            let cardBlock = $("<div>").addClass("card-block")
            let recipeLabel = $("<h4>").text(recipeArr[i].name).addClass("card-title recipe-label p-2").attr("style", 'overflow:hidden;text-overflow: ellipsis;')
            let removeBtn = $("<button>").addClass("removeBtn align-self-end").attr("id", i).text("Remove Favorites");

            imageDiv.append(recipeImage).append(cardBlock).append(recipeLabel).append(removeBtn);

            $("#fav-recipe-row").append(imageDiv);
            $(".card-title").wrap($("<a>").attr("href", recipeArr[i].url)).attr("style", 'text-decoration: none;color:black;overflow: hidden;text-overflow: ellipsis;');
        }   
        // create a row with recipes list in it
        // var reciRow = $("<tr>").append(
        //     $("<td>").text(favReci),
        // );

        // // Append the new row to the page
        // $("#fav-recipe-row > tbody").append(reciRow);

        // // create the restaurant
        // var restRow = $("<tr>").append(
        //     $("<td>").text(favRest),
        // );

        //  // Append the new row to the table
        // $("#fav-recipe-row > tbody").append(restRow);
    });
}



// load emoji/city modal
// $('#exampleModalCenter').modal('show');

// hides the account info dropdown
$("#account").hide();

// save to firebase if logged in else local
$("#save-button").on("click", function () {
    if (searchCity && searchCuisine) {
        console.log(searchCuisine);

        // if user is signed in save location and cuisine type to firebase
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                database.ref(uid).update({
                    location: searchCuisine,
                    categories: searchCuisine,
                });
            }
            // if user is not signed in save data to local storage
            else {
                localStorage.setItem("searchCuisine", searchCuisine);
                localStorage.setItem("searchCity", searchCity);
            }


        });
        // hide modal


        $("#exampleModalCenter").modal("hide");
        $(".indexCard").attr('style', 'display:block;')
        $(".eat-in-card").addClass("animated bounceInLeft")
        $(".eat-out-card").addClass("animated bounceInRight")
    }
});

// function for login info submit button
// Sign in button function

// load modal on button click 
$("#modal-button").on("click", function () {
    $("#login-modal").modal("show")
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
            $("#auth-message").text("");
            $("#userEmail").val("");
            $("#userPassword").val("");
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
            $("#auth-message").text("");
            $("#userEmail").val("");
            $("#userPassword").val("");
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


// interaction to favorite recipes
$(document).on("click", ".favoriteRecipes", function () {

    console.log("clicked favoriteRecipes");
    // get the id of the button first to know which card was favorited
    let num = this.id;

    // grab all the information from cards
    // recipe img
    let placeImg = $(`#recipe_${num} > .card-top-img`).attr("src");
    // recipe name
    let placeName = $(`#recipe_${num} .recipe-label`).text();
    // recipe url
    let placeUrl = $(`#recipe_${num} #url_${num}`).attr("href");
    console.log(placeImg, placeName, placeUrl);



    // first grab the already existing favorite recipes from firebase
    // this uid should be firebase.auth().currentUser.uid if not replace it
    database.ref(uid).once("value").then(function (snapshot) {
        // this should update the empty arr in js with 
        recipeArr = JSON.parse(snapshot.val().favRecipes);
        // console.log(recipeArr);
    });

    // store the information in an array
    recipeArr.push({
        image: placeImg,
        name: placeName,
        url: placeUrl
    });

    console.log(recipeArr);
    // stringify the array
    let stringedArr = JSON.stringify(recipeArr);
    console.log(stringedArr);

    // update the array in firebase data 
    database.ref(uid).update({ favRecipes: stringedArr });

})

// for new api calls for eatin.html and eatout.html written as new functions below and listeners for filters
// eatout.html filters below
// let restaurantCuisine;
let restaurantPrice;
let restaurantRating;
let isVegetarian = "";
let isVegan = "";
let isGlutenFree = "";

$("#restaurant-cuisine").on("change", function () {
    searchCuisine = this.value;
    console.log("cuisine: " + searchCuisine);
    return searchCuisine;
});

$("#restaurant-price").on("change", function () {
    restaurantPrice = this.value;
    console.log("price: " + restaurantPrice);
    return restaurantPrice;
});

$("#restaurant-rating").on("change", function () {
    restaurantRating = this.value;
    console.log("rating" + restaurantRating);
    return restaurantRating;
});

$("#restaurant-city").on("change", function () {
    searchCity = this.value;
    console.log("city" + searchCity);
    return searchCity;
});

$("#vegetarian-check").on("change", function () {
    isVegetarian = this.value;
    console.log("Is Veggie?" + isVegetarian);
    return isVegetarian;
});

$("#vegan-check").on("change", function () {
    isVegan = this.value;
    console.log("Is Vegan?" + isVegan);
    return isVegan;
});

$("#gluten-free-check").on("change", function () {
    isGlutenFree = this.value;
    console.log("Is GF?" + isGlutenFree);
    return isGlutenFree;
});

// eatout.html submit button to capture values - yelp is nice and doesn't need all vaues to be valid to have queryURL work
$("#submit-restaurant-filters").on("click", function () {
    if (searchCuisine || restaurantPrice || restaurantRating || searchCity || isVegetarian) {
        console.log(searchCuisine);
        console.log(restaurantPrice);
        console.log(restaurantRating);
        console.log(searchCity);
        console.log(isVegetarian);
        console.log(isVegan);
        console.log(isGlutenFree);
        // set variables to local storage
        localStorage.setItem("searchCuisine", searchCuisine);
        localStorage.setItem("restaurantPrice", restaurantPrice);
        localStorage.setItem("restaurantRating", restaurantRating);
        localStorage.setItem("searchCity", searchCity);
        localStorage.setItem("isVegetarian", isVegetarian);
        localStorage.setItem("isVegan", isVegan);
        localStorage.setItem("isGlutenFree", isGlutenFree);

        $("#restaurant-cuisine").val("");
        $("#restaurant-price").val("");
        $("#restaurant-rating").val("");
        $("#restaurant-city").val("");
        $("#vegetarian-check").prop("checked", false);
        $("#vegan-check").prop("checked", false);
        $("#gluten-free-check").prop("checked", false);

        displayRestaurants();
    }
});

// Restaurant API call
function displayRestaurants() {

    // retrieve from local storage
    if (searchCuisine & isVegetarian & isVegan & isGlutenFree) {
        searchCuisine = localStorage.getItem("searchCuisine") + ", " + localStorage.getItem("isVegetarian") + ", " + localStorage.getItem("isVegan") + ", " + ", " + localStorage.getItem("isGlutenFree");
    } else {
        searchCuisine = localStorage.getItem("searchCuisine");
    }
    restaurantPrice = localStorage.getItem("restaurantPrice");
    restaurantRating = localStorage.getItem("restaurantRating");
    searchCity = localStorage.getItem("searchCity");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchCuisine + "&location=" + searchCity + "$price=" + restaurantPrice + "&rating=" + restaurantRating + "&limit=3",
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
        $("#restaurants-container").empty();
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

            let imageDiv = $("<div>").addClass("restaurant m-2 p-1 card col-3 animated slideInUp").attr("id", "restaurant_" + i);
            let restaurantImage = $("<img>").attr("src", businessImage).attr("style", 'width: 100%;height:auto;overflow:auto;').addClass("card-top-img restaurant-img");
            let cardBlock = $("<div>").addClass("card-block")
            let restaurantName = $("<h4>").text(businessName).addClass("restaurant-name p-2");
            let restaurantRating = $("<li>").text("Rating: " + businessRating).addClass("restaurant-rating p-2");
            let restaurantPrice = $("<li>").text("Price: " + businessPrice).addClass("restaurant-price p-2");
            let restaurantReviewCount = $("<li>").text("Number of Reviews: " + businessReviewCount).addClass("restaurant-review-count p-2");
            let restaurantPhone = $("<li>").text("Phone Number: " + businessPhone).addClass("restaurant-phone p-2");
            let restaurantAddress = $("<li>").text("Address: " + businessAddress).addClass("restaurant-address p-2");
            let restaurantCity = $("<li>").text(businessCity).addClass("restaurant-city p-2");
            // adds a favorite button to each card. perhaps add to the top right corner of the card
            let favoriteBtn = $("<button>").addClass("favoriteRestaurants align-self-end").attr("id", i).text("Add to Favorites");

            imageDiv.append(restaurantImage).append(cardBlock).append(restaurantName).append(restaurantRating).append(restaurantReviewCount).append(restaurantPrice).append(restaurantPhone).append(restaurantAddress).append(restaurantCity).append(favoriteBtn);
            $("#restaurants-container").append(imageDiv);
        }
    });
};

// eatin.html filters below
let recipePrep;
let recipeCalories;
let healthLabel;

$("#recipe-cuisine").on("change", function () {
    searchCuisine = this.value;
    return searchCuisine;
});

$("#recipe-prep-time").on("change", function () {
    recipePrep = this.value;
    return recipePrep;
});

$("#recipe-calories").on("change", function () {
    recipeCalories = this.value;
    return recipeCalories;
});

$("#vegetarian-check").on("change", function () {
    isVegetarian = this.value;
    console.log("Is Veggie?" + isVegetarian);
    return isVegetarian;
});

$("#vegan-check").on("change", function () {
    isVegan = this.value;
    console.log("Is Vegan?" + isVegan);
    return isVegan;
});

$("#gluten-free-check").on("change", function () {
    isGlutenFree = this.value;
    console.log("Is GF?" + isGlutenFree);
    return isGlutenFree;
});

// submit button for eatin.html, at least cuisine, prep, and calories need to be truthy
$("#submit-recipe-filters").on("click", function () {
    if (searchCuisine & recipePrep & recipeCalories || isVegetarian || isVegan || isGlutenFree) {
        console.log(searchCuisine);
        console.log(recipePrep);
        console.log(recipeCalories);
        console.log(isVegetarian);
        console.log(isVegan);
        console.log(isGlutenFree);
        // set variables to local storage
        localStorage.setItem("searchCuisine", searchCuisine);
        localStorage.setItem("recipePrep", recipePrep);
        localStorage.setItem("recipeCalories", recipeCalories);
        localStorage.setItem("isVegetarian", isVegetarian);
        localStorage.setItem("isVegan", isVegan);
        localStorage.setItem("isGlutenFree", isGlutenFree);

        $("#recipe-cuisine").val("");
        $("#recipe-prep-time").val("");
        $("#recipe-calories").val("");
        $("#vegetarian-check").prop("checked", false);
        $("#vegan-check").prop("checked", false);
        $("#gluten-free-check").prop("checked", false);

        displayRecipes();
    } else {
        alert("You must at least select Cuisine, Prep time, and Calories");
    }
});

// API Calls
// function to call Edamam API, call is on eatin.html
function displayRecipes() {

    // retrieve from local storage
    searchCity = localStorage.getItem("searchCity");
    let rand = Math.floor(Math.random() * 50);
    let otherRand = rand + 3;

    searchCuisine = localStorage.getItem("searchCuisine") || "";
    console.log(searchCuisine);
    recipePrep = localStorage.getItem("recipePrep") || "";
    recipeCalories = localStorage.getItem("recipeCalories") || "";
    if (isVegetarian || isVegan || isGlutenFree) {
        healthLabel = (localStorage.getItem("isVegetarian") || "") + (localStorage.getItem("isVegan") || "") + (localStorage.getItem("isGlutenFree") || "");
        console.log("HealthLabel: " + healthLabel);
    }

    // run displayRecipes function
    let search = {
        searchCuisine: searchCuisine,
        recipeCalories: recipeCalories,
        recipePrep: recipePrep,
        healthLabel: healthLabel,
    }

    //for API call
    let queryURL = `https://api.edamam.com/search?q=${search.searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&calories=${search.recipeCalories}&time=${search.recipePrep}&healthLabels=${search.healthLabel}`;
    // note: calories returned in JSON response is yield, need to divide by yield: to get calories per serving - for future calculation calories / yield of the recipe

    console.log(queryURL)

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
            let recipeLink = response.hits[i].recipe.url;
            // console.log(image);
            // console.log(label);
            let imageDiv = $("<div>").addClass("card recipe-pictures m-2 p-1 col-3 animated slideInUp").attr("id", "recipe_" + i);
            let recipeImage = $("<img>").addClass("card-top-img").attr("src", image).attr("style", 'width: 100%;height:auto;overflow:auto;');

            let cardBlock = $("<div>").addClass("card-block")
            let recipeLabel = $("<h4>").text(label).addClass("card-title recipe-label p-2").attr("style", 'overflow:hidden;text-overflow: ellipsis;')
            let favoriteBtn = $("<button>").addClass("favoriteRecipes align-self-end").attr("id", i).text("Add to Favorites");

            imageDiv.append(favoriteBtn).append(recipeImage).append(cardBlock).append(recipeLabel).append(favoriteBtn);

            $("#recipes-container").append(imageDiv);
            $(".card-title").wrap($("<a>").attr("href", recipeLink)).attr("style", 'text-decoration: none;color:black;overflow: hidden;text-overflow: ellipsis;');
        }
    });
};

// new displayRecipes function - only works with local storage and renders old card look - need to update

// enables all favorite buttons to be clicked
// currently only applicable to restaurants
$(document).on("click", ".favoriteRestaurants", function () {

    console.log("clicked favorite");
    // get the id of the button first to know which card was favorited
    let num = this.id;

    // grab all the information from cards
    let placeImg = $(`#restaurant_${num} > .restaurant-img`).attr("src");
    let placeName = $(`#restaurant_${num} > .restaurant-name`).text();
    let placeRating = $(`#restaurant_${num} > .restaurant-rating`).text();
    let placePrice = $(`#restaurant_${num} > .restaurant-price`).text();
    let placeReviewCnt = $(`#restaurant_${num} > .restaurant-review-count`).text();
    let placePhone = $(`#restaurant_${num} > .restaurant-phone`).text();
    let placeAddress = $(`#restaurant_${num} > .restaurant-address`).text();
    let placeCity = $(`#restaurant_${num} > .restaurant-city`).text();

    // first grab the already existing favorite restaurants from firebase
    // this uid should be firebase.auth().currentUser.uid if not replace it
    database.ref(uid).once("value").then(function (snapshot) {
        // this should update the empty arr in js with 
        restaurantArr = JSON.parse(snapshot.val().favRestaurants);
    });

    // store the information in an array
    restaurantArr.push({
        image: placeImg,
        name: placeName,
        rating: placeRating,
        price: placePrice,
        reviewCount: placeReviewCnt,
        phone: placePhone,
        address: placeAddress,
        city: placeCity
    });

    console.log(restaurantArr);
    // stringify the array
    let stringedArr = JSON.stringify(restaurantArr);
    console.log(stringedArr);

    // update the array in firebase data 
    database.ref(uid).update({ favRestaurants: stringedArr });

})




