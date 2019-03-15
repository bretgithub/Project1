"use strict";
// loads on load
$(document).ready(function () {

    function displayRecipes() {

        // let recipes = $(this).attr("data-name");

        let queryURL = "https://api.edamam.com/search?q=chicken&app_id=879f0751&app_key=35a16e4121fe17352894abf6ad14d421&from=0&to=3&calories=591-722&health=alcohol-free"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            let results = response.data;
            console.log(results);
        });
    };
    displayRecipes();
});

