const path = require('path');
const express = require('express');
const app = express();

var users = {};

var card = '';
var cards = [];

// Start the app by listening on the default
// Heroku port
const server = app.listen(process.env.PORT || 8080);
console.log('Server at localhost:8080');

// used for heroku deployment
// const io = require('socket.io')(require('https').Server(app));

// used for local deployment
const io = require('socket.io').listen(server);

const mongoClient = require('mongodb').MongoClient;
const mongoUri = process.env.MONGODB_URI;
// var cards = [];
// connect to db and set cards
mongoClient.connect(mongoUri, function (err, client) {
  if (err) {
    console.log('Error establishing database connection: ', err);
  } else {
    var db = client.db('');
    db.collection('cards').find({}).toArray(function (err, result) {
      if (err) {
        console.log('Error finding cards: ', err);
      } else {
        cards = result;
        setInterval(function () {
          getCard();
        }, 15000);
      }
    });
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', function () {
    if (socket.username) {
      delete users[socket.username];
      console.log(socket.username + ' disconnected');
    }
  });

  socket.on('login', function (username, callback) {
    var success;
    socket.username = username;
    if (socket.username in users) {
      success = false;
    } else {
      users[socket.username] = 0;
      success = true;
      console.log(socket.username + ' has connected.');
    }
    callback(success);
  });

  socket.on('guess', function (guess, callback) {
    var correct = false;
    console.log(socket.username + ' has guessed ' + guess);
    if (parseStrings(guess) === parseStrings(card.answer)) {
      socket.username += 1;
    }
    socket.emit('my other event', { my: 'data' });
    callback(correct);
  });
});

function parseStrings (str) {
  if (str) {
    str.replace('\\', '');
    str.replace('\'', '');
  }
  return str;
}
function getCard () {
  card = cards[Math.floor(Math.random() * (cards.length))];
}

// SSL for heroku deployment
// const forceSSL = function () {
//   return function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(['https://', req.get('Host'), req.url].join(''));
//     }
//     next();
//   };
// };

// SSL for heroku deployment
// app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(path.join(__dirname, '/dist')));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '/dist/index.html')));
});
