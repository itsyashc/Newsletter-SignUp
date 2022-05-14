const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const res = require("express/lib/response");

const https = require("https");

//to change path for statics files.
const path = require("path");
const publicPath = path.join(__dirname, "public");

app.use(express.static("public"));

// Main req and res.

// To send first file to client'
app.get("/", (req, res) => {
  res.sendFile(publicPath + "/html/signup.html");
});

// To get sign up data from client.
app.post("/", (req, res) => {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const Email = req.body.emailAddress;

  const data = {
    members: [
      {
        // batch sub or unsub in mailchamp documentation
        //they are the predifined in mailchamp to store data.
        email_address: Email,
        status: "subscribed",

        // its merge the first and last name, its also a predifined method of mailchamp
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data); //it will convert the data in Json string

  //To send data to mailchimp api.
  const url = "https://us18.api.mailchimp.com/3.0/lists/3d96ea7587";
  const options = {
    method: "POST",
    auth: "ityashc:8318556dcf35cfc54aa61f16886d3ecc-us18",
  };

  // To send back the response to the client.
  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(publicPath + "/html/success.html");
    } else {
      res.sendFile(publicPath + "/html/failure.html");
    }
    response.on("data", function (data) {
        console.log(JSON.parse(data));
      });
  });

  request.write(jsonData);
  request.end();
});

//to redirect from failure page 'try again button' to home route.
app.post("/failure.html", (req, res) =>{
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});

// Mailchamp api key
// 8318556dcf35cfc54aa61f16886d3ecc-us18

// list/audience id
// 3d96ea7587
