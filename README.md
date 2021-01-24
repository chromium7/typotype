# Typo Type

#### Video Demo:

#### Description:

A web app built using python's Django framework, with Scss and Bootstrap for styling the page. Sqlite3 is used as the database and JavaScript is used for interactivity with the site and also for making AJAX requests to the server using Fetch API.

The essence of this web app is for the user to be able to practice the speed and accuracy of their typing skills through playing a game. By typing texts of different readability levels (concepts from pset2), user is given score based on the number of characters and the accuracy of the texts they type in a minute. User's activities will be tracked and shown in the web app by storing their data in SQlite and querying from the database. Users can compare the cumulative score they earned by practicing with the top 5 players in the website.

Admins on the other hand, is responsible for creating new texts for the game. The web app will detect whether the user is an admin or not, and if they are, the web page will show an input area for saving new texts.

#### File walkthrough

- game directory represents the main code of the web app. It includes both the frontend and backend of the site. Views.py handles the requests made to the site, the urls.py handle which addresses are accepted, models.py include the models for the tables in the SQlite database, forms.py include the form used in the HTML for sending POST request, admin.py registers the models so that they can be viewed in the admin page, and helpers.py include functions that makes querying easier.

- typotype directory includes the settings and configurations of the web app

- requirements.txt includes the python packages that are used in this web app
