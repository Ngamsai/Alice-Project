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
var status_state = 0;
var position_flag = true;
var modify_flag = false;
var delete_flag = false;
var play_flag = false;
var reset_flag = false;
var repeat_flag = false;
var insert_flag = false;
var crash_flag = false;
var havetoDo_flag = false;
var num = 500;
// var sequence = 0;
var order = null,distance = null ,forward_backward_direction = null,left_right_direction = null;
var modify = null,delete_code = null,insert = null,play = null,reset = null,numberSequence = null,insertPosition = null,number = null,insert_position = null;
// var ansQ2,anser;
var number_deletecode = null ;
var startgame = null ,language;
var character;
var arrayOrder = [];
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/', (req, res) => {
  
    console.log("***************************************************************************************************")
    console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext = req.body.queryResult.fulfillmentText;
//     console.log('res is ',responsetext);
 
    if(text != null){
      console.log('sh resend ',text);
    }
    
    forward_backward_direction = keep.order;
    left_right_direction = keep.direction;
    distance = keep.distance;
    startgame = keep.startgame;
    play =keep.play;
    anser = keep.question;
    character = keep.actor;
    reset = keep.reset;
    modify = keep.modify;
    numberSequence = keep.position;
    delete_code = keep.delete;
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
    else if(startgame != null ){
      status_state = 1 ;
      state = 'maze1';
      havetoDo_flag = false;
      resetPosition();
      resetArrayOrder();
      console.log('show start ' , startgame);
      console.log('Do is ',havetoDo_flag);
    }
    else if (character != null ) {
      status_state = 2;
      console.log('actor is ' ,typeof character);
      if (character == "1" || character == "2" ){
      }
      else{
        responsetext = 'you can choose 1 or 2 only';
      }
    }
    else if(play != null){
      console.log('play is ',play);
      play_flag = true;
      playFunction();
      // console.log('numberSequence ',numberSequence); 
    }
    else if(modify != null){
      console.log('he will ',modify,' in number ',numberSequence);
      modify_flag = true;
      number = numberSequence;
      // console.log('mod def ',modify_flag);
      // console.log('number ',number);
    }
    else if(delete_code != null){
      console.log('he will ',delete_code,' code number ',numberSequence);
      number_deletecode = numberSequence;
      delete_flag = true;
      deleteCode();
    }
    else if(insert != null){
      console.log('he will ',insert,' ',insertPosition,' number ',numberSequence);
      number = numberSequence;
      // if (language == 'th'){
      //   if (insertPosition == 'ก่อน'){
      //     insert_position == 'before';
      //   }
      //   else if(insertPosition == 'หลัง'){
      //     insert_position == 'after';
      //   }
      // }
      // console.log('insert position ',insertPosition);
      insert_position = insertPosition;
      // console.log('insert_position ',insert_position);
      insert_flag = true ;
    }
    else if(reset != null){
      console.log('reset ',reset);
      reset_flag = true;
      resetPosition();
      resetArrayOrder();
      // insert_position = null;
      // insert_flag = false;
      // modify_flag = false;
        
      // delete_code = null;
      // io.emit('reset',reset);
    }
    // else if(anser != null){
    //   console.log('ansQ2 is ',anser);
    // }
    if (language == 'th'){
      if (insertPosition != null){
        if (insert_position == 'ก่อน'){
          insert_position = 'before';
        }
        else if (insert_position == 'หลัง'){
          insert_position = 'after';
        } 
      }
    }

    //when maze state will calculate this function
    if (order != null && distance != null){
      if (language == 'th'){
        if (order == "เดินหน้า"){
          order = "forward";
        }
        else if (order == "ถอยหลัง"){
          order = "backward";
        }
        else if (order == "หันซ้าย"){
          order = "left";
        }
        else if (order == "หันขวา"){
          order = "right";
        }
        ComputePosition();
        keepArrayOrder();
        checkState();
      }
      else if (language == 'en' || language == 'en-us'){
        ComputePosition();
        keepArrayOrder();
        checkState();
      }
    }

    function ComputePosition (){
      console.log('compteposition access');
      if (havetoDo_flag){
        if (modify_flag == true || insert_flag == true || delete_flag == true || reset != null){
          havetoDo_flag = false;
        }
        else{
          responsetext = 'you must use modify group order only.';
        }
        console.log("haveto ",havetoDo_flag);
      }
      if (modify_flag){
        // console.log('order change is ',order);
        // console.log('distance change is ',distance);
        // console.log('number ',number);
        number = number - 1 ;
        arrayOrder.splice(number, 1, [order,distance]);
        number = null;
        console.log('arrayOrder from compute mod',arrayOrder);
        // console.log('order change is ',order);
        // console.log('distance change is ',distance);
        // console.log('number ',number);
        // console.log('mo_f ',modify_flag);
        //   }
        // }
      }
      else if (insert_flag){
        if (insert_position == 'before'){
          number = number - 1 ;
          arrayOrder.splice(number, 0, [order,distance]);
          console.log('arrayOrder from compute insert before',arrayOrder);
        }else if (insert_position == 'after'){
          arrayOrder.splice(number, 0, [order,distance]);
          console.log('arrayOrder from compute insert after',arrayOrder);
        }
        number = null ;
        insert_position = null;
      }
      else if (havetoDo_flag == false || play_flag == true){
        // console.log('order sh ',order);
        // console.log('disance sh ',distance);
        // console.log('in compute sh arr Order ',arrayOrder);
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
            if (position_flag){
              //check repeat
              for (var b = 0; b<position.length; b++){
                // console.log('x ',maze_x,' y ',maze_y);
                if(position[b][0] == maze_x && position[b][1] == maze_y){
                  responsetext = 'You can not walk the same route, you must modify,delete or insert.';
                  console.log(position[b][0],position[b][1]);
                  repeat_flag = true;
                  console.log('access check repeat',repeat_flag);
                }
              }
              position.push([maze_x,maze_y]);  
            }else{
              responsetext = 'crashing ,you must modify,delete or insert';
              crash_flag = true;
              console.log('text clashing');
            }
            if (responsetext == 'You can not walk the same route, you must modify,delete or insert.'){
              position.pop();
              console.log('do function resetposition when repeat');
            }
          }
          num = distance*500;
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
            if (position_flag){ 
              for (var d = 0; d<position.length; d++){
                // console.log('x ',maze_x,' y ',maze_y);
                if(position[d][0] == maze_x && position[d][1] == maze_y){
                  responsetext = 'You can not walk the same route, you must modify,delete or insert.';
                  console.log(position[d][0],' ',position[d][1]);
                  repeat_flag = true;
                  console.log('access check repeat',repeat_flag); 
                }
              }
              position.push([maze_x,maze_y]);
            }else{
              responsetext = 'crashing ,you must modify,delete or insert';
              console.log('text clashing');
            }
            if (responsetext == 'You can not walk the same route, you must modify,delete or insert.'){
              position.pop();
              console.log('do function resetposition when repeat');
            }
          }
          num = distance*500;
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
          num = 500;
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
          num = 500;
        }
        // console.log('in compute sh arr Order ',arrayOrder);
        
      }
      // console.log(direction);
      // console.log(order);
      // console.log(distance);
      console.log("play_falg is ",play_flag);
      console.log(position);
    }

    function keepArrayOrder(){
      console.log('access keepArrayOrder');
      if (modify_flag){
        console.log('now mo array order is ',arrayOrder);
        console.log('no add array order');
        responsetext = 'say play for play your actor';
        modify_flag = false;
      }
      else if (insert_flag){
        console.log('now insert array order is ',arrayOrder);
        console.log('no add array order');
        responsetext = 'say play for play your actor';
        insert_flag = false;
      }
      else if (havetoDo_flag == false){  
        if (order == 'forward'||order == 'backward'){
          arrayOrder.push([order,distance]);
          if(repeat_flag){
            console.log('repeating ',repeat_flag);
            
            //resetArrayOrder(); 
          }
        }else if (order == 'left' || order == 'right'){
          arrayOrder.push([order,distance]);
        }
      }
      // sequence = arrayOrder.length;
      console.log('repeating check in funtion keepArray function ',repeat_flag);
      console.log('arrayOrder ',arrayOrder);
    }

    function deleteCode() {
      console.log('access delete code');
      number_deletecode = number_deletecode - 1 ;
      arrayOrder.splice(number_deletecode, 1);
      console.log('sh arr Order when delete already',arrayOrder);
      number_deletecode = number_deletecode + 1 ;
    }

    function playFunction() {
      console.log('access play function');
      position.splice(1, position.length);
      maze_x = 11;
      maze_y = 1;
      direction = 'E'; 
      // console.log('mo f ',modify_flag);
      // console.log('in_f '.insert_flag);
      console.log('position from play function ',position);
      console.log('arr order ',arrayOrder);
      for (var j = 0 ;j<arrayOrder.length;j++){
        order = arrayOrder[j][0];
        distance = arrayOrder[j][1];
        // console.log('from playfunction');
        ComputePosition();
        
        // console.log('order play ',order);
        // console.log('distance play ',distance);
      }
      var turntime = 300*arrayOrder.length;
      num = 500*position.length + turntime;
      order = null;
      distance = null;
      checkState();
      console.log('order play1 ',order);
      console.log('distance play1 ',distance);
      // play_flag = false;
    }

    function resetPosition(){
      console.log('access reset position');
      position.splice(1, position.length);
      console.log('resetPosition ',position);
      maze_x = 11;
      maze_y = 1;
      direction = 'E'; 
      modify_flag = false;
      insert_flag = false;
      delete_flag = false;    
    }

    function resetArrayOrder(){
      console.log('access reset array Order');
      arrayOrder.splice(0, arrayOrder.length);
      console.log('resetOrder ',arrayOrder);
      // order = null;
      // distance = null;
      // sequence = 0;
    }

   //ไม่ต้องย้ายกลับไปจุดเริ่มต้นเพราะ code อยู่ที่เดิม แต่ตำแหน่งเปลี่ยนสรุปว่าจะพูด code ต่อยังไงนะ งง ?
    function checkState(){
      console.log('access checkstate');
      if (state == 'maze1'){
        if (maze_x == 7 && maze_y == 5){
          responsetext = 'In the stage two, you must modify,delete or insert';
          state = 'maze2';
          resetPosition();
          console.log('position pasent ',position);
          havetoDo_flag = true;
        }
      }
      else if (state == 'maze2'){
        if (maze_x == 7 && maze_y == 3){
          responsetext = 'In the stage three, you must modify,delete or insert';
          state = 'maze3';
          resetPosition(position);
          console.log('position pasent ',position);
          havetoDo_flag = true;
        }
      }
      else if (state == 'maze3'){
        if (maze_x == 5 && maze_y == 3){
           responsetext = 'In the stage four, you must modify,delete or insert';
           state = 'maze4';
           resetPosition(position);
          console.log('position pasent ',position);
          havetoDo_flag = true;
        }
      }
      else if (state == 'maze4'){
        if (maze_x == 5 && maze_y == 5){
            responsetext = 'In the stage five, you must modify,delete or insert';
            state = 'maze5';
            resetPosition(position);
            console.log('position pasent ',position);
            havetoDo_flag = true;
        }
      }
      else if (state == 'maze5'){
        if (maze_x == 3 && maze_y == 1){
            responsetext = 'In the stage six, you must modify,delete or insert';
            state = 'maze6';
            resetPosition(position);
            console.log('position pasent ',position);
            havetoDo_flag = true;
        }
      }
      else if (state == 'maze6'){
        if (maze_x == 5 && maze_y == 7){
            responsetext = 'I keep key already'; 
        }
        else if (maze_x == 5 && maze_y == 9){  
          if (text == 'key'){
             responsetext = 'excellent!!';
             resetPosition(position);
            //  state = 'Q2';
            //  var randomtrees = Math.floor(Math.random() * 10) + 1;
            //  var randomstone = Math.floor(Math.random() * 10) + 1;
            //  io.emit('Q2',randomtrees,randomstone)
           } else {
             responsetext = 'You have to keep a key first';
           }
        }
      }
      console.log('responsetext from checkState is ',responsetext);
      // io.emit('state',state);
    }

    // console.log('order global ',order);
    // console.log('distance global ',distance);

    if(language == 'th'){
      if (responsetext == 'you can choose 1 or 2 only') {
        responsetext = 'เลือกได้เฉพาะเบอร์ 1 หรือ เบอร์ 2 เท่านั้นนะคะ';
      }
      else if (responsetext == 'you must use modify group order only.') {
        responsetext = 'ต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม เท่านั้นนะคะ'
      }
      else if (responsetext == 'You can not walk the same route, you must modify,delete or insert.') {
        responsetext = 'ไม่สามารถเดินชนเส้นทางเดิมได้ ต้องแก้ไขคำสั่งนี้ก่อนถึงจะเดินต่อได้น้า';
      }
      else if (responsetext == 'crashing ,you must modify,delete or insert'){
        responsetext = 'ไม่สามารถไปเส้นทางนี้ได้ ต้องแก้ไขคำสั่งนี้ก่อนถึงจะเดินต่อได้น้า';
      }
      else if (responsetext == 'say play for play your actor'){
        responsetext = 'พูดว่า เล่น เพื่อเดินตามคำสั่งใหม่ที่แก้เมื่อสักครู่นี้';
      }
      else if ( responsetext == 'In the stage two, you must modify,delete or insert'){
        responsetext = 'ด่าน 2 ต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม ก่อนนะ';
      }
      else if (responsetext == 'In the stage three, you must modify,delete or insert'){
        responsetext = 'ด่าน3แล้ว ต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม ก่อนนะ';
      }
      else if (responsetext == 'In the stage four, you must modify,delete or insert'){
        responsetext = 'ด่าน 4 แล้วต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม ก่อนนะ';
      }
      else if (responsetext == 'In the stage five, you must modify,delete or insert'){
         responsetext = 'เข้าสู่ด่าน 5 เลย ต้องใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม ก่อนนะ';
      }
      else if (responsetext == 'In the stage six, you must modify,delete or insert'){
        responsetext = 'ด่ายสุดท้ายต้องไปเก็บกุญแจโดยใช้คำสั่งแก้ไข ลบ หรือ เพิ่ม ก่อนนะ';
      }
      else if (responsetext == 'I keep key already'){
         responsetext = 'เก็บกุญแจได้แล้ว เดินไปหาประตูเลย'; 
      }
      else if (responsetext == 'you have to keep a key first'){
         responsetext = 'ต้องไปเก็บกุญแจก่อนมาไขประตูนะ';
      }
      else if (responsetext == 'excellent!!'){
         responsetext = 'เก่งมากเลย ทำสำเร็จทุกด่านแล้ว มารับรางวัลนะคะ';
      }
    }
  
    
    
    console.log('resq is ',responsetext);

    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
  
    console.log('show responseObj is ', responseObj);

  
    //emit to scratchX game and scratchX show log code 
    // if (modify_flag){
    //   number = number + 1 ;
    //   io.emit('modify',order,distance,number,modify_flag);
    // }
    // else if (insert_flag){
    //   number = number + 1 ;
    //   io.emit('insert',insert_flag,insert_position,number,order,distance);
    // }
    // else if (delete_code == null && play == null && reset == null && startgame == null && character == null ){
    //   console.log('arrOrder ',arrayOrder);
    //   sequence = arrayOrder.length;
    //   io.emit('chat',order,distance,sequence,insert_flag,modify_flag);
    // }
    console.log('lan ',language);
    console.log('order final ',order,' distance final ',distance);
    console.log('number of code modify',number);
    console.log('position insert ',insertPosition);
    console.log('state ',state);
    console.log('have to do ',havetoDo_flag);
    // console.log('seq ',sequence);
    // console.log('repeat_f ',repeat_flag);
    console.log("playF ",play_flag);
    io.emit('chat',order,distance,insert_flag,modify_flag,number,insert_position,delete_flag,play_flag,state,startgame,character,reset_flag,number_deletecode);
    io.emit('symbols',order,distance,state,reset_flag,modify_flag,insert_flag,delete_flag,number,number_deletecode,play_flag,insert_position,repeat_flag,crash_flag);
    order = null;
    distance = null;
    startgame = null;
    character = null;
    delete_flag = false;
    play_flag = false;
    number_deletecode = null;
    reset_flag = false;
    repeat_flag = false;
    crash_flag = false;
    
    // reset = null
    // var num = distance*1000;
    setTimeout(function(){
       console.log('send already');
       return res.json(responseObj);
    },num)
    console.log('num ',num);
    num = 500;
    console.log('num ',num);
    
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
     
