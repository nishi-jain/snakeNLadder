var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/game-board', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/views/game-board.html'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/views/index.html'));
})

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Game running on port ' + port);
});