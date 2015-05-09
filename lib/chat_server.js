var socketio = require("socket.io");
var nicknames = {};
var guestNumber = 1;
var sockets = {};

var handleMessage = function(io, socket){
  socket.on('textMessage', function (data) {
    //console.log(data);
    var sender = nicknames[socket.id];
    io.emit("receiveMessage", sender + ": " + data);
  });
};

var handleNameChange = function(io, socket){
  socket.on('nicknameChangeRequest', function (newNick) {
    var inUse = false;
		console.log(newNick)
    for(nickname in nicknames){
      if(nicknames[nickname] === newNick){
        //if nickname is already in list
        inUse = true;
        console.log("error, name already in use");
      }
    }
    if(!inUse){
      //reassign the new nickname
      nicknames[socket.id] = newNick;
      //inform the client it was a success
      socket.emit('nicknameChangeResult', nickname)
      handleUserList(io, socket);
    } else {
      socket.emit('nicknameChangeError', "already in use");
    }
  })
};

var createChat = function(server){
  var io = socketio(server);
  io.on('connection', function (socket) {
    nicknames[socket.id] = guestNumber++;
    sockets[socket.id] = socket;
    handleMessage(io, socket);
    handleNameChange(io, socket);
    handleDisconnect(io, socket);
    handleUserList(io, socket);
  });
};

var handleUserList = function(io, socket){
    console.log(Object.keys(nicknames));
    io.emit("userList", nicknames);
};

var handleDisconnect = function (io, socket) {
  socket.on('disconnect', function(msg) {
    var nicknameOfLeaver = nicknames[socket.id];
    // console.log(nicknameOfLeaver);
    // console.log(nicknames);
    // console.log(sockets);
    delete nicknames[socket.id];
    delete sockets[socket.id];
    // console.log(nicknames);
    // console.log(sockets);
    io.emit("receiveMessage", nicknameOfLeaver + " has left the chat.");
    handleUserList(io, socket);
  });
}

exports.createChat = createChat;
