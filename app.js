var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var postsApi = require('./api/posts');

var app = express();

// static files
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/client/dist'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// REST api
app.use(bodyParser.json());
app.use("/api/posts", postsApi);

// enables HTML5Mode by forwarding missing files to the index.html
app.use('/*', express.static(__dirname + '/client/index.html'));

var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, appEnv.bind, function() {
  console.log("server starting on " + appEnv.url);
});
