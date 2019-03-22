"use strict";

// initialize Firebase
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
let login = false;
let restaurantArr = []; // here is where we'll store the info of favorited restaurants
let recipeArr = []; // here is where we'll store the info of favorited recipes
let restaurantPrice;
let restaurantRating;
let isVegetarian = "";
let isVegan = "";
let isGlutenFree = "";
let tempArr = [];
let dietaryArray = [];
let recipePrep;
let recipeCalories;
let checkedValue;

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
    // when User is logged in allow the user to change 
    if (user) {
        // user is signed in.
        email = user.email;
        // set login to true
        login = true;
        uid = user.uid;  // the user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        console.log(email, uid);
        console.log("you're logged in", login);
        // store user's email and user ID in firebase database
        // using user ID as key to store all necessary information in that key
        database.ref(uid).update({
            email: email
        });
        localStorage.setItem("seshID", uid);

        // hide the login modal
        $("#modal-button").hide();

        // show account info/setting dropdown in Navbar if logged in
        $("#account").text(email);
        $("#account").show();
    } else {
        // no user is signed in.
        login = false;
        console.log("No user signed in", login);
        $("#create-button").on("click", function (event) {
            event.preventDefault();
            // grabs user input
            var signUpEmail = $("#userEmail").val().trim();
            var signUpPassword = $("#userPassword").val().trim();

            // use Firebase function to add userEmail/password combo
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
    database.ref(localID).once("value").then(function (snapshot) {
        recipeArr = JSON.parse(snapshot.val().favRecipes);
        restaurantArr = JSON.parse(snapshot.val().favRestaurants);
        console.log(restaurantArr)
        $("#fav-rest-row").empty();
        $("#fav-recipe-row").empty();
        // populate restaurant-row in favorites page
        for (let i = 0; i < restaurantArr.length; i++) {
            let cardDiv = $("<div>").addClass("restaurant m-2 p-1 card col-md-3 animated flipInY text-center position-relative d-flex justify-contents-around pb-5").attr("id", "restaurant_" + i);
            let restaurantImage = $("<img>").attr("src", restaurantArr[i].image).attr("style", 'width: 100%;height:auto;overflow:auto;').addClass("card-top-img restaurant-img");
            let cardBlock = $("<div>").addClass("card-block")
            let restaurantName = $("<h4>").text(restaurantArr[i].name).addClass("restaurant-name p-2 mb-5");
            let restaurantRating = $("<li>").text("Rating: " + restaurantArr[i].rating).addClass("restaurant-rating p-2");
            let restaurantPrice = $("<li>").text("Price: " + restaurantArr[i].price).addClass("restaurant-price p-2");
            // instead of favorite button, add unfavorite button to remove selected from favorites
            let removeBtn = $("<button>").addClass("removeBtn m-1 btn btn-dark d-inline").attr("id", "restaurant_" + i).text("Remove").attr("style", "position:absolute; bottom:0px; right:auto; left:auto;");
            console.log(restaurantName);
            cardDiv.append(restaurantImage).append(cardBlock).append(restaurantName).append(removeBtn);
            $("#fav-rest-row").append(cardDiv);
        }

        // populate recipe-row in favorites page
        for (let i = 0; i < recipeArr.length; i++) {
            let imageDiv = $("<div>").addClass("card recipe-pictures m-2 p-1 col-md-3 animated flipInY text-center position-relative d-flex justify-contents-around pb-5");
            let recipeImage = $("<img>").addClass("card-top-img").attr("src", recipeArr[i].image).attr("style", 'width: 100%;height:auto;overflow:auto;');
            let cardBlock = $("<div>").addClass("card-block")
            let recipeLabel = $("<h6>").text(recipeArr[i].name).addClass("card-title recipe-label p-2 mb-5").attr("style", 'overflow:hidden;text-overflow: ellipsis;').attr("id", "card-title" + i);
            let removeBtn = $("<button>").addClass("removeBtn m-1 btn btn-dark d-inline").attr("id", "recipe_" + i).text("Remove").attr("style", "position:absolute; bottom:0px; right:auto; left:auto;");

            imageDiv.append(recipeImage).append(cardBlock).append(recipeLabel).append(removeBtn);

            $("#fav-recipe-row").append(imageDiv);
            $("#card-title" + i).wrap($("<a>").attr("href", recipeArr[i].url)).attr("style", 'text-decoration: none;color:black;overflow: hidden;text-overflow: ellipsis;');
        }
    });
}


// add listner to the removeBtn button
$(document).on("click", ".removeBtn", function (event) {
    // this should differentiate between restaurants and recipes
    let type = this.id.split("_")[0];
    // this should be the index of the array that we are removing from either restaurantArr or recipesArr
    let index = this.id.split("_"[1]);
    let localID = localStorage.getItem("seshID");
    // grabbing the arrays from firebase
    database.ref(localID).once("value").then(function (snapshot) {
        recipeArr = JSON.parse(snapshot.val().favRecipes);
        restaurantArr = JSON.parse(snapshot.val().favRestaurants);
    });
    if (type === "recipe") {
        // remove the selected favorite card from favorites
        recipeArr.splice(index, 1);
        // stringify the array
        let stringedArr = JSON.stringify(recipeArr);
        // update the array in firebase data 
        database.ref(localID).update({ favRecipes: stringedArr });
    } else if (type === "restaurant") {
        // remove the selected favorite card from favorites
        restaurantArr.splice(index, 1);
        // stringify the array
        let stringedArr = JSON.stringify(restaurantArr);
        // update the array in firebase data 
        database.ref(localID).update({ favRestaurants: stringedArr });
    }
    displayFavorites();
});

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
        $(".main-img").attr('style', 'display:block;')
        $("#eat-in-index").addClass("animated bounceInLeft")
        $("#eat-out-index").addClass("animated bounceInRight")
    }
});

