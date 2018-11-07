new (function() {

    var ext = this;
    var receive_data = false; 
    var direction ,distance , state , reset ;
    var modify , insert , deletes , seq ,seq_del, play ,positionInsert ;
  
  
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

          socket.on('symbols',function(direction_socket,distance_socket,state_socket,reset_socket,modify_socket ,
             insert_socket , deletes_socket , seq_socket ,seq_del_socket, play_socket ,positionInsert_socket ){
              console.log('direction is ',direction_socket);
              console.log('distance = ',distance_socket);
              console.log('state = ',state_socket);
              console.log('reset ',reset_socket);
              console.log('modify ',modify_socket);
              console.log('insert ',insert_socket);
              console.log('deletes ',deletes_socket);
              console.log('seq ',seq_socket);
              console.log('seq_del ',seq_del_socket);
              console.log('play ',play_socket);
              console.log('positionInsert ',positionInsert_socket);
              console.log('******************************');
              direction = direction_socket;
              distance = distance_socket;
              state = state_socket;
              reset = reset_socket;
              modify = modify_socket;
              insert = insert_socket;
              deletes = deletes_socket;
              seq = seq_socket;
              seq_del = seq_del_socket;
              play = play_socket;
              positionInsert = positionInsert_socket;
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
    
    ext.when_receive_data = function() {
       if (receive_data === true) {
           receive_data = false;
           return true;
       }

       return false;
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

    ext.get_direction = function(){
        return direction;
    }

    ext.get_distance = function(){
        return distance;
    }
    ext.get_state = function(){
        return state;
    }
    ext.get_reset = function(){
        return reset;
    }
    
    ext.get_insert = function(){
        return insert;
    }

    ext.get_modify = function(){
        return modify;
    }

    ext.get_deletes = function(){
        return deletes;
    }

    ext.get_positioninsert = function(){
        return positionInsert;
    }

    ext.get_seq = function(){
        return seq;
    }

    ext.get_play = function(){
        return play;
    }

    ext.get_seq_del = function(){
        return seq_del;
    }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['h', 'when receive message', 'when_receive_data'],
            ['', 'Set %s = %s', 'set_variable', 'name' , 'value'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_distance'],
            ['r', 'state', 'get_state'],
            ['r', 'reset', 'get_reset'],
            ['r', 'modify', 'get_modify'],
            ['r', 'insert', 'get_insert'],
            ['r', 'deletes', 'get_deletes'],
            ['r', 'seq', 'get_seq'],
            ['r', 'seq_del', 'get_seq_del'],
            ['r', 'play', 'get_play'],
            ['r', 'positionInsert', 'get_positionInsert'],
        ],
        menus: {
            name_mesg: ['name', 'question', 'answerQues' , 'stateOfMaze'],
           
          }
        
       
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();