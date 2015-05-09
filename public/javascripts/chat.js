(function(root){
  var Chat = root.Chat = function (socket){
    this.socket = socket;
    this.onNewMessage = function(){};
    this.onUserList = function(){};
    this.socket.on("receiveMessage", function(data) {
      this.onNewMessage(data);
    }.bind(this));
    this.socket.on("userList", function(data){
      var users = [];
      for(var id in data){
        users.push(data[id]);
      }
      this.onUserList(users);
      // this.listenForUserNames(data);
    }.bind(this));
  };
	
  Chat.prototype.parseAndSendMessage = function(text){
		console.log(text)
    if (text.slice(0, 5) === "/nick") {
      var nicknameChosen = text.slice(6);
			var reg = /\d/g
      if (nicknameChosen.match(reg) === null) {
				console.log("changed nickname: " + nicknameChosen);
        this.changeNick(nicknameChosen);
      }else{
      	this.sendMessage("nickname cannot contain numbers")
      }

    }else{
      this.sendMessage(text);
    }
  };

  Chat.prototype.sendMessage = function(text){
    this.socket.emit("textMessage", text);
  };
  Chat.prototype.changeNick = function(newNick){
		console.log(newNick)
    this.socket.emit("nicknameChangeRequest", newNick);
  };

  Chat.prototype.listenForUserNames = function(userNames){
    this.socket.emit("updateUserList", Object.keys(userNames));
  };
	
	// Chat.prototype.processCommand = function(command){
// 		if (command === "nick") {
// 			this.socket.emit("nicknameChangeRequest", command);
// 		}else{
// 			this.socket.emit("textMessage", "that command is not recognized");
// 		}
//
// 	};

})(this);