// specific to eatout page, to change emojis and call the Yelp API
$("#save-button-restaurants").on("click", function () {
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
            $("#select-city").val("");
            displayRestaurants();
            dietaryArray = [];
            searchCuisine = null;
            searchCity = null;
            restaurantPrice = null
            restaurantRating = null;
            localStorage.clear();
        });
        // hide modal
        $("#exampleModalCenter").modal("hide");
    }
});

// specific to eatin page, to change emojis and call the Edamam API
$("#save-button-recipes").on("click", function () {
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
            $("#select-city").val("");
            displayRecipes();
            dietaryArray = [];
            searchCuisine = null;
            searchCity = null;
            restaurantPrice = null
            restaurantRating = null;
            localStorage.clear();
        });
        // hide modal
        $("#exampleModalCenter").modal("hide");
    }
});

// load modal on button click 
$("#modal-button").on("click", function () {
    $("#login-modal").modal("show");
});

// create an account
$("#create-button").on("click", function (event) {
    event.preventDefault();
    // grabs user input
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
});

// login function
$("#login-button").on("click", function (event) {
    event.preventDefault();
    // grabs user input
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
});

// hides the account info dropdown
$("#account").hide();

// logout button
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
    $(this).removeClass("btn-dark").addClass("btn-light").attr("disabled", true);
});

// for custom API calls on eatin.html and eatout.html
// eatout.html filters below

// cuisine value
$("#restaurant-cuisine").on("change", function () {
    searchCuisine = this.value;
    console.log("cuisine: " + searchCuisine);
    return searchCuisine;
});

// city
$("#restaurant-city").on("change", function () {
    searchCity = this.value;
    console.log("city" + searchCity);
    return searchCity;
});

// restaurant price range
$("#restaurant-price").on("change", function () {
    restaurantPrice = this.value;
    console.log("price: " + restaurantPrice);
    return restaurantPrice;
});

// restaurant rating
$("#restaurant-rating").on("change", function () {
    restaurantRating = this.value;
    console.log("rating" + restaurantRating);
    return restaurantRating;
});

