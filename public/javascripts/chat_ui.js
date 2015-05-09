
var socket = io.connect();

var ChatUI = function (element) {
  this.el = element;
  this.chat = new Chat(socket);
  this.el.find("#chat-window").on("submit", this.handleSubmission.bind(this));
  this.chat.onNewMessage = this.handleNewMessage.bind(this);
  this.chat.onUserList = this.renderUserList.bind(this);

  socket.on("updateUserList", this.renderUserList.bind(this));
};

ChatUI.prototype = {
  readAndClearText: function(){
    var form = this.el.find("#text-form");
    var textMessage = form.val();
    form.val("");
    return textMessage;
  },
  handleSubmission: function(e){
    event.preventDefault();
    var textMessage = this.readAndClearText();
    this.chat.parseAndSendMessage(textMessage);
  },
  handleNewMessage: function(data){
    this.el.find("ul#message-board").append("<li>" + data + "</li>");
    this.el.find("textarea").val("");
  },
  renderUserList: function(userNames){
    var userList = this.el.find("ul#users-list");
    userList.empty();
    userNames.forEach(function(username){
      userList.append("<li>" + username + "</li>");
    });
  },

};
