var express = require('express');
var app = express();

// static files
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/client/build'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// enables HTML5Mode by forwarding missing files to the index.html
app.use('/*', express.static(__dirname + '/client/index.html'));

app.listen(6000, 'localhost', function() {
  console.log('server started');
});