// dietary check - also shared with eatin.html 
$(".dietary").click(function () {
    tempArr = dietaryArray;
    checkedValue = $(this).val();
    if ($(this).prop("checked")) {
        dietaryArray.push(checkedValue);
        tempArr = dietaryArray;
    } else {
        $.each(dietaryArray, function (i) {
            if (tempArr[i] === checkedValue) {
                tempArr.splice(i, 1);
            }
        });
        dietaryArray = tempArr;
    }

    let checkboxValue = "";
    $.each(dietaryArray, function (i) {
        if (checkboxValue === "") {
            checkboxValue = dietaryArray[i];
        } else {
            checkboxValue = checkboxValue + "," + dietaryArray[i];
        }
    });
    console.log(checkboxValue);
});

// eatout.html submit button to capture values
$("#submit-restaurant-filters").on("click", function () {
    if ((searchCuisine && searchCity) && (restaurantPrice || restaurantRating || dietaryArray)) {
        console.log(searchCuisine);
        console.log(searchCity);
        console.log(restaurantPrice);
        console.log(restaurantRating);
        console.log(dietaryArray);
        // set variables to local storage
        localStorage.setItem("searchCuisine", searchCuisine);
        localStorage.setItem("searchCity", searchCity);
        localStorage.setItem("restaurantPrice", restaurantPrice);
        localStorage.setItem("restaurantRating", restaurantRating);
        localStorage.setItem("dietaryPreferences", dietaryArray);

        // clear values
        $("#restaurant-cuisine").val("");
        $("#restaurant-price").val("");
        $("#restaurant-rating").val("");
        $("#restaurant-city").val("");
        $(".dietary").prop("checked", false);

        // function to run API call
        displayRestaurants();

        // clear variables and localStorage
        dietaryArray = [];
        searchCuisine = null;
        searchCity = null;
        restaurantPrice = null
        restaurantRating = null;
        localStorage.clear();
    } else {
        alert("You must at least select a Cuisine and City");
    }
});

// Yelp API call
function displayRestaurants() {
    // if cuisine, city, and dietary array are selected, return custom url for API call
    if (searchCuisine && searchCity && dietaryArray) {
        searchCuisine = localStorage.getItem("searchCuisine");
        searchCity = localStorage.getItem("searchCity");
        dietaryArray = localStorage.getItem("dietaryPreferences");
        searchCuisine = searchCuisine + "," + dietaryArray;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchCuisine + "&location=" + searchCity + "&limit=3",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
                "cache-control": "no-cache",
            }
        }
    } else {
        // return custom url for API call 
        searchCuisine = localStorage.getItem("searchCuisine");
        searchCity = localStorage.getItem("searchCity");
        restaurantPrice = localStorage.getItem("restaurantPrice");
        restaurantRating = localStorage.getItem("restaurantRating");
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchCuisine + "&location=" + searchCity + "$price=" + restaurantPrice + "&rating=" + restaurantRating + "&limit=3",
            "method": "GET",
            "headers": {
                "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
                "cache-control": "no-cache",
            }
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#restaurants-container").empty();
        // grab values from API call
        for (let i = 0; i < response.businesses.length; i++) {
            let businessName = response.businesses[i].name;
            let businessImage = response.businesses[i].image_url;
            let businessRating = response.businesses[i].rating;
            let businessPrice = response.businesses[i].price;
            let businessURL = response.businesses[i].url
            // customize results 
            let imageDiv = $("<div>").addClass("position-relative restaurant m-2 p-1 card col-md-3 animated slideInUp pb-5").attr("id", "restaurant_" + i);
            let restaurantImage = $("<img>").attr("src", businessImage).attr("style", 'width: 100%;height:auto;overflow:auto;').addClass("card-top-img restaurant-img");
            let cardBlock = $("<div>").addClass("card-block")
            let restaurantName = $("<h4>").text(businessName).addClass("card-title restaurant-name p-2").attr("id", "card-title"+i);
            let restaurantRating = $("<li>").text("Rating: " + businessRating).addClass("restaurant-rating p-2 text-light");
            let restaurantPrice = $("<li>").text("Price: " + businessPrice).addClass("restaurant-price p-2 text-light mb-5");
            // adds a favorite button to each card. perhaps add to the top right corner of the card
            let favoriteBtn = $("<button>").addClass("favoriteRestaurants align-self-end btn btn-dark").attr("id", i).text("Add to Favorites").attr("disable", false).attr("style", "position:absolute; bottom:10px; right:auto; left:auto;");

            // only append favorite button if user is logged in
            if (login) {
                imageDiv.append(restaurantImage).append(cardBlock).append(restaurantName).append(restaurantRating).append(restaurantPrice).append(favoriteBtn);
            } else {
                imageDiv.append(restaurantImage).append(cardBlock).append(restaurantName).append(restaurantRating).append(restaurantPrice);
            }
            // display in container and wrap link to open URL
            $("#restaurants-container").append(imageDiv);
            $("#card-title"+i).wrap($("<a>").attr("href", businessURL)).attr("style", 'text-decoration: none;color:white;overflow: hidden;text-overflow: ellipsis;');
        }
    });
};

