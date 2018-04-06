const path = require('path');
const express = require('express');
// var config = require('./config.json');
const app = express();
const io = require('socket.io')(http);
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGODB_URL;
var question, answer;

MongoClient.connect(mongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected to mongodb.");

  db.mycoll.aggregate({$sample: { size: 1 }}).toArray(function(err, results){
    console.log(results);
    db.close();
    console.log("Connection to database is closed.");
  });
  
  // db.collection('countries').find({},{"sort": [["area",-1]]}).limit(20).toArray(function(err, results){
  //   console.log("Country One " +JSON.stringify(results[0]));
  //   console.log("Name of Country Four " +results[3].name+ " and size: " +results[3].area);
  //
  //   db.close();
  //   console.log("Connection to database is closed.");
  // });

}) //connect()

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  };
};

// Instruct the app
// to use the forceSSL
// middleware

app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(path.join(__dirname, '/dist')));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '/dist/index.html')));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);
console.log('Server at localhost:8080');
// config.PARSE_ID = process.env.PARSE_ID;
// config.PARSE_URL = process.env.PARSE_URL;
// console.log(config.appId);
// console.log(process.env.ENV_VARIABLE);
