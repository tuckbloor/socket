var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var person = [];

//get external css file
app.get('/public/css/chat.css', function(req, res){
  res.sendFile(__dirname + '/public/css/chat.css');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  //emit the message
  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  //emit a new user
  count++;
  io.sockets.emit('user', 'Number Of Users ' + count );
  io.sockets.emit('user_number', count);
 
  //emit a user that left
  socket.on("disconnect", function(){
    count--;
    io.sockets.emit('user', 'Number Of Users ' + count );
    io.sockets.emit('update_online_user_names', socket.user);

    //get the position
    var i = person.indexOf(socket.user);

    //delete via the position
    person.splice(i, 1);

    //update the online users names in the side bar
    io.emit('delete_username', person);

  });

  //emit the username in the sidebar
    socket.on('username', function (user) {
      socket.user = user;
      person.push(user);
      io.emit('username',  person )
    });

    //who is typeing
    socket.on('typeing', function() {
      io.emit('typeing', socket.user);
    })

  socket.on('stopped_typing', function() {
    io.emit('stopped_typing', socket.user);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});