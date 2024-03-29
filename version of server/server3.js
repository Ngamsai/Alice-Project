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
var state = 'startgame';
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
var maze_state = null;
var num = 500;
// var sequence = 0;
var tutorial_state = '0-0';
var order = null,distance = null ,forward_backward_direction = null,left_right_direction = null,direction_return = null;
var modify = null,delete_code = null,insert = null,play = null,reset = null,numberSequence = null,insertPosition = null,number = null,insert_position = null;
var number_deletecode = null ;
var startgame = null ,language;
var tutorial_two = null;
var tutorail_state_two = null;
var character;
var arrayOrder = [];
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
    
    forward_backward_direction = keep['conversation-use'];
    left_right_direction = keep['conversation-direction'];
    direction_return = keep['turn-around'];
    distance = keep['number-integer'];
    startgame = keep['conversation-gamecontrol'];
    play =keep['conversation-replay'];
    anser = keep.question;
    character = keep.actor;
    tutorial_two = keep.state;
    tutorail_state_two = keep['num-state']
    reset = keep.reset;
    modify = keep.modify;
    numberSequence = keep['number-modify'];
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
    // else if (direction_return != null ){
    //   order = direction_return;
    //   console.log('show return ',order);
    // }
    //show value
    if (req.body.queryResult.action =='input.welcome') {
      status_state = 0 ;
      state = 'startgame';
      havetoDo_flag = false;
      tutorial_state = '0-0';
      resetPosition();
      resetArrayOrder();
      console.log('all position when restart',position);
      console.log('array of order when restart',arrayOrder);
    }
    else if(order != null && distance != null){
      if (language == 'th'){
        if (order == "เดินหน้า"){
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
        // else if (order == "กลับหลังหัน"){
        //   order = "return";
        //   distance = '2';
        // }
      }
      console.log('sh order',order,'show distance ', distance);
      if (tutorial_state == null){
        ComputePosition();
        keepArrayOrder();
        checkState();
        status_state = 16;
      }else{
        console.log('will access tutorial');
      }
    }  
    else if(startgame != null && status_state == 0){
      status_state = 1 ;
      console.log('show start ' , startgame);
      // console.log('Do is ',havetoDo_flag);
    }
    else if (character != null) {
      if (status_state == 1){
        console.log('actor is ' ,character);
        if (character == "1" || character == "2" ){
          status_state = 2;
        }
        else{
          responsetext = 'you can choose 1 or 2 only';
        }
      }else {
        responsetext = 'Sorry, could you say that again?';
      }
    }
    else if(play != null){
      console.log('play is ',play);
      play_flag = true;
      if (status_state == 9){
        console.log('tutorial_state9_play_flag ',play_flag);
      }else if (status_state == 12){
        console.log('tutorial_state12_play_flag ',play_flag);
      }else if (status_state == 14){
        console.log('tutorial_state14_play_flag ',play_flag);
      }else  if  (status_state == 16) {
        playFunction();
      }else {
        play_flag = false;
      }
      // console.log('numberSequence ',numberSequence); 
    }
    else if(modify != null){
      modify_flag = true;
      number = numberSequence;
      if (status_state == 7) {
        console.log('tutorial_state7_mod_flag ',modify_flag,' num ',number);
      }else if (status_state == 16){
        console.log('tutorial_state16_mod_flag ',modify_flag,' num ',number)
      }else {
        modify_flag = false;
      }
      console.log('he will ',modify,'status-mod ',modify_flag,' in number ',numberSequence);
    }
    else if(delete_code != null){
      number_deletecode = numberSequence;
      delete_flag = true;
      if (status_state == 13){
        console.log('tutorial_state13_del_flag ',delete_flag,' num ',number_deletecode);
      }else  if (status_state == 16){
        console.log('tutorial_state16_del_flag ',delete_flag,' num ',number_deletecode)
        deleteCode();
      }else {
        delete_flag = false;
      }
      console.log('he will ',delete_code,'status-delete ',delete_flag,' delete_number ',numberSequence);
    }
    else if(insert != null){
      number = numberSequence;
      insert_position = insertPosition;
      insert_flag = true ;
      if (language == 'th'){
        if (insert_position == 'ก่อน'){
          insert_position = 'before';
        }
        else if (insert_position == 'หลัง'){
          insert_position = 'after';
        } 
      }
      console.log('he will ',insert,' ',insertPosition,' number ',numberSequence);
      if (status_state == 10){
        console.log('tutorial_state10_insert_flag ',insert_flag,' position ',insert_position,' number ',number);
      }else if (status_state == 16) {
        console.log('tutorial_state16_insert_flag ',insert_flag,' position ',insert_position,' number ',number);
      }else{
        number = null;
        insert_position = null;
        insert_flag = false ;
      }
    }
    else if(reset != null){
      if (status_state == 16){
        console.log('reset in true_state ',reset);
        reset_flag = true;
        resetPosition();
        resetArrayOrder();
      }
      console.log('reset ',reset);
    }
    else if (tutorial_two != null && tutorail_state_two != null){
      if (status_state == 6 && tutorial_two == 'ด่าน' && tutorail_state_two == 2){
        console.log('access state two ',tutorial_state,' at ',tutorail_state_two);
        num = 6000;
        state = 'tutorial_state2-1';
      }
    }
    // if (order != null && distance != null){
    //   if (language == 'th'){
    //     if (order == "เดินหน้า"){
    //       order = "forward";
    //     }
    //     else if (order == "ถอยหลัง"){
    //       order = "backward";
    //     }
    //     else if (order == "เลี้ยวซ้าย"){
    //       order = "left";
    //     }
    //     else if (order == "เลี้ยวขวา"){
    //       order = "right";
    //     }
    //   }
    // }

    console.log('state ',status_state);
    console.log('tutorial is ',tutorial_state);
   
    if (responsetext == 'ต่อไปจะเป็นการเรียนรู้วิธีการเล่นเกม ให้พูดตามนะ พูดว่า เลี้ยวขวา' ||  responsetext == 'Next, Will be learning how to play the game, Repeat after me, turn right') {
      tutorial_state = '1-1';
      state = 'tutorial_state1-1';
    }  
    else if (tutorial_state == '1-1' && status_state == 2) {
      if (order == 'right' && distance == '1') {
        responsetext = 'พูดว่า เลี้ยวซ้าย 1 ครั้ง';
        tutorial_state = '1-2';
        status_state = 3;
        state = 'tutorial_state1-2';
      }else {
        responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวขวา';
      }
    }
    else if (tutorial_state == '1-2' && status_state == 3) {
      if (order == 'left' && distance == '1') {
        responsetext = 'พูดว่า เดิน 2 ช่อง';
        tutorial_state = '1-3';
        status_state = 4;
      }else {
        responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย 1 ครั้ง';
      }
      state = null;
    }
    else if (tutorial_state == '1-3' && status_state == 4) {
      if (order == 'forward' && distance == '2') {
        responsetext = 'ให้พูดว่า ถอยหลัง';
        tutorial_state = '1-4';
        status_state = 5;
      }else {
        responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า 2 ช่อง';
      }
    }else if (tutorial_state == '1-4' && status_state == 5) {
      if (order == 'backward' && distance == '1') {
        responsetext = 'ไม่สามารถเดินทับเส้นทางเดิมได้  ต้องแก้ไขคำสั่งนี้ก่อนน้า เรียนคำสั่งแก้ไขได้ในด่านต่อไป พูดว่า ด่าน2'; 
        tutorial_state = '2-1';
        repeat_flag = true;
        status_state = 6;
      }else {
        responsetext = 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า ถอยหลัง'
      }
    } 
    else if (tutorial_state == '2-1' && status_state == 6) {
      if (tutorial_two == 'ด่าน' && tutorail_state_two == 2) {
        responsetext = 'ไม่สามารถเดินไปเส้นทางนี้ได้ ต้องแก้ไขคำสั่งนี้ก่อน  ให้พูดว่า แก้ไขบรรทัดที่1';
        crash_flag = true;
        status_state = 7;
        tutorial_state = '2-2';
      }else {
        responsetext = 'ถ้าจะเรียนต่อ ต้องพูดว่า ด่าน 2 น้า';//flow control ,action posiger
      }
    }
    else if (tutorial_state == '2-2' && status_state == 7) {
      if (modify_flag== true && number == '1'){
        responsetext = 'พูดคำสั่งที่ต้องการแก้ไขในบรรทัดที่ 1 มาเลย ให้พูดว่า เดินหน้า 3 ช่อง';
        tutorial_state = '2-3';
        status_state = 8;
      }else {
        responsetext = 'ต้องพูดว่า แก้ไขบรรทัดที่1นะ';
      }
      state = null;
    }
    else if (tutorial_state == '2-3' && status_state == 8) {
        if (order == 'forward' && distance == '3') {
          responsetext = 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่';
          tutorial_state = '2-4';
          status_state = 9;
        }else {
          responsetext = 'ถ้าจะให้ถูกต้องต้องพูดว่า เดินหน้า 3 ช่องนะคะ';
        }
    }
    else if (tutorial_state == '2-4' && status_state == 9) {
      if (play_flag == true) {
        num = 7000;
        responsetext  = 'ยินดีด้วยผ่านด่านแล้ว ต่อไปจะเรียนคำสั่งเพิ่มน้า ให้พูดว่า เพิ่มหลังบรรทัดที่ 1';
        crash_flag = true;
        tutorial_state = '3-1';
        status_state = 10;
        state = 'tutorial_state2-2';
      }else {
        responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
      }
    }
    else if (tutorial_state == '3-1' && status_state == 10) {
      if (insert_flag == true && insert_position == 'after' && number == '1'){
        responsetext = 'พูดคำสั่งที่ต้องการเพิ่มหลังบรรทัดที่ 1 มาเลย ให้พูดว่า เดินหน้า';
        tutorial_state = '3-2';
        status_state = 11;
      }else {
        responsetext = 'ต้องพูดว่า เพิ่มหลังบรรทัดที่1นะ';
      }
      state = null;
    }
    else if (tutorial_state == '3-2' && status_state == 11) {
      if (order == 'forward' && distance == '1') {
        responsetext = 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่';
        tutorial_state = '3-3';
        status_state = 12;
      }else {
        responsetext = 'ถ้าจะให้ถูกต้องต้องพูดว่า เดินหน้า นะคะ';
      }
    }
    else if (tutorial_state == '3-3' && status_state == 12) {
      if (play_flag == true) {
        num = 6000;
        responsetext  = 'ยินดีด้วยผ่านด่านแล้ว ต่อไปจะเรียนคำสั่งลบน้าจ๊ะ ให้พูดว่า ลบบรรทัดที่ 4';
        crash_flag = true;
        tutorial_state = '4-1';
        status_state = 13;
        state = 'tutorial_state2-3';
      }else {
        responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
      }
    }
    else if (tutorial_state == '4-1' && status_state == 13) {
      if (delete_flag == true && number_deletecode == '4') {
        responsetext = 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่';
        tutorial_state = '4-2';
        status_state = 14;
      }else {
        responsetext = 'แค่ลบบรรทัดที่ 4 ทิ้งนะ';
      }
      state = null;
    }
    else if (tutorial_state == '4-2' && status_state == 14) {
      if (play_flag == true) {
        num = 9000;
        responsetext = 'เรียนจบแล้วต่อไปเป็นการทดสอบน้า เดินเข้าประตูให้ครบ 6 ด่านนะจ๊ะ';
        status_state = 15;
        tutorial_state = null;
        state = 'maze1';
      }else {
        responsetext = 'ต้องพูดว่าเล่นใหม่ก่อนนะ';
      }
    }
    
    
    //when maze state will calculate this function
    // if (order != null && distance != null && tutorial_state == null && status_state == 18){
    //   ComputePosition();
    //   keepArrayOrder();
    //   checkState();
    //   status_state = 19;
    // }
    if (status_state == 15 ){
      maze_state = 'maze1';
    }
    if (havetoDo_flag == true && delete_flag == true){
      havetoDo_flag = false;
      console.log('havetoDo_delete ,',havetoDo_flag);
    }

    function ComputePosition (){
      console.log('compteposition access');
      if (havetoDo_flag && status_state == 16){
        console.log('havetoDo ,',havetoDo_flag);
        if (modify_flag == true || insert_flag == true || delete_flag == true || reset != null){
          havetoDo_flag = false;
          console.log('havetoDo ,',havetoDo_flag);
        }
        else{
          responsetext = 'you must use modify group order only.';
        }
        console.log("haveto ",havetoDo_flag);
      }
      if (modify_flag && status_state == 16){
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
      else if (insert_flag && status_state == 16){
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
      else if (havetoDo_flag == false || play_flag == true && status_state == 15){
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
              crash_flag = true;
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
        responsetext = 'say replay for replay your actor';
        modify_flag = false;
      }
      else if (insert_flag){
        console.log('now insert array order is ',arrayOrder);
        console.log('no add array order');
        responsetext = 'say replay for replay your actor';
        insert_flag = false;
      }
      else if (havetoDo_flag == false){  
        if (order == 'forward'||order == 'backward'){
          arrayOrder.push([order,distance]);
          // if(repeat_flag){
          //   console.log('repeating ',repeat_flag);
            
          //   //resetArrayOrder(); 
          // }
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
      var turntime = 500*arrayOrder.length;
      num = 800*position.length + turntime;
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
          responsetext = 'In the stage two';
          state = 'maze2';
          maze_state = 'maze2';
          console.log('position pasent ',position);
          console.log('maze_stste2 ',maze_state);
          // havetoDo_flag = true;
        }
      }
      else if (state == 'maze2'){
        if (maze_x == 7 && maze_y == 3){
          responsetext = 'In the stage three';
          state = 'maze3';
          maze_state = 'maze3';
          // resetPosition(position);
          console.log('position pasent ',position);
          console.log('maze_stste3 ',maze_state);
          // havetoDo_flag = true;
        }
      }
      else if (state == 'maze3'){
        if (maze_x == 5 && maze_y == 3){
           responsetext = 'In the stage four';
           state = 'maze4';
           maze_state = 'maze4';
          //  resetPosition(position);
          console.log('position pasent ',position);
          console.log('maze_stste4 ',maze_state);
          // havetoDo_flag = true;
        }
      }
      else if (state == 'maze4'){
        if (maze_x == 5 && maze_y == 5){
            responsetext = 'In the stage five';
            state = 'maze5';
            maze_state = 'maze5';
            // resetPosition(position);
            console.log('position pasent ',position);
            console.log('maze_stste5 ',maze_state);
            // havetoDo_flag = true;
        }
      }
      else if (state == 'maze5'){
        if (maze_x == 3 && maze_y == 1){
            responsetext = 'In the stage six';
            state = 'maze6';
            maze_state = 'maze6';
            // resetPosition(position);
            console.log('position pasent ',position);
            console.log('maze_stste6 ',maze_state);
            // havetoDo_flag = true;
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
    console.log('sh arr Order ',arrayOrder);
    console.log('sh position ',position);

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
      else if (responsetext == 'say replay for replay your actor'){
        responsetext = 'พูดว่า เล่นใหม่ เพื่อเดินตามคำสั่งใหม่ที่แก้เมื่อสักครู่นี้';
      }
      else if ( responsetext == 'In the stage two'){
        responsetext = 'ผ่านด่าน 1 แล้วไปด่าน 2 ต่อเลย';
      }
      else if (responsetext == 'In the stage three'){
        responsetext = 'ด่าน 3 แล้ว ดูดีๆนะแก้นิดเดียวเอง';
      }
      else if (responsetext == 'In the stage four'){
        responsetext = 'ด่าน 4 แล้ว ระวังนะ เดินทับเส้นทางเดิมไม่ได้นะ';
      }
      else if (responsetext == 'In the stage five'){
         responsetext = 'ไปต่อด่าน 5 เลย';
      }
      else if (responsetext == 'In the stage six'){
        responsetext = 'ด่านสุดท้ายต้องไปเก็บกุญแจก่อนน้า';
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

    if(language == 'en' || language == 'en-us'){
      if ( responsetext == 'พูดว่า เลี้ยวซ้าย 1 ครั้ง') {
        responsetext = 'Say , turn left 1 time';
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า 2 ช่อง'){
        responsetext = 'Still can not speak properly, you have to say forward 2 times';
      }
      else if (responsetext == 'พูดว่า เดินหน้า 1 ช่อง') {
        responsetext = 'Say , forward 1 time';
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย 1 ครั้ง'){
        responsetext = 'Still can not speak properly, you have to say turn left 1 time';
      }
      else if (responsetext == 'พูดว่า เลี้ยวขวา 2 ครั้ง') {
        responsetext = 'Say , turn right 2 times';
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า 1 ช่อง')  {
        responsetext = 'Still can not speak properly, you have to say go to forward 1 time'; 
      }
      else if ( responsetext == 'ทีนี้ ลองดูซิว่าจะเกิดอะไรขึ้น เมื่อเดินทับเส้นทางเดิม ให้พูดคำว่าเดินหน้า'){
        responsetext = "Let's see what happens , when walking the same path , To say forward";
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวขวา 2 ครั้ง') {
        responsetext = "Still can't speak properly, you have to say turn right 2 times";
      }
      else if (responsetext == 'ไม่สามารถเดินทับเส้นทางเดิมได้ ขอให้แก้ไขคำสั่งโดยพูดว่าแก้ไขบรรทัดที่5'){
        responsetext = "Can't walk over the same path, please edit the commands , you can say edit line number 5";
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เดินหน้า'){
        responsetext = "Still can't speak properly, you have to say  forward";
      }
      else if (responsetext == 'พูดสิ่งที่ต้องการเปลี่ยนในบรรทัดที่ 5 มาเลย ให้พูดว่า ถอยหลัง 1 ช่อง'){
        responsetext = "You can say , what do you want to edit commands  in line number 5 . Say backward 1 time";
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า แก้ไขบรรทัดที่ 5'){
        responsetext = "Still can't speak properly, you have to say edit line number 5";
      }
      else if (responsetext == 'ทีนี้ ลองให้ทำงานตามคำสั่งใหม่ทั้งหมดอีกครั้ง พูดว่า เล่นใหม่'){
        responsetext = "Try to work all new commands again. You have to say replay";
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า ถอยหลัง 1 ช่อง'){
        responsetext = "Still can't speak properly, you have to say backward 1 time";
      }
      else if (responsetext == 'ยินดีด้วยจบด่าน1แล้ว ทีนี้มาเล่นด่านที่2 สังเกตคำสั่งว่าตัวละครเดินมา 2 ช่องแล้ว ต่อไปให้พูดว่าเลี้ยวซ้าย'){
        responsetext = "Congratulations to the end of Stage 1.Come to play Stage 2 and Observe the commands that the characters walked in 2 times. Next , you can say turn left";
      }
      else if (responsetext == 'ต่อไปพูดว่าเดินหน้า แล้วสังเกตุว่าเกิดอะไรขึ้น'){
        responsetext = "Next, you say forward .Let's see what happens?";
      }
      else if (responsetext == 'ยังพูดไม่ถูกนะคะ ต้องพูดว่า เลี้ยวซ้าย'){
        responsetext = "Still can't speak properly, you have to say turn left";
      }
      else if (responsetext == 'ไม่สามารถเดินไปเส้นทางนี้ได้ ต้องแก้ไขคำสั่งนี้ก่อนให้พูดว่า เพิ่มหลังบรรทัดที่1'){
        responsetext = "Can not walk this route , you have to edit this command , say insert after line 1";
      }
      else if (responsetext == 'พูดคำสั่งที่ต้องการเพิ่มหลังบรรทัดที่ 1 มาเลย ให้พูดว่า เดินหน้า'){
        responsetext = "You can say , what do you want to insert commands  after  line number 1 . Say forward 1 time";
      }
      else if (responsetext == 'ต้องพูดว่า เพิ่มหลังบรรทัดที่1นะ'){
        responsetext = "Still can't speak properly, you have to say insert after line 1";
      }
      else if (responsetext == 'เปลี่ยนด่านใหม่เดินมาใกล้ประตูแล้ว จะเดินเข้าประตูต้องพูดว่า ถอยหลัง 1 ช่องนะ'){
        responsetext = "Change to stage 3 ,then you near the door. To walk into the door, say back 1 time";
      }
      else if (responsetext == 'ผ่านด่านมาแล้ว  ไม่สามารถเดินทับเส้นทางเดิมได้  ฉะนั้นด่านต่อไป ต้องพูดว่า ลบบรรทัดที่ 5'){
        responsetext = "Passed the stage 3 .Can not walk the same path , then you have to say delete line 5";
      }
      else if (responsetext == 'วิธีที่ง่ายที่สุดที่จะเดินเข้าประตูคือ ถอยหลัง 1 ช่องนะ'){
        responsetext = "The best way to walk into the door is back 1 time";
      }
      else if (responsetext == 'แค่ลบบรรทัดที่ 5 ทิ้งก็เข้าประตูได้แล้วนะ'){
        responsetext = "Just delete number 5";
      }
      else if (responsetext == 'เรียนจบแล้วต่อไปเป็นการทดสอบน้า เดินเข้าประตูให้ครบ 6 ด่านนะจ๊ะ'){
        responsetext = "Passed the test , Next walk into the door to complete 6 stage";
      }
      else if (responsetext == 'ต้องพูดว่าเล่นใหม่ก่อนนะ') {
        responsetext = 'Have to say replay first';
      }
      else if (responsetext == 'ถ้าจะให้ถูกต้องต้องพูดว่า เดินหน้า 1 ช่องนะคะ'){
        responsetext = 'If it is correct, I must say forward 1 time';
      }
    }
  
    
    
    console.log('resq is ',responsetext);

    //send response
    let responseObj = {   
                          "fulfillmentText":responsetext,
                        }
  
    console.log('show responseObj is ', responseObj);

    
    
    console.log('lan ',language);
    console.log('order final ',order,' distance final ',distance);
    console.log('number of code modify',number);
    console.log('position insert ',insertPosition);
    console.log('state ',state);
    console.log('have to do ',havetoDo_flag);
    console.log('maze_state ',maze_state);
    // console.log('seq ',sequence);
    // console.log('repeat_f ',repeat_flag);
    console.log("playF ",play_flag);
    io.emit('chat',order,distance,insert_flag,modify_flag,number,insert_position,delete_flag,play_flag,state,startgame,character,reset_flag,number_deletecode);
    io.emit('symbols',order,distance,state,reset_flag,modify_flag,insert_flag,delete_flag,number,number_deletecode,play_flag,insert_position,repeat_flag,crash_flag,maze_state);
    order = null;
    distance = null;
    startgame = null;
    character = null;
    delete_flag = false;
    play_flag = false;
    maze_state = null;
    number_deletecode = null;
    reset_flag = false;
    repeat_flag = false;
    crash_flag = false;

    if (tutorial_state == '2-3' && status_state == 8){
      modify_flag = false;
      number = null;
    }else if (tutorial_state == '3-2' && status_state == 11){
      insert_flag = false;
      insert_position = null;
      number =null;
    }
    
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

// สร่าง block เดินหน้า 3 เลี้ยวขวา แทนเป็น A ทำ A 4 ครั้ง  ต่อไป ทำ A โดยลดระยะลง 1 ทุกครั้ง ทำซ้อน block ซ้อน block
     
