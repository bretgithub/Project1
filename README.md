# Project1 APIs

## Outline
Our first project was to use two APIs and display data in a meaningful way to solve a problem. The assignment also required us to use a CSS library we had not used before, Bootstrap JS, and have a repeating element like a table or cards. 

## Use Case
Our team decided to solve the problem of not knowing whether to eat out or cook at home. People have too many options at their fingertips and quickly run into a core principle outlined in The Paradox of Choice, spending too much time with too much information and therefoe either not making a decision at all or not making the best decision with given information. 

We went with the idea of creating a platform that gave the user a small subset of what is available given their search parameters for eating in or eating out and the ability to bring more options in if they were not satisfied with the initial results but keeping it to an easy to digest number of 3 resuts at a time. 

Given this model we were able to then expand on what was important to the user in each case, eating in or eating out, and display only necesary information, allowing the user to make the best possible decision and without exerting too much energy in choosing from a long list. 

We also wanted to provide a space for users to create accounts and store their data, when logged in, the user would have the added ability to select favorites and view them on a favorites page.

## APIs and Library
The APIs we used were:
Yelp, for restaurants, our eating out use case
Edamam, for recipes, our eating in use case
Animate JS for our additional library creating cards and on our landing page

## Databases
We utilized Firebase for our cloud serve storage and authentication for account creation and local storage for users that were not logged in.

## Design
We wanted to keep the distractions and noise that the user experienced on our platform to a minimum. The user would easily flow through the page to their desired result as follows:

Landing page to capture cuisine and city
Choose whether they eat in or eat out
On either page, results are displayed and the user can customize their search further or re-roll and get new results

If the user wanted to create an account, they could then add favorites, and view a favorites page

We went through a few iterations with our design, deciding on a clean full page image for the landing page and simple background and dynamically created cards on each of the subsequent pages with muted colors that carried a minimalist and coherent theme throughout the app.

## Roadmap
While we added everything from our must haves and extra styling we wanted to further develop the user stories and add the functionality outlined below:

Eat Out:
Hover over results and display more information about the restaurant
Ability to reserve a table from our page
On mobile, be able to call the restaurant from our page 
Add notes from favorites page

Eat In:
Hover over results to display more information about the recipe
Ability to take notes on the recipe
Select ingredients that you have already and create a list of recipes based on your inventory

Site-wide:
Keep the user on our platform, currently they are directed to the recipe or restaurant, we want to have them contained to our page and a modal pop up with the relevant information for the user whether checking a recipe or booking a reservation


