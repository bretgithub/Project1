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

    // grabs values from emojis and city and stores them in variables to pass into API call
    $(".radio").on("click", function () {
        searchName = this.value;
        return searchName;
    });

    // "change" fires for iunput, select, textarea - need blank city to force a change to grab value for city
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

// function for login info submit button

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

// sign up button function
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

    firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword)
    // catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // ...


    $("#userEmail").val("");
    $("#userPassword").val("");

    // checking for if user logged into firebase 
    var user = firebase.auth().currentUser;
    if (user) {
        alert("you're logged in")
    }
    else
        alert("login failed")

    // TODO add logic to only hide modal after succesful login/sign up
    $("#login-modal").modal("hide");


});


// Sign in button function
$("#login-button").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var loginEmail = $("#userEmail").val().trim();
    var loginPassword = $("#userPassword").val().trim();

    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)


    // // Clears it out
    $("#userEmail").val("");
    $("#userPassword").val("");

    // TODO set up with promise and then display message in navbar if user is logged in
    // checking for if user logged into firebase 
    var user = firebase.auth().currentUser;
    if (user) {
        alert("you're logged in")
    }
    else
        alert("login failed")


    // TODO add logic to only hide modal after succesful login/sign up
    $("#login-modal").modal("hide");
});

$("#logout-button").on("click", function (event) {
    event.preventDefault();

    //   use Firebase function to add userEmail/password combo

    firebase.auth().signOut();
});


// function to call Edamam API, call is on eatin.html
function displayRecipes() {

    // retrieve from local storage
    searchName = localStorage.getItem("searchName");
    searchCity = localStorage.getItem("searchCity");


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



// run displayRecipes function
let search = {
    name: searchName,
    calories: "1000-1200",
    health: "alcohol-free",
}

let queryURL = `https://api.edamam.com/search?q=${search.name}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=${search.calories}&health=${search.health}`

// plug in URL and modify the search terms like comfort food or calories to validate response in browser
// https://api.edamam.com/search?q=comfort+foodapp_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=591-722&health=alcohol-free 


// calories returned in JSON response is yield, need to divide by yield: to get calories per serving - for future calculation calories / yield of the recipe


$.ajax({
    url: queryURL,
    method: "GET"
}).done(function (response) {
    console.log(response);
    $("#recipes").empty();

    for (let i = 0; i < response.hits.length; i++) {
        let image = response.hits[i].recipe.image;
        let label = response.hits[i].recipe.label;
        console.log(image);
        console.log(label);

        let imageDiv = $("<div>").addClass("recipe-pictures m-2");
        let recipeImage = $("<img>").attr("src", image);

        let recipeLabel = $("<p>").text(label).addClass("recipe-label p-2");

        imageDiv.append(recipeImage).append(recipeLabel);


        $("#recipes").append(imageDiv);
    }
});
};