// eatin.html filters below - shares checbox filters above starting with "$(".dietary").click(function () {"

// cuisine
$("#recipe-cuisine").on("change", function () {
    searchCuisine = this.value;
    return searchCuisine;
});

// prep time
$("#recipe-prep-time").on("change", function () {
    recipePrep = this.value;
    return recipePrep;
});

// calorie range
$("#recipe-calories").on("change", function () {
    recipeCalories = this.value;
    return recipeCalories;
});

// submit button for eatin.html, at least cuisine must be selected
$("#submit-recipe-filters").on("click", function () {
    if ((searchCuisine) && (recipePrep || recipeCalories || dietaryArray)) {
        console.log(searchCuisine);
        console.log(recipePrep);
        console.log(recipeCalories);
        console.log(dietaryArray);

        // set variables to local storage
        localStorage.setItem("searchCuisine", searchCuisine);
        localStorage.setItem("recipePrep", recipePrep);
        localStorage.setItem("recipeCalories", recipeCalories);
        localStorage.setItem("dietaryPreferences", dietaryArray);

        // clear values
        $("#recipe-cuisine").val("");
        $("#recipe-prep-time").val("");
        $("#recipe-calories").val("");
        $(".dietary").prop("checked", false);

        // function to run API call
        displayRecipes();
        // clear variables and localStorage
        dietaryArray = [];
        searchCuisine = null;
        recipePrep = null
        recipeCalories = null;
        localStorage.clear();
    } else {
        alert("You must at least select a Cuisine");
    }
});

