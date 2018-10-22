/* Extension demonstrating a hat block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */
// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http); //server
// $(document).ready(function(){
//     $('body').append($('<script src="https://alice-project-nanearnano873492.codeanyapp.com/socket.io/socket.io.js"></script>'));
// });
new (function() {

    var ext = this;
    var receive_data = false; 
    var direction ,distance ,start , side , character , mesg_reply , answer_Q2 , socket , mesg_value , replay , state , trees , stones ;
  
  
  $(document).ready(function(){
    //load this script then .done text 
     $.getScript("https://alice-project-nanearnano873492.codeanyapp.com/socket.io/socket.io.js").done(function(script, text){
       console.log(text)
       socket = io ('https://Alice-Project-nanearnano873492.codeanyapp.com');


          socket.on('connection', function (data) {
              console.log('connected');

          }); 

          socket.on('connect_error', function (data) {
              console.log(data);

          }); 

          socket.on('chat',function(direction_socket,distance_socket,startgame_socket,character_socket,replay_socket,ansQ2_socket,state_socket){
              if(direction_socket != null){
                console.log('direction is ',direction_socket)
              }  
              if(distance_socket != null){
                console.log('distance = ',distance_socket)
              }
              if(startgame_socket != null ){
                console.log('status is ', startgame_socket)
              } 
              if(character_socket != null ){
                console.log('actor is ',character_socket)
              } 
              if(replay_socket != null ){
                console.log('replay is ',replay_socket)
              } 
              if(ansQ2_socket != null ){
                console.log('ansQ2 is ',ansQ2_socket)
              }  
              if(state_socket != null ){
                console.log('ansQ2 is ',state_socket)
              }
              console.log('******************************')
              direction = direction_socket;
              distance = distance_socket;
              start = startgame_socket;
              character = character_socket;
              receive_data = true;
              replay = replay_socket;
              answer_Q2 = ansQ2_socket;
              state = state_socket;
        });
       
        socket.on('Q2',function(randomtrees_SK,randomstone_SK){
              if(randomtrees_SK != null ){
                console.log('num of trees in Q2 is ',randomtrees_SK)
              }
              if(randomstone_SK != null ){
                console.log('num of stones in Q2 is ',randomstone_SK)
              }
              console.log('******************************')
              trees = randomtrees_SK;
              stones = randomstone_SK;
        });
       
       
           
     });

   });
         

  
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.set_reply_message = function(name_mesg , value_message) {
      var message = {};
        console.log('Send message ' + name_mesg + ' = ' + value_message);
        message[ name_mesg ] = value_message;
        socket.emit('resend', message );
    }; 
  
   ext.set_variable = function(name_variable , value_variable) {
        if (name_variable == 'replay'){
          replay = value_variable;
        }
    };
    
    ext.when_receive_data = function() {
       if (receive_data === true) {
           receive_data = false;
           return true;
       }

       return false;
    };
  


    ext.get_direction = function(){
        return direction;
    }

    ext.get_distance = function(){
        return distance;
    }
    ext.get_start = function(){
        return start;
    }
      
    ext.get_character = function(){
        return character;
    }
    
    //answer for question 2 - number of tree.
    ext.get_answer_Q2 = function(){
        return answer_Q2;
    }
    
    ext.get_replay = function(){
        return replay;
    }
    
    ext.get_state = function(){
        return state;
    }
    
    ext.get_trees = function(){
        return trees;
    }
    
    ext.get_stones = function(){
        return stones;
    }


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['', 'Send message %m.name_mesg = %s ', 'set_reply_message', 'name' , 'fame'],
            ['', 'Set %s = %s', 'set_variable', 'name' , 'value'],
            ['h', 'when receive message', 'when_receive_data'],
            ['r', 'start', 'get_start'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_distance'],
            ['r', 'character', 'get_character'],
            ['r', 'answer_Q2', 'get_answer_Q2'],
            ['r', 'replay', 'get_replay'],
            ['r', 'state', 'get_state'],
            ['r', 'trees', 'get_trees'],
            ['r', 'stones', 'get_stones'],
        ],
      menus: {
        name_mesg: ['name', 'question', 'answerQues' , 'stateOfMaze'],
       
      }
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();