var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
//     console.log(req.body);
//     var array1 =[];
    var keep = req.body.queryResult.parameters
    var direction,speed ;
    console.log(keep);
//     array1.forEach(function(keep) {
//       console.log('show'+keep);
//     });
    direction = keep['conversation-use'];
    speed = keep['number-integer'];
    console.log(direction);
    console.log(speed);
    res.send('8585');
    io.emit('chat',direction,speed);
    
 })

io.on('connection', function (socket) { 
      console.log('connect');

//   io.emit('chat', { for :'eiei'});
 });


// console.log('This socket is now connected to the Sails server1234.');
// io.on('connect', function(socket){
//     console.log('This socket is now connected to the Sails server.');
// //     socket.on('chat', function(keep){
// //       console.log(keep)
// //     });
//  });
// io.on('connection', function(socket){
//    socket.on('chat message', function(keep){
//      console.log(keep)
//      io.sockets.emit('gameon',keep); 
//     });
//   //console.log('a user connected');
// //   socket.on('chat message', function () {
// //     console.log("5555555")
// //   })
// });
http.listen(port, function () {
    console.log('listening on *: ' + port);
});