new (function() {

    var ext = this;
    var receive_data = false; 
    var direction ,distance ;
  
  
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

          socket.on('symbols',function(direction_socket,distance_socket){
              console.log('direction is '+direction_socket)
              console.log('distance = '+distance_socket)
              console.log('******************************')
              direction = direction_socket;
              distance = distance_socket;
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

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['h', 'when receive message', 'when_receive_data'],
            ['r', 'direction', 'get_direction'],
            ['r', 'distance', 'get_distance'],
        ]
       
    };
  
  


    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();