var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;
// var cors = require('cors');
///testtset
// use it before all route definitions
// app.use(cors({origin: '*'}));

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
    console.log("***************************************************************************************************")
    //console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext =req.body.queryResult.fulfillmentText;
    var direction,speed,startgame,turn,name,character ;

    console.log(keep);
    direction = keep['conversation-use'];
    speed = keep['number-integer']
    startgame = keep['conversation-gamecontrol']
    turn = keep['conversation-direction']
    name = keep['name']
    character = keep['actor']
    console.log('show direction '+ direction)
    console.log('show speed '+ speed)
    console.log('show start ' + startgame)
    console.log('turn ' + turn)
    console.log('name is ' + name)
    console.log('actor is ' + character)
    let responseObj = {   
                        "fulfillmentText":responsetext,
                      }
    console.log('show responseObj')
    console.log(responseObj)
    io.emit('chat',direction,speed,startgame,turn,name,character)
  
    io.on('resend', function (remessage){
      console.log('resendmessage is ',remessage)
    });
  
    return res.json(responseObj);
    
 })
// io.set( 'origins', ['*'] );
io.on('connection', function (socket) { 
    console.log('connect');
});
io.on('connect_error', function (data) {
    console.log(data);
  
}); 

http.listen(port, function () {
    console.log('listening on *: ' + port);
});