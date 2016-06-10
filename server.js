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

//return amount of replies and images to in thread
app.get("/counter/:thread", function(req, res){
  connection.query("SELECT COUNT(post.Id) AS Posts, COUNT(post.Image) As Images, COUNT(post.Image) - ANY_VALUE(temp2.ShownImages) AS OmittedImages FROM post, ("
                 + "SELECT COUNT(temp.Images) As ShownImages FROM (SELECT Image AS Images FROM post WHERE Thread="+req.params.thread+" ORDER BY Id DESC LIMIT 5) AS temp"
                 +") AS temp2 WHERE Thread=" +req.params.thread , function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
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
  connection.query("SELECT Id, Title FROM board", function(err, result){
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

//return populair threads
app.get("/populair", function(req, res){
  connection.query("SELECT thread.*, board.Title FROM board, thread WHERE board.id=thread.Board ORDER BY UpdatedTime DESC LIMIT 12", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//return announcements
app.get("/announcements", function(req, res){
  connection.query("SELECT Comment FROM announcements WHERE CreationDate > NOW() - INTERVAL 1 DAY", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});


//return stats
app.get("/stats", function(req, res){
  connection.query("SELECT MAX(Id) AS Count FROM post", function(err, result){
    res.writeHead(200);
    res.end(JSON.stringify(result));
  });
});

//render thread
app.get("/:board/thread/:type", function(req, res){
  var type = req.params.type;
  var board = req.params.board;

  connection.query("SELECT Title, thread.Board FROM board, thread "
                 + "WHERE thread.Id=\"" + type + "\" AND board.Id=\"" + board + "\"", function(err, result){
    if(result[0] != null && result[0] != null && result[0].Board == board){
      res.render("thread", {
        thread: type,
        board: board,
        title: "/" + board + "/ - " + result[0].Title
      });
    } else {
      res.render("default");
    }
  });
});

//render board
app.get("/:type", function(req, res){
  var type = req.params.type;

  connection.query("SELECT Title FROM board WHERE Id=\"" + type + "\"", function(err, result) {
    if(result[0] == undefined){
      res.render("default");
      return;
    }

    res.render("board", {
      board: type,
      title: "/" + type + "/ - " + result[0].Title
    });
  });
});

//render catalog
app.get("/:type/catalog", function(req, res){
  var type = req.params.type;

  connection.query("SELECT Title FROM board WHERE Id=\"" + type + "\"", function(err, result) {
    if(result[0] == undefined){
      res.render("default");
      return;
    }

    res.render("catalog", {
      board: type,
      title: "/" + type + "/ - " + result[0].Title
    });
  });
});

app.get("/", function(req, res){
      res.render("home");
});

app.get("*", function(req, res){
      res.render("default");
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
