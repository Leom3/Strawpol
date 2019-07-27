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
var MongoObjectID = require("mongodb").ObjectID;
server.listen(port);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(morgan());

app.get('/', function(req, res, next) {
	database.findOneInCollection("images", {'id': 1}, function(err, image) {
		var votes1 = image.vote;
		console.log(votes1);
		database.findOneInCollection("images", {'id': 1}, function(err, image2) {
			console.log(image2.votes);
			io.sockets.emit('setChart', {image1 : votes1, image2: image2.votes});
			next();
		});
		next();
	});
	res.sendFile(__dirname + '/index.html');
});

app.get('/getVotes', function(req, res, next) {
	let data = {};
	var promise = new Promise(function(resolve, reject) {
		database.findOneInCollection("images", {'id': 1}, function(err, image) {
			var votes1 = image.votes;
			data.votes1 = votes1;
			database.findOneInCollection("images", {'id': 2}, function(err, image2) {
				data.votes2 = image2.votes;
				resolve("promise Done");
			});
		});
	});

	promise.then(function() {
		res.send(data);
	});
});

app.post('/likePicture', function(req, res, next) {
	var responseData = {Success : "Data sent"};
	var voted = req.query.vote;
	var newVotes = null;

	if (voted == "image1") {
		database.findOneInCollection("images", {'id': 1}, function(err, image) {
			console.log(image);
			newVotes = String(Number(image.votes) + 1);
			console.log(newVotes);
				database.updateOneInCollection("images", {'_id': new MongoObjectID(image._id)}, {$set: {'id' : 1, 'votes' : newVotes}}, function(err, res) {
				io.sockets.emit('updateVote', {name : "1", votes: newVotes});
				next();
			})
			next();
		});
	}
	else {
		database.findOneInCollection("images", {'id': 2}, function(err, image) {
			console.log(image);
			newVotes = String(Number(image.votes) + 1);
			console.log(newVotes);
			database.updateOneInCollection("images", {'_id': new MongoObjectID(image._id)}, {$set:{'id' : 2, 'votes' : newVotes}}, function(err, res) {
				io.sockets.emit('updateVote', {name : "2", votes: newVotes});
				next();
			})
			next();
		})
	}
	return(res.json(responseData));
});