//Loading module from express
const express = require("express");

// npm library use to process data sent through http request
const bodyParser = require("body-parser");

// include http built in module
const https = require("https");

// create application using express
const app = express();

// use static files such as css files in the application
app.use(express.static("public"));

//transforms the url encoded request to JS accessible requests
app.use(bodyParser.urlencoded({extended: true}));

// retrieve the data from html file
app.get("/", function(req, res){
   res.sendFile(__dirname +"/signup.html");
});

// send the data to the server using POST http request
app.post("/", function(req, res){

    //collect the data from the form and store them in different variables
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailid = req.body.email;

    //change the data to the JSON format matching to the MAILCHIMP api
    const data = {
        members:[
            {
                email_address : emailid,
                status : "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName

                }
            }
        ]
    };

    //When sending data to a web server, the data has to be a string
    // Convert a JavaScript object into a string with JSON.stringify()
    const jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/07f5dff4f5";
    const options ={
        method :"POST",
        //API key id for Authentication
        auth: "mahaveer1:7338743fc8316aa7c7e31f09f7493f2e-us20"

    }

    // send the data to the server and display accordingly
    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+ "/success.html");
        }
        else{
            res.send(__dirname+"/failure.html");
        }

        //The 'on' method attaches an event listener (a function) for a certain event
        response.on("data", function(data){
           console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();
    
    
});

// if the request for given path is made then redirect the page to another url
app.post("/failure", function(req, res){
    res.redirect("/");
});

//used to bind and listen the connections on the specified host and port
app.listen(process.env.PORT || 3000, function( ){
    console.log("Server is Running Mst");
});

// API Key id - 7338743fc8316aa7c7e31f09f7493f2e-us20
//List id - 07f5dff4f5