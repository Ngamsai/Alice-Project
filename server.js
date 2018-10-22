var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

var text = null;
var position = [[-30,-143]];
var x = -30,y = -143;
var direction = 'E';
var state = 'maze1';

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
    console.log("***************************************************************************************************")
//     console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext =req.body.queryResult.fulfillmentText;
    console.log('res is ',responsetext);
    var order,distance,startgame,turn,name,character,replay,ansQ2,forward_backward_direction,left_right_direction,anser;
 
    if(text != null){
      console.log('sh resend ',text);
    }
    
    //console.log(keep);
    forward_backward_direction = keep['conversation-use'];
    distance = keep['number-integer']
    startgame = keep['conversation-gamecontrol']
    left_right_direction = keep['conversation-direction']
    replay =keep['conversation-replay']
    anser = keep.question
    character = keep.actor
    if(forward_backward_direction != null){
       order = forward_backward_direction;
       console.log('show forward_backeard_direction ', order)
    }else if (left_right_direction != null ){
       order = left_right_direction;
       console.log('show left_right_direction ', order)
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
    if(anser != null){
      console.log('ansQ2 is ',anser)
    }

  
    if (order != null && distance != null){
      if (order == "forward"){
        for (var a=0; a<distance; a++){
          if(direction == 'N'){
            y += 57;
          }
          else if(direction == 'S'){
            y -= 57;
          }
          else if(direction == 'W'){
            x -= 57;
          }
          else if(direction == 'E'){
            x += 57;
          }
          for (var i = 0; i<position.length; i++){
            if(position[i][0] == x){
              if (position[i][1] == y){
                responsetext = 'start new';
              } 
            }
          }
          position.push([x,y]);
        }
      }
      else if (order == "backward"){
        for (var f=0; f<distance; f++){
          if(direction == 'N'){
            y-=57;
          }
          else if(direction == 'S'){
            y+=57;
          }
          else if(direction == 'W'){
            x += 57;
          }
          else if(direction == 'E'){
            x -= 57;
          }
          for (var j = 0; j<position.length; j++){
            if(position[j][0] == x){
              if (position[j][1] == y){
                responsetext = 'start new';
              } 
            }
          }
          position.push([x,y]);
        }
      }
      else if (order == "left"){
        for (var k=0; k<distance; k++){
          if (direction == 'E'){
            direction = 'N';
          }
          else if (direction == 'N'){
            direction = 'W';
          }
          else if (direction == 'W'){
            direction = 'S';
          }
          else if (direction == 'S'){
            direction = 'E';
          }
        }
      }
      else if (order == "right"){
        for (var q=0; q<distance; q++){
          if (direction == 'E'){
            direction = 'S';
          }
          else if (direction == 'S'){
            direction = 'W';
          }
          else if (direction == 'W'){
            direction = 'N';
          }
          else if (direction == 'N'){
            direction = 'E';
          }
        }
      }
      console.log(position);
    }

    if (state == 'maze1'){
      if (x == 141 && y == 28){
        responsetext = 'go to maze 2';
        state = 'maze2';
      }
    }
    else if (state == 'maze2'){
      if (x == 141 && y == 85){
        responsetext = 'go to maze 3';
        state = 'maze3';
      }
    }
    else if (state == 'maze3'){
      if (x == 27 && y == -86){
         responsetext = 'go to maze 4';
         state = 'maze4';
      }
    }
    else if (state == 'maze4'){
      if (x == 27 && y == 85){
          responsetext = 'go to maze 5';
          state = 'maze5';
      }
    }
    else if (state == 'maze6'){
      if (x == 141 && y == 28){
          responsetext = 'I keep key already'; 
      }else 
          responsetext = 'you have to keep a key frist';
      
      if (x == 198 && y == 85){  
          for (var p = 0; p<position.length; p++){
            if(position[p][0] == x == 141){
               if (position[p][1] == y == 28){
                 responsetext = 'go to next state';
                 state = 'Q2';
                 var randomtrees = Math.floor(Math.random() * 10) + 1;
                 var randomstone = Math.floor(Math.random() * 10) + 1;
                 io.emit('Q2',randomtrees,randomstone)
               } 
             }
           } 
       }
    }
//     else if (state == 'Q2'){
//       responsetext = 'there are many trees ?';
//       if (anser == randomtrees){
        
//       }
//     }
  
    console.log('resq is ',responsetext);

    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
  
    console.log('show responseObj is ', responseObj)

  
    //emit to scratchX game and scratchX show log code 
    io.emit('chat',order,distance,startgame,character,replay,ansQ2,state)
    io.emit('symbols',order,distance)
 
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
      }else if (remessage.hasOwnProperty('stateOfMaze')){
        responsetext1 = remessage.stateOfMaze;
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
     
