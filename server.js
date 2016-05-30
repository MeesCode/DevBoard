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

//return one of the availible header images
app.get("/header", function(req, res){
  fs.readdir("public/images/headers/", function(err, result){
    res.writeHead(200);
    res.end(result[Math.round(Math.random() * (result.length-1))]);
  });
});

//return board list
app.get("/boardlist", function(req, res){
  connection.query("SELECT Id FROM board", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//return threads
app.get("/threads/:type", function(req, res){
  connection.query("SELECT * FROM thread WHERE Board=\""
                  + req.params.type + "\" ORDER BY UpdatedTime DESC", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//return posts
app.get("/posts/:type", function(req, res){
  connection.query("SELECT * FROM post WHERE Thread=\""
                  + req.params.type + "\"", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//render board
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
      connection.query("SELECT Board FROM thread WHERE Id=\"" + type + "\"", function(err, result2){
        connection.query("SELECT Title FROM board WHERE Id=\"" + result2[0].Board + "\"", function(err, result3){
          res.render("thread", {
            thread: type,
            board: result2[0].Board,
            title: "/" +result2[0].Board + "/ - " + result3[0].Title
          });
        });
      });
    } else {
      res.render("default", { type: type });
    }
  });
});

//posting
app.post("/upload", upload.single("image"), function(req, res){
  console.log("upload request");

  //make it so that the database stays clean
  var name = "\"" + req.body.name + "\"";
  var subject = "\"" + req.body.subject + "\"";
  var comment = "\"" + req.body.comment + "\"";
  if(name == "\"\"") name = "NULL";
  if(subject == "\"\"") subject = "NULL";
  if(comment == "\"\"") comment = "NULL";

  if(req.body.type == "post"){
    //POSTS

    //if there's an image upload
    if(req.file){
      //get id
      connection.query("SELECT MAX(Id) AS Id FROM post", function(err, result){
        var id = result[0].Id + 1;

        var mime = req.file.mimetype.split("/")[1];
        var query = "INSERT INTO post (Name, Subject, Comment, Thread, Image) "
                  + "VALUES (" + name + "," + subject
                  + "," + comment + "," + req.body.belong + ",\"" + id+"."+mime + "\")";
        connection.query(query);

        //put image in the right spot
        fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
      });
    }

    //if there is no image upload
    else {
      var query = "INSERT INTO post (Name, Subject, Comment, Thread) "
                + "VALUES (" + name + "," + subject
                + "," + comment + "," + req.body.belong + ")";
      connection.query(query);
    }

    //update thread update time
    //some stuff about timezones
    var query = "UPDATE thread SET UpdatedTime=NOW() WHERE Id=\""
                + req.body.belong + "\"";
    connection.query(query);

    //remove temporary entries

  }

  //THREADS
  else{
    console.log("thread");

    //add temporary thread to posts
    connection.query("INSERT INTO post (IsThread, Thread) VALUES (TRUE, 0)");

    //get id
    connection.query("SELECT MAX(Id) AS Id FROM post", function(err, result){
      var id = result[0].Id;

      var mime = req.file.mimetype.split("/")[1];
      var query = "INSERT INTO thread (Id, Name, Subject, Comment, Board, Image) "
                + "VALUES (" + id + "," + name + "," + subject
                + "," + comment + ",\"" + req.body.belong + "\",\"" + id+"."+mime + "\")";
      connection.query(query);

      //threads always have images
      var mime = req.file.mimetype.split("/")[1];
      fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
    });
  }
});
