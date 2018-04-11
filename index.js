const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')(require('https').Server(app));
const assert = require('assert');
const mongoClient = require('mongodb').MongoClient;
const mongoUri = process.env.MONGODB_URI;
var cards;

//connect to db and set cards
mongoClient.connect(mongoUri, function (err, client) {
  if(err){
    console.log('Error establishing database connection: ', err);
  } else{
    var db = client.db('');
    db.collection('cards').find({}).toArray(function(err, result){
      if(err){
        console.log('Error finding cards: ', err);
      } else{
        cards = result;
      }
    });
  }
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('login', function(username, callback){
    console.log(username + ' has connected.');
    callback(true);
  });
});


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
