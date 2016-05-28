
var http = require("http");
var express = require("express");
var app = express();

//create server
http.createServer(app).listen(8080);
app.use(express.static('static'));

app.get("/", function(req, res){
  console.log("page accessed");
  res.writeHead(200);
  res.write("test");
  res.end();
});
