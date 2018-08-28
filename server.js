var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
// viewed at http://localhost:8080
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/', (req, res) => {
    
    res.send('Hello World')
    console.log(req.body.queryResult.parameters);
    res.send('8585')
})
http.listen(port, function () {
    console.log('listening on *: ' + port);
});