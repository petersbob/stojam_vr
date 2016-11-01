var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/lib/three.min.js', function(req, res) {
    res.sendFile(__dirname + '/lib/three.min.js');
});

app.get('/assets/*.png', function(req, res) {
    console.log('found a png asset');
    res.sendFile(__dirname + '/assets/dirt.png');  // expand to include all images
});

io.on('connection', function(socket) {
    console.log('a user connected');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
