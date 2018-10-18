var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

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
    var direction,distance,startgame,turn,name,character,replay,ansQ2,forward_backward_direction,left_right_direction;
   
    if(text != null){
      console.log('sh resend '+text);
    }
    
    //console.log(keep);
    forward_backward_direction = keep['conversation-use'];
    distance = keep['number-integer']
    startgame = keep['conversation-gamecontrol']
    left_right_direction = keep['conversation-direction']
    replay =keep['conversation-replay']
    ansQ2 = keep.question
    character = keep.actor
    if(forward_backward_direction != null){
       direction = forward_backward_direction
       console.log('show forward_backeard_direction '+ direction)
    }else if (left_right_direction != null ){
       direction = left_right_direction
       console.log('show left_right_direction '+ direction)
    }
    //show value
    if(distance != null){
      consoldise.log('show distance '+ distance)
    }  
    if(startgame != null){
      console.log('show start ' + startgame)
    }
    if(character != null){
      console.log('actor is ' + character)
    }
    if(replay != null){
      console.log('say replay is '+replay)
    }
    if(ansQ2 != null){
      console.log('ansQ2 is '+ansQ2)
    }
    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
     
    if (text != null){
      responseObj = {
                     "fulfillmentText":text,
                  }
      text = null;
    } 
    console.log('show responseObj is '+ responseObj)
    //emit to scratchX game and scratchX show log code 
    io.emit('chat',direction,distance,startgame,character,replay,ansQ2)
    io.emit('symbols',direction,distance)
    
 
    return res.json(responseObj);
    
 })
// received messages from scratchX game control 
io.on('connection', function (socket) { 
    var responsetext1;
    console.log('connect');
    socket.on('resend', function (remessage){
      if (remessage.hasOwnProperty('name') ){
        responsetext1 = remessage.name;
      }else if (remessage.hasOwnProperty('question2')){
       responsetext1 = remessage.question2;
      }
      console.log('resendtext is ',responsetext1);
      text = responsetext1;]
    });
});

io.on('connect_error', function (data) {
    console.log(data);
  
}); 

http.listen(port, function () {
    console.log('listening on *: ' + port);
});
     
