var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//var clients = [];
var clientMap = {};
/*
loop through array
if(clientMap[client.id] == undefined){
clientMap[client.id] = true;
create new cube 
}
 */

function createClient(new_socket, new_msg) {
    clients.push({
        coords: new_msg,
        id: new_socket.id
    })
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/public',express.static('public'));

io.on('connection', function(socket) {
    console.log('a user connected. Socket: ' + socket.id);

    socket.emit('socket_id', socket.id);
    socket.on('update', function(msg) {
        clientMap[msg.id] = msg;
        io.emit('update', JSON.stringify(clientMap));
    });
    // socket.on('render', function(msg) {
    //     console.log(msg.x);
    // });
    // socket.on('cubeUpdate', msg) {
    //     clientMap[msg.id].x = msg.x
    // });
    socket.on('disconnect', function(socket) {
        console.log('a user disconnected');
        delete clientMap[socket.id];
        io.emit('update', JSON.stringify(clientMap));
    });
});



http.listen(3000, function() {
    console.log('listening on *:3000');
});
