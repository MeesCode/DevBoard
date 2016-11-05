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
    console.log(filetype);
    connection.query("SELECT MAX(Id) AS Count FROM image", function(err, result){
      if(!result[0]){
        callback(null, "0." + filetype);
      }
      callback(null, (result[0].Count + 1) + "." + filetype);
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

    if(req.body.type == "post"){

     //POSTS
      console.log("post");

        //get id
        connection.query("SELECT GREATEST(MAX(post.Id), MAX(thread.id)) AS Id FROM post, thread", function(err, result){
          if(!result[0]){
            var id = 1;
          }
          var id = result[0].Id + 1;
          console.log(id);

          if(req.file){
            //if there is an image upload
            connection.query("SELECT MAX(Id) AS Count FROM image", function(err, result){
              connection.query("INSERT INTO post (Id, Name, Comment, Thread, ImageId) "
                        + "VALUES (\"" + id + "\"," + name + ","
                        + comment + ",\"" + req.body.belong + "\"," + (result[0].Count + 1) + ")");
            });
            connection.query("INSERT INTO image (OriginalName, Extention) VALUES (\"" + req.file.filename + "\",\"" + req.file.mimetype.split("/")[1] + "\")");
          } else {
            //if there is no image upload
            connection.query("INSERT INTO post (Id, Name, Comment, Thread) "
                      + "VALUES (\"" + id + "\"," + name + ","
                      + comment + ",\"" + req.body.belong + "\")");
          }
        });

      //update thread update time
      connection.query("UPDATE thread SET UpdatedTime=NOW() WHERE Id=\""
                  + req.body.belong + "\"");

      //redirect to thread
      connection.query("SELECT Board FROM thread WHERE Id=\"" + req.body.belong + "\"", function(err, result){
        res.redirect("/" + result[0].Board + "/thread/" + req.body.belong);
      });
    }

    //THREADS
    else{
      console.log("thread");

      //get id
      connection.query("SELECT GREATEST(MAX(post.Id), MAX(thread.id)) AS Id FROM post, thread", function(err, result){
        if(!result[0]){
          var id = 1;
        }
        var id = result[0].Id + 1;
        console.log(id);

        connection.query("SELECT MAX(Id) AS Count FROM image", function(err, result){
          connection.query("INSERT INTO thread (Id, Name, Subject, Comment, Board, ImageId) "
                    + "VALUES (\"" + id + "\"," + name + "," + subject
                    + "," + comment + ",\"" + req.body.belong + "\"," + (result[0].Count + 1) + ")");
        });

        connection.query("INSERT INTO image (OriginalName, Extention) VALUES (\"" + req.file.filename + "\",\"" + req.file.mimetype.split("/")[1] + "\")");

        res.redirect("/" + req.body.belong + "/thread/" + id);
      });
    }
  });
}
