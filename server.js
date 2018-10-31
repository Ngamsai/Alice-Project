var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); //server
var port = process.env.PORT || 3000;

var text = null;
var maze = [[0,1,0,1,0,1,0,1,0,1,0],
            [1,0,0,0,1,0,0,0,0,0,1],
            [0,0,0,0,0,1,0,0,0,0,0],
            [1,0,0,0,1,0,0,0,1,0,1],
            [0,0,0,1,0,0,0,1,0,1,0],
            [1,0,0,0,0,0,0,0,0,0,1],
            [0,1,0,1,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,1,0,1,0,1],
            [0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,1,0,0,0,0,0,1],
            [0,1,0,1,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,1],
            [0,1,0,1,0,1,0,1,0,1,0]];
var position = [[11,1]];
var maze_x = 11;
var maze_y = 1;
var direction = 'E';
var state = 'maze1';
var position_flag = true;
var order,distance,startgame,turn,name,character,replay,ansQ2,forward_backward_direction,left_right_direction,anser,language;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/', (req, res) => {
  
    console.log("***************************************************************************************************")
//     console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext = req.body.queryResult.fulfillmentText;
//     console.log('res is ',responsetext);
    
 
    if(text != null){
      console.log('sh resend ',text);
    }
    
    //console.log(keep);
    forward_backward_direction = keep['conversation-use'];
    left_right_direction = keep['conversation-direction'];
    distance = keep['number-integer'];
    startgame = keep['conversation-gamecontrol'];
    replay =keep['conversation-replay'];
    anser = keep.question;
    character = keep.actor;
    language = req.body.queryResult.languageCode;
    console.log('language is ',language);
    if(forward_backward_direction != null){
       order = forward_backward_direction;
       console.log('show forward_backeard_direction ', order);
    }else if (left_right_direction != null ){
       order = left_right_direction;
       console.log('show left_right_direction ', order);
    }
    //show value
    if(distance != null){
      console.log('show distance ', distance);
    }  
    if(startgame != null){
      console.log('show start ' , startgame);
    }
    if(character != null){
      console.log('actor is ' , character);
    }
    if(replay != null){
      console.log('say replay is ',replay);
    }
    if(anser != null){
      console.log('ansQ2 is ',anser);
    }
  
  //when maze state will calculate this function
    if (order != null && distance != null){
      if (language == 'th'){
        if (order == "ตรงไป"){
          order = "forward";
        }
        else if (order == "ถอยหลัง"){
          order = "backward";
        }
        else if (order == "เลี้ยวซ้าย"){
          order = "left";
        }
        else if (order == "เลี้ยวขวา"){
          order = "right";
        }
        ComputePosition();
        if (responsetext == 'start new') {
          responsetext = 'ไม่สามารถเดินซ้ำเส้นทางเดิมได้ กลับไปเริ่มต้นอีกครั้ง';
        }else if (responsetext == 'crashing'){
          responsetext = 'ไม่สามารถไปเส้นทางนี้ได้'
        }
        checkState();
        if ( responsetext == 'go to maze 2'){
          responsetext = 'ไปยังด่านเขาวงกตที่ 2';
        }
        else if (responsetext == 'go to maze 3'){
          responsetext = 'ไปยังด่านเขาวงกตที่ 3';
        }
        else if (responsetext == 'go to maze 4'){
          responsetext = 'ไปยังด่านเขาวงกตที่ 4';
        }
        else if (responsetext == 'go to maze 5'){
           responsetext = 'ไปยังด่านเขาวงกตที่ 5';
        }
        else if (responsetext == 'I keep key already'){
           responsetext = 'เก็บกุญแจได้แล้ว'; 
        }
        else if (responsetext == 'you have to keep a key frist'){
           responsetext = 'ต้องไปเก็บกุญแจก่อนมาไขประตูนะ';
        }
        else if (responsetext == 'go to next state'){
           responsetext = 'ไปยัด่านต่อไปได้เลย';
         }
      }
      else if (language == 'en'){
        ComputePosition();
        checkState();
      }
    }
  
    function ComputePosition (){
      if (order == "forward"){
        for (var e=0; e<distance; e++){
          if(direction == 'N'){
            if (maze[maze_x-1][maze_y] === 0){
              maze_x -= 2; 
              console.log('maze_x ',maze_x);
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'S'){
            if (maze[maze_x+1][maze_y] === 0){
              maze_x += 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'W'){
            if (maze[maze_x][maze_y-1] === 0){
              maze_y -= 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'E'){
            if (maze[maze_x][maze_y+1] === 0){
              maze_y += 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          console.log('position length ',position.length);
          console.log('x ',maze_x);
          console.log('y',maze_y);
          console.log('dir ',direction);
          for (var k = 0; k<position.length; k++){
            console.log('k',k);
            if(position[k][0] == maze_x){
              if (position[k][1] == maze_y){
                responsetext = 'start new';
              } 
            }
          }
          if (position_flag){
            position.push([maze_x,maze_y]);  
          }else{
            responsetext = 'crashing';
          }
          if (responsetext == 'start new'){
              resetPosition(position);
          }
        }
      }
      else if (order == "backward"){
        for (var f=0; f<distance; f++){
          if(direction == 'N'){
            if (maze[maze_x+1][maze_y] === 0){
              maze_x += 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'S'){
            if (maze[maze_x-1][maze_y] === 0){
              maze_x -= 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'W'){
            if (maze[maze_x][maze_y+1] === 0){
              maze_y += 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          else if(direction == 'E'){
            if (maze[maze_x][maze_y-1] === 0){
              maze_y -= 2; 
              position_flag = true
            }
            else {
              position_flag = false
            }
          }
          for (var l = 0; l<position.length; l++){
            if(position[l][0] == maze_x){
              if (position[l][1] == maze_y){
                responsetext = 'start new';
                 } 
            }
          }
          if (position_flag){
            position.push([maze_x,maze_y]);  
          }else{
            responsetext = 'crashing';
          }
          if (responsetext == 'start new'){
              resetPosition(position);
          }
        }
      }
      else if (order == "left"){
        for (var g=0; g<distance; g++){
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
      console.log(direction);
      console.log(position);
    }
  
   function resetPosition(){
     position.splice(1, position.length);
     maze_x = 11;
     maze_y = 1;
     direction = 'E';     
   }
  
    function checkState(){
      if (state == 'maze1'){
        if (maze_x == 5 && maze_y == 7){
          responsetext = 'go to maze 2';
          state = 'maze2';
          resetPosition();
        }
      }
      else if (state == 'maze2'){
        if (maze_x == 3 && maze_y == 7){
          responsetext = 'go to maze 3';
          state = 'maze3';
          resetPosition(position);
        }
      }
      else if (state == 'maze3'){
        if (maze_x == 9 && maze_y == 3){
           responsetext = 'go to maze 4';
           state = 'maze4';
           resetPosition(position);
        }
      }
      else if (state == 'maze4'){
        if (maze_x == 3 && maze_y == 3){
            responsetext = 'go to maze 5';
            state = 'maze5';
            resetPosition(position);
        }
      }
      else if (state == 'maze5'){
        if (maze_x == 3 && maze_y == 9){
            responsetext = 'go to maze 5';
            state = 'maze5';
            resetPosition(position);
        }
      }
      else if (state == 'maze6'){
        if (maze_x == 5 && maze_y == 7){
            responsetext = 'I keep key already'; 
        }
        else if (maze_x == 3 && maze_y == 1){  
          if (text == 'havekey'){
             responsetext = 'go to next state';
             resetPosition(position);
             state = 'Q2';
             var randomtrees = Math.floor(Math.random() * 10) + 1;
             var randomstone = Math.floor(Math.random() * 10) + 1;
             io.emit('Q2',randomtrees,randomstone)
           } else {
             responsetext = 'You have to keep a key first';
           }
        }
      }
      console.log('responsetext from checkState is ',responsetext);
     }
    
//     function detectCrash (collision){
//       responsetext = 'crashing';
//       console.log('crashing');
//       position.splice(1, position.length);
//       maze_x = -30;
//       maze_y = -143;
//     }
  
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
  
    console.log('show responseObj is ', responseObj);

  
    //emit to scratchX game and scratchX show log code 
    io.emit('chat',order,distance,startgame,character,replay,ansQ2,state);
    io.emit('symbols',order,distance,state);
    setTimeout(function(){
       console.log('send already');
       return res.json(responseObj);
    },2000)
    
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
     
