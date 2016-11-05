var multer = require("multer");
var mysql = require("mysql");
var settings = require("./../settings");

//set database connection variables
var connection = mysql.createConnection({
  host     : settings.getHost,
  user     : settings.getUser,
  password : settings.getPassword,
  database : settings.getDatabase
});


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, "public/uploads");
  },
  filename: function (req, file, callback) {
    var filetype = file.mimetype.split("/")[1];
    connection.query("SELECT MAX(Id)+1 AS Count FROM image", function(err, result){
      callback(null, result[0].Count + "." + filetype);
    });
  }
})

//posting
module.exports = function(app){
  app.post("/upload", multer({ storage: storage }).single("image"), function(req, res){
    console.log("upload request");

    //make it so that the database stays clean
    var name = "\"" + req.body.name + "\"";
    var subject = "\"" + req.body.subject + "\"";
    var comment = "\"" + req.body.comment + "\"";
    if(name == "\"\"") name = "NULL";
    if(subject == "\"\"") subject = "NULL";
    if(comment == "\"\"") comment = "NULL";
    if(req.body.spoiler){
      var spoiler = 1;
    } else {
      var spoiler = 0;
    }

    connection.query("SELECT GREATEST(MAX(post.Id), MAX(thread.id))+1 AS Id , "
                   + "MAX(image.Id)+1 AS ImageId FROM post, thread, image", function(err, result){
      if(req.body.type == "post"){
        post(req, res, result[0].Id, result[0].ImageId, name, comment, spoiler);
      } else {
        thread(req, res, result[0].Id, result[0].ImageId, name, subject, comment, spoiler);
      }
    });
  });
}

function post(req, res, id, imageid, name, comment, spoiler){
  console.log("post");
  if(req.file){
    connection.query("INSERT INTO post (Id, Name, Comment, Thread, ImageId) "
              + "VALUES (" + id + "," + name + ","
              + comment + ",\"" + req.body.belong + "\"," + imageid + ")");
    connection.query("INSERT INTO image (OriginalName, Extention, spoiler) VALUES (\""
                    + req.file.originalname + "\",\"" + req.file.mimetype.split("/")[1] + "\","
                    + spoiler + ")");
  } else {
    connection.query("INSERT INTO post (Id, Name, Comment, Thread) "
              + "VALUES (\"" + id + "\"," + name + ","
              + comment + ",\"" + req.body.belong + "\")");
  }
  connection.query("UPDATE thread SET UpdatedTime=NOW() WHERE Id=\""
              + req.body.belong + "\"");
  connection.query("SELECT Board FROM thread WHERE Id=\"" + req.body.belong + "\"", function(err, result){
    res.redirect("/" + result[0].Board + "/thread/" + req.body.belong);
  });
}

function thread(req, res, id, imageid, name, subject, comment, spoiler){
      console.log("thread");
      connection.query("INSERT INTO thread (Id, Name, Subject, Comment, Board, ImageId) "
                     + "VALUES (" + id + "," + name + "," + subject
                     + "," + comment + ",\"" + req.body.belong + "\"," + imageid + ")");
      connection.query("INSERT INTO image (OriginalName, Extention, Spoiler) VALUES (\""
                      + req.file.originalname + "\",\"" + req.file.mimetype.split("/")[1] + "\","
                      + spoiler + ")");
      res.redirect("/" + req.body.belong + "/thread/" + id);
}
