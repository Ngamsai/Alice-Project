var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;
<<<<<<< HEAD
// var cors = require('cors');
///testtset
=======


>>>>>>> f6f96d12f81af6acd8912b461e65ff53d72937b6
// use it before all route definitions
// app.use(cors({origin: '*'}));
var text = null;
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
    console.log("***************************************************************************************************")
    console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext =req.body.queryResult.fulfillmentText;
    var direction,speed,startgame,turn,name,character,replay,ansQ2 ;
   
//     io.on('ctdalf',tttt);
//     tttt = responsetext1;
    console.log('sh resend '+text);
    console.log(keep);
    direction = keep['conversation-use'];
    speed = keep['number-integer']
    startgame = keep['conversation-gamecontrol']
    turn = keep['conversation-direction']
    replay =keep['conversation-replay']
    ansQ2 = keep.question
    character = keep.actor
    console.log('show direction '+ direction)
    console.log('show speed '+ speed)
    console.log('show start ' + startgame)
    console.log('turn ' + turn)
    console.log('actor is ' + character)
    console.log('say replay is '+replay)
    console.log('ansQ2 is '+ansQ2)
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
    if (text != null){
      responseObj = {   
                        "fulfillmentText":text,
                      }
      text = null;
    } 
    console.log('show responseObj')
    console.log(responseObj)
    io.emit('chat',direction,speed,startgame,turn,character,replay,ansQ2)
    
 
    return res.json(responseObj);
    
 })
// io.set( 'origins', ['*'] );
io.on('connection', function (socket) { 
    var responsetext1;
    console.log('connect');
    socket.on('resend', function (remessage){
      console.log('resendmessage is ',remessage)
      if (remessage.hasOwnProperty('name') ){
        responsetext1 = remessage.name;
      }else if (remessage.hasOwnProperty('question2')){
       responsetext1 = remessage.question2;
      }
      console.log('resendtext is ',responsetext1);
      text = responsetext1;
//       return responsetext1;
    });
//     socket.emit('ctdalf', responsetext );
        //console.log('send com'+responsetext)
});
// io.emit('ctdalf', responsetext );
io.on('connect_error', function (data) {
    console.log(data);
  
}); 

http.listen(port, function () {
    console.log('listening on *: ' + port);
});