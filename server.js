var fs = require("fs");
var http = require("http");
var multer = require("multer");
var express = require("express");
var mysql = require("mysql");
var ejs = require("ejs");

var upload = multer({ dest: 'tmp/' })
var app = express();

//set views
app.set('views', __dirname + '/static/views');
app.set('view engine', 'ejs');

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
  if(!err){
    console.log("Connected to database");
  } else {
    console.log("Could not connect to database");
    return;
  }
});

//return board listen
app.get("/boardlist", function(req, res){
  connection.query("SELECT Id FROM board", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//render board
//currently only /b/ and /g/ are there
app.get("/:type", function(req, res){
  var type = req.params.type;

  connection.query("SELECT Title FROM board WHERE Id=\"" + type + "\"", function(err, result) {
    if(result[0] == undefined){
      res.render("default", { type: type});
      return;
    }

    res.render("board", {
      board: type,
      title: "/" + type + "/ - " + result[0].Title
    });
  });
});

//render thread
app.get("/thread/:type", function(req, res){
  var type = req.params.type;
  var title = "empty";
  connection.query("SELECT Id FROM thread WHERE Id=\"" + type + "\"", function(err, result){
    if(result[0] != null){
      res.render("thread", {
        thread: type,
        title: title
      });
    } else {
      res.render("default", { type: type });
    }
  });
});

//posting
app.post("/upload", upload.single("image"), function(req, res){
  console.log("upload request");

  //get current highest id
  connection.query("select MAX(GREATEST(post.Id, thread.Id)) AS Id from thread, post", function(err, result) {

    //get id
    var id = result[0].Id;

    //make it so that the database stays clean
    var name = "\"" + req.body.name + "\"";
    var subject = "\"" + req.body.subject + "\"";
    var comment = "\"" + req.body.comment + "\"";
    if(name == "\"\"") name = "NULL";
    if(subject == "\"\"") subject = "NULL";
    if(comment == "\"\"") comment = "NULL";

    if(req.body.type == "post"){
      //POSTS

      console.log("post");
      if(id == null ) id = 1;
      id++;

      //if there's an image upload
      if(req.file){
        var query = "INSERT INTO post (Id, Name, Subject, Comment, Thread, HasImage) "
                  + "VALUES (" + id + "," + name + "," + subject
                  + "," + comment + "," + req.body.belong + ", 1)";
        connection.query(query);

        //put image in the right spot
        var mime = req.file.mimetype.split("/")[1];
        fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
      }

      //if there is no image upload
      else {
        var query = "INSERT INTO post (Id, Name, Subject, Comment, Thread, HasImage) "
                  + "VALUES (" + id + "," + name + "," + subject
                  + "," + comment + "," + req.body.belong + ", 0)";
        connection.query(query);
      }

      //update thread update time
      //some stuff about timezones
      var query = "UPDATE thread SET UpdatedTime=NOW() WHERE Id=\""
                  + req.body.belong + "\"";
      connection.query(query);
    }

    //THREADS
    else{
      if(id == null ) id = 0;
      id++;
      console.log("thread");
      var query = "INSERT INTO thread (Id, Name, Subject, Comment, Board) "
                + "VALUES (" + id + "," + name + "," + subject
                + "," + comment + ",\"" + req.body.belong + "\")";
      connection.query(query);

      //threads always have images
      var mime = req.file.mimetype.split("/")[1];
      fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
    }
  });
});
