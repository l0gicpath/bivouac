var start = function(handleNewConnection) {
  var server = require('net').createServer();
  var port = 5555;

  server.on('listening', function() {
    console.log('Server is listening on port', port);
  });

  server.on('error', function(err) {
    console.log('Error occurred:', err.message);
  });

  server.on('connection', function(socket) {
    console.log('New connection');
    var handlers = handleNewConnection();

    socket.on('data', function(data) {
      console.log('Incoming data');
      handlers.handleIncomingData(data.toString());
    });

    function outgoingHandler(text) {
      socket.write(text);
    }
    handlers.registerOutgoingDataHandler(outgoingHandler);
  });

  server.listen(port);
}

exports.start = start;
