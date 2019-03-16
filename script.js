"use strict";

// on window load show modal
$(window).on('load', function () {
    $('#exampleModalCenter').modal('show')
});

// grabs values from emojis and city and stores them in variables to pass into API call
// does not grab any value right now logs undefined
// $("#emoji-picker").on("click", function () {
//     var state = $("#form-check").val();
//     console.log(state);
// });

// loads on load
$(document).ready(function () {

    let search = {
        name: "comfort food",
        calories: "1000-1200",
        health: "alcohol-free",
    }

    function displayRecipes() {

        // let recipes = $(this).attr("data-name");

        // let search = "comfort food"
        let queryURL = `https://api.edamam.com/search?q=${search.name}&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=${search.calories}&health=${search.health}`

        // plug in URL and modify the search terms like comfort food or calories to validate response in browser
        // https://api.edamam.com/search?q=comfort+foodapp_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=591-722&health=alcohol-free 

        // calories returned in JSON response is yield, need to divide by yield: to get calories per serving - for future calculation calories / yield of the recipe

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            // let results = response.data;
            // console.log(results);

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
                // console.log(imageDiv);

            }
        });
    };
    displayRecipes();
});

