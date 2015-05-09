var http = require('http'),
	static = require('node-static'),
	socketio = require('./chat_server.js'),
	file = new static.Server('./public');

var server = http.createServer(function(req, res){
	req.addListener('end', function(){
		file.serve(req, res);
	}).resume();
})

server.listen(8000);
socketio.createChat(server);
