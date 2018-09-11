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
    var alarm_went_off = false; // This becomes true after the alarm goes off
    var direction ;
    var speed ;
//     var socket = io ();

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

          socket.on('chat',function(da,ta){
              console.log(da);
              console.log(ta);
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

    ext.set_alarm = function(time) {
       window.setTimeout(function() {
           alarm_went_off = true;
       }, time*1000);
    };

    ext.when_alarm = function() {
       // Reset alarm_went_off if it is true, and return true
       // otherwise, return false.
       if (alarm_went_off === true) {
           alarm_went_off = false;
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


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['', 'run alarm after %n seconds', 'set_alarm', '2'],
            ['h', 'when alarm goes off', 'when_alarm'],
            ['r', 'direction', 'get_direction'],
            ['r', 'speed', 'get_speed'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Speech extension', descriptor, ext);
})();