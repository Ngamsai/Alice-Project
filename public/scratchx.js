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
    var direction ,speed ,start , side , character , mesg_reply , answer_Q2 , socket , mesg_value , replay;
  
  
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

          socket.on('chat',function(direction_socket,speed_socket,startgame_socket,turn_socket,character_socket,replay_socket,ansQ2_socket){
              console.log('direction is '+direction_socket)
              console.log('speed = '+speed_socket)
              console.log('status is '+ startgame_socket)
              console.log('turn ' + turn_socket)
              console.log('actor is '+character_socket)
              console.log('replay is '+replay_socket)
              console.log('ansQ2 is '+ansQ2_socket)
              console.log('******************************')
              direction = direction_socket;
              speed = speed_socket;
              start = startgame_socket;
              character = character_socket;
              side = turn_socket;
              receive_data = true;
              replay = replay_socket;
              answer_Q2 = ansQ2_socket;
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

    ext.get_speed = function(){
        return speed;
    }
    ext.get_start = function(){
        return start;
    }
    
    ext.get_side = function(){
        return side;
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


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['', 'Send message %m.name_mesg = %s ', 'set_reply_message', 'name' , 'fame'],
            ['h', 'when receive message', 'when_receive_data'],
            ['r', 'start', 'get_start'],
            ['r', 'side', 'get_side'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_speed'],
            ['r', 'character', 'get_character'],
            ['r', 'answer_Q2', 'get_answer_Q2'],
            ['r', 'replay', 'get_replay'],
        ],
      menus: {
        name_mesg: ['name', 'question2', 'answerQ2'],
       
      }
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();