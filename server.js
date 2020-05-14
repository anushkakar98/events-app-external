'use strict';

console.log(`process.env.SERVER = ${process.env.SERVER}`);
// get the environment variable, but default to localhost:8082 if its not set
const SERVER = (process.env.SERVER ? process.env.SERVER : "http://localhost:8082")

// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

// express-handlebars is a templating library 
// https://www.npmjs.com/package/express-handlebars
// - look inside the views folder for the templates
// data is inserted into a template inside {{ }}
const hbs = require('express-handlebars');

// request is used to make REST calls to the backend microservice
// details here: https://www.npmjs.com/package/request
var request = require('request');

// create the server
const app = express();

// set up handlbars as the templating engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default'
}));

// set up the parser to get the contents of data from html forms 
// this would be used in a POST to the server as follows:
// app.post('/route', urlencodedParser, (req, res) => {}
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// defines a route that receives the request to /
app.get('/', (req, res) => {
    // make a request to the backend microservice using the request package
    // the URL for the backend service should be set in configuration 
    // using an environment variable. Here, the variable is passed 
    // to npm start inside package.json:
    //  "start": "SERVER=http://localhost:8082 node server.js",
    request.get(  // first argument: url + return format
        {
            url: SERVER + '/events',  // the microservice end point for events
            json: true  // response from server will be json format
        }, // second argument: function with three args,
        // runs when server response received
        // body hold the return from the server
        (error, response, body) => {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                res.render('error_message',
                    {
                        layout: 'default',  //the outer html page
                        error: error // pass the data from the server to the template
                    });
            }
            else {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log(body); // print the return from the server microservice
                res.render('home',
                    {
                        layout: 'default',  //the outer html page
                        template: 'index-template', // the partial view inserted into 
                        // {{body}} in the layout - the code
                        // in here inserts values from the JSON
                        // received from the server
                        events: body.events
                    }); // pass the data from the server to the template
            }
        });

});

app.get('/editEvent', (req, res) => {
    // make a request to the backend microservice using the request package
    // the URL for the backend service should be set in configuration 
    // using an environment variable. Here, the variable is passed 
    // to npm start inside package.json:
    //  "start": "SERVER=http://localhost:8082 node server.js",
    request.get(  // first argument: url + return format
        {
            url: SERVER + '/events',  // the microservice end point for events
            json: true  // response from server will be json format
        }, // second argument: function with three args,
        // runs when server response received
        // body hold the return from the server
        (error, response, body) => {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                res.render('error_message',
                    {
                        layout: 'default',  //the outer html page
                        error: error // pass the data from the server to the template
                    });
            }
            else {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log(body); // print the return from the server microservice
                res.render('editEvents',
                    {
                        layout: 'default',  //the outer html page
                        template: 'index-template', // the partial view inserted into 
                        // {{body}} in the layout - the code
                        // in here inserts values from the JSON
                        // received from the server
                        events: body.events
                    }); // pass the data from the server to the template
            }
        });

});


// defines a route that receives the post request to /event
app.post('/event',
    urlencodedParser, // second argument - how to parse the uploaded content
    // into req.body
    (req, res) => {
        // make a request to the backend microservice using the request package
        // the URL for the backend service should be set in configuration 
        // using an environment variable. Here, the variable is passed 
        // to npm start inside package.json:
        //  "start": "SERVER=http://localhost:8082 node server.js",
        request.post(  // first argument: url + data + formats
            {
                url: SERVER + '/event',  // the microservice end point for adding an event
                body: req.body,  // content of the form
                headers: { // uploading json
                    "Content-Type": "application/json"
                },
                json: true // response from server will be json format
            },
            (error, response, body) => {  // third argument: function with three args,
                // runs when server response received
                // body hold the return from the server
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log(body); // print the return from the server microservice
                res.redirect("/"); // redirect to the home page
            });

    });

    app.get('/event',
    urlencodedParser, // second argument - how to parse the uploaded content
    // into req.body
    (req, res) => {
        // make a request to the backend microservice using the request package
        // the URL for the backend service should be set in configuration 
        // using an environment variable. Here, the variable is passed 
        // to npm start inside package.json:
        //  "start": "SERVER=http://localhost:8082 node server.js",
        request.delete(  // first argument: url + data + formats
            {
                url: SERVER + '/event',  // the microservice end point for adding an event
                body: req.body,  // content of the form
                headers: { // uploading json
                    "Content-Type": "application/json"
                },
                json: true // response from server will be json format
            },
            (error, response, body) => {  // third argument: function with three args,
                // runs when server response received
                // body hold the return from the server
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log(body); // print the return from the server microservice
                res.redirect("/"); // redirect to the home page
            });

    });

// create other get and post methods here - version, login,  etc

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

var firebaseConfig = {
    apiKey: "AIzaSyB-xWJfvxxY-OCCnItmF3LjF43nTDZBCQA",
    authDomain: "dtc-attendee-206.firebaseapp.com",
    databaseURL: "https://dtc-attendee-206.firebaseio.com",
    projectId: "dtc-attendee-206",
    storageBucket: "dtc-attendee-206.appspot.com",
    messagingSenderId: "1089139767174",
    appId: "1:1089139767174:web:ba8b31b4a9ee862b10de07"
  };
  
  

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
// Build Firebase credential with the Google ID token.
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

// Sign in with credential from the Google user.
    firebase.auth().signInWithCredential(credential).catch(function(error)
    {
  // Handle Errors here.
        var errorCode = error.code;
         var errorMessage = error.message;
  // The email of the user's account used.
        var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
  // ...
    })
};

  





// generic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// specify the port and start listening
const PORT = 8080;
const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;