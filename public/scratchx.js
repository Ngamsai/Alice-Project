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
    var direction ,speed ,start , side , name , character , mesg , answer_Q2;
  
  
  $(document).ready(function(){
    //load this script then .done text 
     $.getScript("https://alice-project-nanearnano873492.codeanyapp.com/socket.io/socket.io.js").done(function(script, text){
       console.log(text)
       var socket = io ('https://Alice-Project-nanearnano873492.codeanyapp.com');


           socket.on('connection', function (data) {
              console.log('connected');

          }); 

          socket.on('connect_error', function (data) {
              console.log(data);

          }); 

          socket.on('chat',function(direction_socket,speed_socket,startgame_socket,turn_socket,name_socket,character_socket){
              console.log('direction is '+direction_socket)
              console.log('speed = '+speed_socket)
              console.log('status is '+ startgame_socket)
              console.log('turn ' + turn_socket)
              console.log('name is ' + name_socket)
              console.log('actor is '+character_socket)
              console.log('******************************')
              direction = direction_socket;
              speed = speed_socket;
              start = startgame_socket;
              name = name_socket;
              character = character_socket;
              side = turn_socket;
              receive_data = true;
              });
       
           socket.emit('resend',function(mesg){
              console.log('yaaaa',mesg)
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

    ext.set_reply_message = function(reply_message) {
        mesg = reply_message
        console.log('reply message = ' + mesg)
        return mesg;

    }; 
    
    ext.when_receive_data = function() {
       // Reset alarm_went_off if it is true, and return true
       // otherwise, return false.
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
    
    ext.get_name = function(){
        return name;
    }
    
    ext.get_character = function(){
        return character;
    }
    
    ext.get_answer_Q2 = function(){
        return answer_Q2;
    }


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['', 'Send message %s ', 'set_reply_message', 'default'],
            ['h', 'when receive message', 'when_receive_data'],
            ['r', 'start', 'get_start'],
            ['r', 'side', 'get_side'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_speed'],
            ['r', 'name', 'get_name'],
            ['r', 'character', 'get_character'],
            ['r', 'answer_Q2', 'get_answer_Q2'],
        ]
    };


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();