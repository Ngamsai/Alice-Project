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
var order,distance,startgame,turn,name,character,replay,ansQ2,forward_backward_direction,left_right_direction,anser,language;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/exam', (req, res) => {
  
    console.log("***************************************************************************************************")
//     console.log(req.body);
    if (!req.body) return res.sendStatus(400)
    var keep = req.body.queryResult.parameters;
    var responsetext = req.body.queryResult.fulfillmentText;
    console.log('res is ',responsetext);
    
 
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
  
  
    if (order != null && distance != null){
      if (language == 'th'){
        if (order == "ตรงไป"){
          order = "forward";
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
                  responsetext = 'ไม่สามารถเดินซ้ำเส้นทางเดิมได้ กลับไปเริ่มต้นอีกครั้ง';
                } 
              }
            }
            position.push([x,y]);
            if (responsetext == 'ไม่สามารถเดินซ้ำเส้นทางเดิมได้ กลับไปเริ่มต้นอีกครั้ง'){
                position.splice(1, position.length);
                x = -30;
                y = -143;
                direction = 'E';
            }
          }
        }
        else if (order == "ถอยหลัง"){
          order = "backward";
          for (var b=0; b<distance; b++){
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
                  responsetext = 'ไม่สามารถเดินซ้ำเส้นทางเดิมได้ กลับไปเริ่มต้นอีกครั้ง';
                } 
              }
            }
            position.push([x,y]);
            if (responsetext == 'ไม่สามารถเดินซ้ำเส้นทางเดิมได้ กลับไปเริ่มต้นอีกครั้ง'){
                position.splice(1, position.length);
                x = -30;
                y = -143;
                direction = 'E';
            }
          }
        }
        else if (order == "เลี้ยวซ้าย"){
          order = "left";
          for (var c=0; c<distance; c++){
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
        else if (order == "เลี้ยวขวา"){
          order = "right";
          for (var d=0; d<distance; d++){
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
      else if (language == 'en'){
        if (order == "forward"){
          order = "forward";
          for (var e=0; e<distance; e++){
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
            for (var k = 0; k<position.length; k++){
              if(position[k][0] == x){
                if (position[k][1] == y){
                  responsetext = 'start new';
                  position.splice(1, position.length);
                  x = -30;
                  y = -143;
                } 
              }
            }
            position.push([x,y]);
          }
        }
        else if (order == "backward"){
          order = "backward";
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
            for (var l = 0; l<position.length; l++){
              if(position[l][0] == x){
                if (position[l][1] == y){
                  responsetext = 'start new';
                  position.splice(1, position.length);
                  x = -30;
                  y = -143;
                } 
              }
            }
            position.push([x,y]);
          }
        }
        else if (order == "left"){
          order = "left";
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
          order = "right";
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
    }
  
    if (language == 'th'){
      if (state == 'maze1'){
        if (x == 141 && y == 28){
          responsetext = 'ไปยังด่านเขาวงกตที่ 2';
          state = 'maze2';
          position.splice(1, position.length);
          x = -30;
          y = -143;
          direction = 'E';
        }
      }
      else if (state == 'maze2'){
        if (x == 141 && y == 85){
          responsetext = 'ไปยังด่านเขาวงกตที่ 3';
          state = 'maze3';
          position.splice(1, position.length);
          x = -30;
          y = -143;
          direction = 'E';
        }
      }
      else if (state == 'maze3'){
        if (x == 27 && y == -86){
           responsetext = 'ไปยังด่านเขาวงกตที่ 4';
           state = 'maze4';
           position.splice(1, position.length);
           x = -30;
           y = -143;
           direction = 'E';
        }
      }
      else if (state == 'maze4'){
        if (x == 27 && y == 85){
            responsetext = 'ไปยังด่านเขาวงกตที่ 5';
            state = 'maze5';
            position.splice(1, position.length);
            x = -30;
            y = -143;
            direction = 'E';
        }
      }
      else if (state == 'maze6'){
        if (x == 141 && y == 28){
            responsetext = 'เก็บกุญแจได้แล้ว'; 
        }else 
            responsetext = 'ต้องไปเก็บกุญแจก่อนมาไขประตูนะ';

        if (x == 198 && y == 85){  
            for (var p = 0; p<position.length; p++){
              if(position[p][0] == x == 141){
                 if (position[p][1] == y == 28){
                   responsetext = 'จบด่านเขาวงกตแล้ว เก่งมากๆเลย';
                   position.splice(1, position.length);
                   x = -30;
                   y = -143;
                   state = 'Q2';
                   var randomtrees = Math.floor(Math.random() * 10) + 1;
                   var randomstone = Math.floor(Math.random() * 10) + 1;
                   io.emit('Q2',randomtrees,randomstone)
                 } 
               }
             } 
         }
      }
    }
  
    if (language == 'en'){
      if (state == 'maze1'){
        if (x == 141 && y == 28){
          responsetext = 'go to maze 2';
          state = 'maze2';
          position.splice(1, position.length);
          x = -30;
          y = -143;
          direction = 'E';
        }
      }
      else if (state == 'maze2'){
        if (x == 141 && y == 85){
          responsetext = 'go to maze 3';
          state = 'maze3';
          position.splice(1, position.length);
          x = -30;
          y = -143;
          direction = 'E';
        }
      }
      else if (state == 'maze3'){
        if (x == 27 && y == -86){
           responsetext = 'go to maze 4';
           state = 'maze4';
           position.splice(1, position.length);
           x = -30;
           y = -143;
           direction = 'E';
        }
      }
      else if (state == 'maze4'){
        if (x == 27 && y == 85){
            responsetext = 'go to maze 5';
            state = 'maze5';
            position.splice(1, position.length);
            x = -30;
            y = -143;
            direction = 'E';
        }
      }
      else if (state == 'maze6'){
        if (x == 141 && y == 28){
            responsetext = 'I keep key already'; 
        }else 
            responsetext = 'you have to keep a key frist';

        if (x == 198 && y == 85){  
            for (var r = 0; r<position.length; r++){
              if(position[r][0] == x == 141){
                 if (position[r][1] == y == 28){
                   responsetext = 'go to next state';
                   position.splice(1, position.length);
                   x = -30;
                   y = -143;
                   state = 'Q2';
//                    randomtrees = Math.floor(Math.random() * 10) + 1;
//                    randomstone = Math.floor(Math.random() * 10) + 1;
//                    io.emit('Q2',randomtrees,randomstone)
                 } 
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
  
    console.log('show responseObj is ', responseObj);

  
    //emit to scratchX game and scratchX show log code 
    io.emit('chat',order,distance,startgame,character,replay,ansQ2,state);
    io.emit('symbols',order,distance,state);
 
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
     
