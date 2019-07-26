require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const config = require('./config.json');
const morgan = require('morgan');
const packets = require('./src/packets');
const database = require('./src/database');
const request  = require('request');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
server.listen(port);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(morgan());

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/likePicture', function(req, res) {
	io.sockets.emit('like update', { id: '123' });
	return;
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});