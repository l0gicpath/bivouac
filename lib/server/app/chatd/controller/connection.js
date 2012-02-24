var Room = require('../../../domain/room.js')['Room'];
var User = require('../../../domain/user.js')['User'];
var UserCommunication = require('../../../domain/communication.js')['UserCommunication'];
var SystemCommunication = require('../../../domain/communication.js')['SystemCommunication'];
var DownloadCommunication = require('../../../domain/communication.js')['DownloadCommunication'];

var room = new Room('default', SystemCommunication);
var userId = 0;
var outgoingHandlers = {};
var renderer = null;
var server = null;

var attachRenderer = function(theRenderer) {
  renderer = theRenderer;
}

var attachServer = function(theServer) {
  server = theServer;
  var user;

  server.on('newConnection', function(incomingHandler, outgoingHandler) {
    incomingHandler.on('newUser', function(name) {
      userId = userId + 1;

      user = new User(userId, name);
      room.addUser(user);

      outgoingHandlers[user] = outgoingHandler;

      deliver();
    });

    incomingHandler.on('newMessage', function(message) {
      var communication = new UserCommunication(user, message);
      room.addCommunication(communication);

      deliver();
    });
  });
}

var deliver = function() {
  var communications = room.getCommunications();
  var numberOfCommunications = communications.length;

  if (numberOfCommunications > 0) {
    var users = room.getUsers();
    var numberOfUsers = users.length;

    for (var i = 0; i < numberOfCommunications; i++) {
      for (var j = 0; j < numberOfUsers; j++) {
        outgoingHandlers[users[j]](renderer.render(communications[i]));
      }
      room.markCommunicationAsDelivered(communications[i]);
    }
  }
};

var handleUpload = function(filename, type) {
  var communication = new DownloadCommunication(filename, type, '/download/' + encodeURIComponent(filename));
  room.addCommunication(communication);
  deliver();
};

exports.attachRenderer = attachRenderer;
exports.attachServer = attachServer;
exports.handleUpload = handleUpload;