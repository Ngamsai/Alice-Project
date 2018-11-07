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
    var socket;
    var direction ,distance ;
    var start , character , mesg_reply , mesg_value , play , state , reset ;
    var modify,number;
    var number_delete;
    var positioninsert,insert;
  
  $(document).ready(function(){
    //load this script then .done text 
     $.getScript("https://alice-rescue.herokuapp.com/socket.io/socket.io.js").done(function(script, text){
       console.log(text)
       socket = io ('https://alice-rescue.herokuapp.com/');


          socket.on('connection', function (data) {
              console.log('connected');

          }); 

          socket.on('connect_error', function (data) {
              console.log(data);

          }); 

          socket.on('chat',function(direction_socket,distance_socket,insert_fl,modify_fl,number_chat,insert_position,delete_fl){
              console.log('direction is ',direction_socket)
              console.log('distance = ',distance_socket)
              console.log('number ',number_chat);
              console.log('position_insert ',insert_position);
              console.log('delete-fl ',delete_fl);
              console.log('******************************')
              direction = direction_socket;
              distance = distance_socket;
              number = number_chat;
              insert = insert_fl;
              modify = modify_fl;
              deletecode = delete_fl;
              positioninsert = insert_position;
              receive_data = true;
        });
       
        // socket.on('Q2',function(randomtrees_SK,randomstone_SK){
        //       if(randomtrees_SK != null ){
        //         console.log('num of trees in Q2 is ',randomtrees_SK)
        //       }
        //       if(randomstone_SK != null ){
        //         console.log('num of stones in Q2 is ',randomstone_SK)
        //       }
        //       console.log('******************************')
        //       trees = randomtrees_SK;
        //       stones = randomstone_SK;
        // });

        // socket.on('modify',function(order,distance_mod,number_mod,modify_f){
        //     console.log('order ',order);
        //     console.log('distance ',distance);
        //     console.log('number ',number_mod);
        //     console.log('modify_flag ',modify_flag);
        //     console.log('******************************');
        //     direction = order;
        //     distance = distance_mod;
        //     number  = number_mod;
        //     modify = modify_f;

        // });

        // socket.on('insert',function(insert_f,insert_position,number_in,order,distance){
        //     console.log('insert_flag is ',insert_flag);
        //     console.log('position ',insert_position);
        //     console.log('number ',number_in);
        //     console.log('order ',order);
        //     console.log('distance ',distance);
        //     insert = insert_f;
        //     positioninsert = insert_position;
        //     number = number_in;
        //     direction = order;
        //     distance = distance;
        // });

        // socket.on('deletecode',function(delete_code,number_de){
        //     console.log('delete ',delete_code);
        //     console.log('number ',number_de);
        //     deletecode = delete_code;
        //     number_delete = number_de;
        //     receive_data = true;
        // });

        socket.on('play',function(play_socket){
            console.log('say play ',play_socket);
            play = play_socket;
            receive_data = true;
        });

        socket.on('startgame',function(startgame_socket,character_socket){
            if(character_socket != null ){
                console.log('actor is ',character_socket);
            };
            if(startgame_socket != null ){
                console.log('status is ', startgame_socket);
            } 
            console.log('******************************');
            start = startgame_socket;
            character = character_socket;
            receive_data = true;
        
        });

        socket.on('reset',function(reset_socket){ 
            if(reset_socket != null ){
                console.log('reset is ',reset_socket);
            } 
            console.log('******************************');
            reset = reset_socket;
            receive_data = true;
        
        });

        socket.on('state',function(state_socket){  
            if(state_socket != null ){
                console.log('state is ',state_socket)
            }
            console.log('******************************');
            state = state_socket;
            receive_data = true;
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
        if (name_variable == 'play'){
          play = value_variable;
        }
        else if (name_variable == 'reset'){
            reset = value_variable;
        }
        else if (name_variable == 'modify'){
            modify = value_variable;
        }
        else if (name_variable == 'insert'){
            insert = value_variable;
        }
        else if (name_variable == 'delete'){
            deletecode = value_variable;
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
    
    ext.get_play = function(){
        return play;
    }

    ext.get_reset = function(){
        return reset;
    }
    
    ext.get_state = function(){
        return state;
    }
    

    ext.get_number = function(){
        return number;
    }

    ext.get_number_delete = function(){
        return number_delete;
    }

    // ext.get_sequence = function(){
    //     return sequence;
    // }

    ext.get_insert = function(){
        return insert;
    }

    ext.get_modify = function(){
        return modify;
    }

    ext.get_deletecode = function(){
        return deletecode;
    }

    ext.get_positioninsert = function(){
        return positioninsert;
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
            ['r', 'play', 'get_play'],
            ['r', 'reset', 'get_reset'],
            ['r', 'state', 'get_state'],
            ['r', 'number', 'get_number'],
            ['r', 'number_delete', 'get_number_delete'],
            ['r', 'insert', 'get_insert'],
            ['r', 'modify', 'get_modify'],
            ['r', 'deleteCode', 'get_deletecode'],
            ['r', 'positiOnInsert', 'get_positioninsert'],
        ],
      menus: {
        name_mesg: ['name', 'question', 'answerQues' , 'stateOfMaze'],
       
      }
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();