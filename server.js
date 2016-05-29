var fs = require("fs");
var http = require("http");
var multer = require("multer");
var express = require("express");
var mysql = require("mysql");

var upload = multer({ dest: 'public/uploads/' })
var app = express();

//create server
http.createServer(app).listen(8080);
app.use(express.static('public'));

//set database connection variables
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "toor",
  database : "DevBoard"
});

//connect to database
connection.connect(function(err) {
  console.log("Connected to database");
});

//uploading files
app.post("/upload", upload.single("image"), function(req, res){
  console.log("upload request");

  //get current highest id
  connection.query("SELECT MAX(Id) AS Id FROM post", function(err, result) {

    //get id
    var id = result[0].Id;
    if(id == null ) id = 0;

    //make it so that the database stays clean
    var name = "\"" + req.body.name + "\"";
    var subject = "\"" + req.body.subject + "\"";
    var comment = "\"" + req.body.comment + "\"";
    if(name == "\"\"") name = "NULL";
    if(subject == "\"\"") subject = "NULL";
    if(comment == "\"\"") comment = "NULL";

    //if there's an image upload
    if(req.file){
      //get file extention
      var mime = req.file.mimetype.split("/")[1];

      var query = "INSERT INTO post (Name, Subject, Comment, HasImage) "
                + "VALUES (" + name + "," + subject
                + "," + comment + ", 1)";
      connection.query(query);
      fs.rename(req.file.path, "public/uploads/"+(id+1)+"."+mime);
    }

    //if there is no image upload
    else {
      var query = "INSERT INTO post (Name, Subject, Comment, HasImage) "
                + "VALUES (" + name + "," + subject
                + "," + comment + ", 0)";
      connection.query(query);
    }

  });
});
