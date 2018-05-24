const path = require('path');
const express = require('express');
const app = express();

var users = [];
var disabledGuessers = [];

var card = {};
var cards = [];

// will prevent users from guessing while cards answer is revealed
var acceptGuess = false;

// time to guess in ms
var guessTime = 10000;

// time that answer is revealed in ms
var revealTime = 5000;

// vars storing and controlling the countdown timer
var time = guessTime / 1000;
// var countdown;

// Start the app by listening on the default Heroku port or set environment variable port
const server = app.listen(process.env.PORT || 8080);
const io = require('socket.io').listen(server);

console.log('Server at localhost:' + process.env.PORT || 8080);

const mongoClient = require('mongodb').MongoClient;
const mongoUri = process.env.MONGODB_URI;

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
        console.log('Connected to MongoDB and saved cards.');
        cards = result;
        startTimer();
        getCard();
      }
    });
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', function () {
    if (socket.username) {
      removeUser(socket.username);
      console.log(socket.username + ' has disconnected.');
    }
  });

  socket.on('login', function (username, callback) {
    var success;
    socket.username = username;
    if (usernameTaken(socket.username)) {
      success = false;
    } else {
      users.push({username: socket.username, score: 0});
      success = true;
      console.log(socket.username + ' has connected.');
      io.sockets.emit('onUsers', sortedUsers());
    }
    callback(success);
  });

  socket.on('getCurrentCard', function (callback) {
    var callbackCard = {answer: card.answer, question: card.question};
    if (acceptGuess) callbackCard.answer = '';
    callback(callbackCard);
  });

  socket.on('getCurrentUsers', function (callback) {
    callback(sortedUsers());
  });

  socket.on('guess', function (guess, callback) {
    var result = {'correct': false, 'alert': 'Your guess was incorrect. :('};
    if (acceptGuess && disabledGuessers.indexOf(socket.username) === -1) {
      console.log(socket.username + ' has guessed ' + guess + '.');
      if (parseStrings(guess) === parseStrings(card.answer)) {
        result = {'correct': true, 'alert': 'Your guess was correct! You have recieved ' + addScore(socket.username) + ' points.'};
      }
    } else if (!acceptGuess) {
      result = {'correct': false, 'alert': 'You cannot guess the card while it is flipped.'};
    } else {
      result = {'correct': true, 'alert': 'You have already correctly guessed the card. Please wait for the next card to guess again.'};
    }
    callback(result);
  });
});

function parseStrings (str) {
  if (str) str = str.replace(/\.|'|\s|\?/g, '').toLowerCase();
  return str;
}

function getCard () {
  time = guessTime / 1000;
  io.sockets.emit('onTimer', time);
  disabledGuessers = [];
  acceptGuess = true;
  card = cards[Math.floor(Math.random() * (cards.length))];
  io.sockets.emit('onCard', {answer: '', question: card.question});
  setTimeout(function () {
    flipCard();
  }, guessTime);
}

function flipCard () {
  time = revealTime / 1000;
  io.sockets.emit('onTimer', time);
  acceptGuess = false;
  io.sockets.emit('onCard', {answer: card.answer, question: card.question});
  setTimeout(function () {
    getCard();
  }, revealTime);
}

function startTimer () {
  setInterval(function () {
    time--;
  }, 1000);
  setInterval(function () {
    io.sockets.emit('onTimer', time);
  }, 250);
}

function addScore (username) {
  var points = Math.ceil((time / (guessTime / 1000)) * 3);
  console.log('Adding ' + points + ' to ' + username);
  for (var i = 0; i < users.length; i++) {
    if (username === users[i].username) users[i].score += points;
  }
  disabledGuessers.push(username);
  io.sockets.emit('onUsers', sortedUsers());
  return points;
}

function sortedUsers () {
  return users.sort(function (a, b) {
    return b.score - a.score;
  });
}

function removeUser (username) {
  for (var i = 0; i < users.length; i++) {
    if (username === users[i].username) users.splice(i, 1);
  }
  io.sockets.emit('onUsers', sortedUsers());
}

function usernameTaken (username) {
  for (var i = 0; i < users.length; i++) {
    if (username === users[i].username) return true;
  }
  return false;
}

// SSL for heroku deployment
const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  };
};

// SSL for heroku deployment
app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(path.join(__dirname, '/dist')));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '/dist/index.html')));
});
