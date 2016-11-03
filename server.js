var fs = require("fs");
var http = require("http");
var multer = require("multer");
var express = require("express");
var mysql = require("mysql");
var ejs = require("ejs");
var api_routes = require("./api_routes");
var routes = require("./routes");
var setup = require("./setup");

var upload = multer({ dest: 'tmp/' });
var app = express();

//set views
app.set('views', __dirname + '/static/views');
app.set('view engine', 'ejs');

//create server
http.createServer(app).listen(setup.getPort);
app.use(express.static('public'));
app.use('/api', api_routes);
app.use('/', routes);

//set database connection variables
var connection = mysql.createConnection({
  host     : setup.getHost,
  user     : setup.getUser,
  password : setup.getPassword,
  database : setup.getDatabase
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
    console.log("post");

    //if there's an image upload
    if(req.file){
      //get id
      connection.query("SELECT MAX(Id) AS Id FROM post", function(err, result){
        var id = result[0].Id + 1;

        var mime = req.file.mimetype.split("/")[1];
        connection.query("INSERT INTO post (Name, Subject, Comment, Thread, Image) "
                  + "VALUES (" + name + "," + subject
                  + "," + comment + "," + req.body.belong + ",\"" + id+"."+mime + "\")");

        //put image in the right spot
        fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
      });
    }

    //if there is no image upload
    else {
      connection.query("INSERT INTO post (Name, Subject, Comment, Thread) "
                + "VALUES (" + name + "," + subject
                + "," + comment + "," + req.body.belong + ")");
    }

    //update thread update time
    //some stuff about timezones
    connection.query("UPDATE thread SET UpdatedTime=NOW() WHERE Id=\""
                + req.body.belong + "\"");

    connection.query("SELECT Board FROM thread WHERE Id=\"" + req.body.belong + "\"", function(err, result){
      res.redirect("/" + result[0].Board + "/thread/" + req.body.belong);
    });
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

      res.redirect("/" + req.body.belong + "/thread/" + id);

      //threads always have images
      var mime = req.file.mimetype.split("/")[1];
      fs.rename(req.file.path, "public/uploads/"+id+"."+mime);
    });
  }
});
