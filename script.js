"use strict";

// loads modal on page load
$(window).on('load', function () {
    $('#exampleModalCenter').modal('show')
});

// global variables to be set when user selects values in modal
let searchName;
let searchCity;

// run after DOM loads
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
            $("#exampleModalCenter").modal("hide");
            // run displayRecipes function
            displayRecipes();
        }
    });

    // function to call Edamam API
    function displayRecipes() {

        let search = {
            name: searchName,
            calories: "1000-1200",
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
});

