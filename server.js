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
var modify_flag = false;
var Nocrashing_flag = true;
var sequence = 0;
var order,distance,forward_backward_direction,left_right_direction;
var modify,deleteCode,insert,play,reset,numberSequence,insertPosition,number;
var ansQ2,anser;
var startgame,character,language;
var arrayOrder = [[order,distance]];
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/', (req, res) => {
  
    console.log("***************************************************************************************************")
    // console.log(req.body);
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
    play =keep['conversation-replay'];
    anser = keep.question;
    character = keep.actor;
    reset = keep.reset;
    modify = keep.modify;
    numberSequence = keep['number-sequence'];
    deleteCode = keep.delete;
    insert = keep.insert;
    insertPosition = keep['insert-position'];
    language = req.body.queryResult.languageCode;
    console.log('Version is ',language);
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
    if(play != null){
      console.log('say play is ',play);
      play();
    }
    if(modify != null){
      console.log('he will ',modify,' in number ',numberSequence);
      modify_flag = true;
      number = numberSequence;
    }
    if(deleteCode != null){
      console.log('he will ',deleteCode,' code number ',numberSequence);
    }
    if(insert != null){
      console.log('he will ',insert,' ',insertPosition,' number ',numberSequence);
    }
    if(reset != null){
      console.log('reset ',reset);
      resetPosition();
      resetArrayOrder();
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
        keepArrayOrder();
      }
      else if (language == 'en'){
        ComputePosition();
        checkState();
        keepArrayOrder();
      }
    }
  
    function ComputePosition (){
      console.log('compteposition access');
      if (modify_flag){
        console.log('order change is ',order);
        console.log('distance change is ',distance);
        number = number - 1 ;
        for (var i = 0 ;i<arrayOrder.length ;i++){
          if (number == i){
            arrayOrder[i][0] = order;
            arrayOrder[i][1] = distance;
            io.emit('modify',order,distance,number,modify_flag);
            modify_flag = false;
          }
        }
      }
      else{
        if (order == "forward"){
          for (var a=0; a<distance; a++){
            if(direction == 'N'){
              if (maze[maze_x-1][maze_y] === 0){
                maze_x -= 2; 
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
            for (var b = 0; b<position.length; b++){
              if(position[b][0] == maze_x){
                if (position[b][1] == maze_y){
                  responsetext = 'start new';
                } 
              }
            }
            if (position_flag){
              position.push([maze_x,maze_y]);  
            }else{
              responsetext = 'crashing';
              Nocrashing_flag = false;
            }
            if (responsetext == 'start new'){
                resetPosition(position);
            }
          }
        }
        else if (order == "backward"){
          for (var c=0; c<distance; c++){
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
            for (var d = 0; d<position.length; d++){
              if(position[d][0] == maze_x){
                if (position[d][1] == maze_y){
                  responsetext = 'start new';
                  } 
              }
            }
            if (position_flag){
              position.push([maze_x,maze_y]); 
            }else{
              responsetext = 'crashing';
              Nocrashing_flag = false;
            }
            if (responsetext == 'start new'){
                resetPosition(position);
            }
          }
        }
        else if (order == "left"){
          for (var e=0; e<distance; e++){
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
          for (var f=0; f<distance; f++){
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
        io.emit('chat',order,distance,sequence);
      }
      console.log(direction);
      console.log(order);
      console.log(distance);
      console.log(position);
    }

    function keepArrayOrder(){
      console.log('access keepArrayOrder');
      if (order == 'forward'||order == 'backward'){
        if(Nocrashing_flag){
          arrayOrder.push([order,distance]);
          sequence += 1;
        }
      }else if (order == 'left' || order == 'right'){
        arrayOrder.push([order,distance]);
        sequence += 1;
      }
      
      console.log('arrayOrder ',arrayOrder);
    }

    function play() {
      for (var j = 0 ;j<arrayOrder.length;j++){
        ComputePosition();
      }
    }

    function resetPosition(){
      position.splice(1, position.length);
      maze_x = 11;
      maze_y = 1;
      direction = 'E';     
    }

    function resetArrayOrder(){
      arrayOrder.splice(1, arrayOrder.length);
      sequence = 0;
    }
  
    function checkState(){
      console.log('access checkstate');
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
    

  
    console.log('resq is ',responsetext);

    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
  
    console.log('show responseObj is ', responseObj);

  
    //emit to scratchX game and scratchX show log code 
    io.emit('controlgame',startgame,character,play,ansQ2,state,reset)
    io.emit('symbols',order,distance,state,reset);
    var num = distance*1000;
    setTimeout(function(){
       console.log('send already');
       return res.json(responseObj);
    },num)
    
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
     
