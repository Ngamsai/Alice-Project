var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

var text = null;
var direction = null;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
    console.log("***************************************************************************************************")
//     console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext =req.body.queryResult.fulfillmentText;
    var direction,distance,startgame,turn,name,character,replay,ansQ2,forward_backward_direction,left_right_direction;
 
    if(text != null){
      console.log('sh resend ',text);
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
       direction = forward_backward_direction;
       console.log('show forward_backeard_direction ', direction)
    }else if (left_right_direction != null ){
       direction = left_right_direction;
       console.log('show left_right_direction ', direction)
    }
    //show value
    if(distance != null){
      console.log('show distance ', distance)
    }  
    if(startgame != null){
      console.log('show start ' , startgame)
    }
    if(character != null){
      console.log('actor is ' , character)
    }
    if(replay != null){
      console.log('say replay is ',replay)
    }
    if(ansQ2 != null){
      console.log('ansQ2 is ',ansQ2)
    }
  
    var x,y;
    var position = [[x,y]];
    position[0] = [-30,-143];
    if (direction != null && distance != null){
      position.push(checkorder(direction,distance,position));
    }
    position.push([x=10,y=60])
    console.log(position)
  
    function checkorder(order,dis,position){
      var dir = 'E';
      if (order == "forward"){
        for (i=1;i<=dis;i++){
          if(dir == 'N'){
            y += 57;
          }
          else if(dir == 'S'){
            y -= 57;
          }
          else if(dir == 'W'){
            x -= 57;
          }
          else if(dir == 'E'){
            x += 57;
          }
          position.push([x,y]);
        }
      }
      else if (order == "backward"){
        for (f=1;f<=dis;f++){
          if(dir == 'N'){
            y-=57;
          }
          else if(dir == 'S'){
            y+=57;
          }
          else if(dir == 'W'){
            x += 57;
          }
          else if(dir== 'E'){
            x -= 57;
          }
          position.push([x,y]);
        }
      }
      else if (order == "left"){
        for (k=1;k<dis;k++){
          if (dir == 'E'){
            dir = 'N';
          }
          else if (dir == 'N'){
            dir = 'W';
          }
          else if (dir == 'W'){
            dir = 'S';
          }
          else if (dir == 'S'){
            dir = 'E';
          }
        }
      }
      else if (order == "right"){
        for (q=1;q<dis;q++){
          if (dir == 'E'){
            dir = 'S';
          }
          else if (dir == 'S'){
            dir = 'W';
          }
          else if (dir == 'W'){
            dir = 'N';
          }
          else if (dir == 'N'){
            dir = 'E';
          }
        }
      }
     
      return position;
    }  

    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
     
    if (text != null){
      responseObj = {
                     "fulfillmentText":"next",
                  }
      text = null;
    } 
    console.log('show responseObj is ', responseObj)

  
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
      console.log('resendtext is ', responsetext1);
      text = responsetext1;
    });
});

io.on('connect_error', function (data) {
    console.log(data);
}); 

http.listen(port, function () {
    console.log('listening on *: ' + port);
});
     
