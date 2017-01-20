var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Player = require('./server_player');

var players = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static('public'));

io.on('connection', function(socket) {
    console.log('a user connected. Socket: ' + socket.id);

    socket.emit('socket_id', socket.id);
    socket.on('update', function(msg) {
        if (msg.id in players) {
            players[msg.id].UpdatePosition(msg);
        } else {
            var player = new Player.Player(msg.id);
            players[player.id] = player;
            console.log("created new player" + players[player.id]);
        }
        io.emit('update', JSON.stringify(players));
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected with id: ' + socket.id);
        io.emit('remove_player', players[socket.id].id);
        delete players[socket.id];
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
