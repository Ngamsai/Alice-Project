new (function() {

    var ext = this;
    var receive_data = false; 
    var direction ,distance , state ;
  
  
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

          socket.on('symbols',function(direction_socket,distance_socket,state_socket){
              console.log('direction is ',direction_socket)
              console.log('distance = ',distance_socket)
              console.log('state = ',state_socket)
              console.log('******************************')
              direction = direction_socket;
              distance = distance_socket;
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
    ext.get_state = function(){
        return state;
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['h', 'when receive message', 'when_receive_data'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_distance'],
            ['r', 'state', 'get_state'],
        ]
       
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();