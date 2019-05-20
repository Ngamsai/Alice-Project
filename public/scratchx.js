new (function() {

    var ext = this;
    var receive_data = false; 
    var socket;
    var direction ,distance ;
    var start , character , play , state , reset ;
    var modify,number;
    var number_delete;
    var positioninsert,insert;
    var maze_state;
    var godmode;
  
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

          socket.on('chat',function(direction_socket,distance_socket,insert_fl,modify_fl,number_chat,insert_position,delete_fl,play_fl,state_socket,startgame_socket,
            character_socket,reset_fl,number_deletecode,maze_state_socket,godmode_socket){
              console.log('direction is ',direction_socket)
              console.log('distance = ',distance_socket)
              console.log('insert ',insert_fl);
              console.log('modify ',modify_fl);
              console.log('number ',number_chat);
              console.log('position_insert ',insert_position);
              console.log('delete-fl ',delete_fl);
              console.log('play ',play_fl);
              console.log('state is ',state_socket);
              console.log('start ',startgame_socket);
              console.log('char ',character_socket);
              console.log('reset ',reset_fl);
              console.log('num_delete ',number_deletecode);
              console.log('maze_state is',maze_state_socket);
              console.log('godmode ',godmode_socket);
              console.log('******************************')
              direction = direction_socket;
              distance = distance_socket;
              insert = insert_fl;
              modify = modify_fl;
              number = number_chat;
              positioninsert = insert_position;
              deletecode = delete_fl;
              play = play_fl;
              state = state_socket;
              start = startgame_socket;
              character = character_socket;
              reset = reset_fl;
              number_delete = number_deletecode;
              maze_state = maze_state_socket;
              godmode = godmode_socket;
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
        else if (name_variable == 'state'){
            state = value_variable;
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

    ext.get_maze_state = function(){
        return maze_state;
    }

    ext.get_godmode = function(){
        return godmode;
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
            ['r', 'positionInsert', 'get_positioninsert'],
            ['r', 'maze_state', 'get_maze_state'],
            ['r', 'godmode', 'get_godmode'],
        ],
      menus: {
        name_mesg: ['name' , 'stateOfMaze'],
       
      }
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();