// function to call Edamam API
function displayRecipes() {

    // retrieve from local storage
    let rand = Math.floor(Math.random() * 50);
    let otherRand = rand + 3;
    let queryURL;
    searchCuisine = localStorage.getItem("searchCuisine");

    // cases for cuisine, prep, calories, and dietary restrictions are applied to queryURL
    if (recipePrep && recipeCalories && dietaryArray) {
        recipePrep = localStorage.getItem("recipePrep");
        recipeCalories = localStorage.getItem("recipeCalories");
        dietaryArray = localStorage.getItem("dietaryPreferences");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&time=${recipePrep}&calories=${recipeCalories}&healthLabel=${dietaryArray}`;

        // case for cusiine, prep, and calories selected
    } else if (recipePrep && recipeCalories) {
        recipePrep = localStorage.getItem("recipePrep");
        recipeCalories = localStorage.getItem("recipeCalories");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&time=${recipePrep}}&calories=${recipeCalories}`;

        // case for cusiine, prep, and dietary restrictions selected
    } else if (recipePrep && dietaryArray) {
        recipePrep = localStorage.getItem("recipePrep");
        dietaryArray = localStorage.getItem("dietaryPreferences");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&time=${recipePrep}&healthLabel=${dietaryArray}`;

        // case for cusiine, calories, and dietary restrictions selected
    } else if (recipeCalories && dietaryArray) {
        recipeCalories = localStorage.getItem("recipeCalories");
        dietaryArray = localStorage.getItem("dietaryPreferences");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&calories=${recipeCalories}&healthLabel=${dietaryArray}`;

        //case for cusiine and prep selected
    } else if (recipePrep) {
        recipePrep = localStorage.getItem("recipePrep");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&time=${recipePrep}&from=${rand}&to=${otherRand}`;

        // case for cuisine and calories
    } else if (recipeCalories) {
        recipePrep = localStorage.getItem("recipeCalories");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&calories=${recipeCalories}`;

        // case for cuisine and dietary array
    } else if (dietaryArray) {
        recipePrep = localStorage.getItem("dietaryPreferences");
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}&healthLabel=${dietaryArray}`;

    } else {
        //case for only cuisine
        queryURL = `https://api.edamam.com/search?q=${searchCuisine}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=${rand}&to=${otherRand}`;
    }
    console.log("QUERY URL: " + queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        $("#recipes-container").empty();

        // grab values from API call
        for (let i = 0; i < response.hits.length; i++) {
            let image = response.hits[i].recipe.image;
            let label = response.hits[i].recipe.label;
            let recipeLink = response.hits[i].recipe.url;
            let recipePrepTime = response.hits[i].recipe.totalTime;
            let totalCalories = response.hits[i].recipe.calories;
            let totalYield = response.hits[i].recipe.yield;
            let caloriesPerServing = Math.floor(totalCalories / totalYield);
            let imageDiv = $("<div>").addClass("card recipe-pictures m-2 p-1 col-md-3 animated slideInUp pb-5").attr("id", "recipe_" + i);
            let recipeImage = $("<img>").addClass("card-top-img").attr("src", image).attr("style", 'width: 100%;height:auto;overflow:auto;');

            // customize results 
            let cardBlock = $("<div>").addClass("card-block position-relative").attr("id", "recipe_"+i);
            let recipeLabel = $("<h4>").text(label).addClass("card-title recipe-label p-2").attr("style", 'overflow:hidden;text-overflow: ellipsis;').attr("id", "card-title"+i)
            let prepTime = $("<li>").text("Prep time (in minutes): " + recipePrepTime).addClass("recipe-prep-time p-2 text-light");
            let calories = $("<li>").text("Calories per serving: " + caloriesPerServing).addClass("recipe-calories p-2 text-light mb-5");
            let favoriteBtn = $("<button>").addClass("favoriteRecipes align-self-end btn btn-dark").attr("id", i).text("Add to Favorites").attr("disable", false).attr("style", "position:absolute; bottom:10px; right:auto; left:auto;");
            // only append favorite button if user is logged in
            if (login) {
                imageDiv.append(favoriteBtn).append(recipeImage).append(cardBlock).append(recipeLabel).append(favoriteBtn);
            } else {
                imageDiv.append(recipeImage).append(cardBlock).append(recipeLabel).append(prepTime).append(calories);
            }

            // display in container and wrap link to open URL
            $("#recipes-container").append(imageDiv);
            $("#card-title"+i).wrap($("<a>").attr("href", recipeLink)).attr("style", 'text-decoration: none;color:white;overflow: hidden;text-overflow: ellipsis;');
        }
    });
};

// enables all favorite buttons to be clicked
// currently only applicable to restaurants
$(document).on("click", ".favoriteRestaurants", function () {
    // get the id of the button first to know which card was favorited
    let num = this.id;

    // grab all the information from cards
    let placeImg = $(`#restaurant_${num} > .restaurant-img`).attr("src");
    let placeName = $(`#restaurant_${num} .restaurant-name`).text();
    console.log(placeName);
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

    // stringify the array
    let stringedArr = JSON.stringify(restaurantArr);

    // update the array in firebase data 
    database.ref(uid).update({ favRestaurants: stringedArr });
    $(this).removeClass("btn-dark").addClass("btn-light").attr("disabled", true);
});




