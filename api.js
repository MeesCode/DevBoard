var mysql = require("mysql");
var fs = require("fs");
var setup = require("./setup");

//set database connection variables
var connection = mysql.createConnection({
  host     : setup.getHost,
  user     : setup.getUser,
  password : setup.getPassword,
  database : setup.getDatabase
});


function clip(response, callback){
  for(var j = 0; j < response.length; j++){
    if(response[j].Comment != null){
      var commentLines = response[j].Comment.split("<br>");
      if(commentLines.length >= 15){
        var lines = "";
        for(var i = 0; i < 15; i++){
          lines += commentLines[i] + "<br>";
        }
        response[j].Comment = lines;
      }
    }
  }
  callback(response);
}

function regex(object, callback){

  for(var post in object){
    if(object[post].Comment != null){
      object[post].Comment = object[post].Comment.replace(/</g, "&lt");
      object[post].Comment = object[post].Comment.replace(/>>(\d+)/g, "<a href=\"#$1\">&gt&gt$1</a>");
      object[post].Comment = object[post].Comment.replace(/(\n|\r|^)>(.*)/g, "<span class=\"greentext\">$1&gt$2</span>");
      object[post].Comment = JSON.parse(JSON.stringify(object[post].Comment).replace(/\\n/g, "<br>"));
    }
  }
  callback(object);
}

module.exports = {

  //return amount of replies and images to in thread
  getCounter : function(req, res){
    connection.query("SELECT COUNT(post.Id) AS Posts, COUNT(post.Image) "
                   + "As Images, COUNT(post.Image) - ANY_VALUE(temp2.ShownImages) "
                   + "AS OmittedImages FROM post, (SELECT COUNT(temp.Images) As "
                   + "ShownImages FROM (SELECT Image AS Images FROM post WHERE "
                   + "Thread="+req.params.thread+" ORDER BY Id DESC LIMIT 5) AS temp"
                   +") AS temp2 WHERE Thread=" +req.params.thread , function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  },

  //return one of the availible header images
  getHeader : function(req, res){
    fs.readdir("public/images/headers/", function(err, result){
      res.writeHead(200);
      res.end(result[Math.round(Math.random() * (result.length-1))]);
    });
  },

  //return board list
  getBoardlist : function(req, res){
    connection.query("SELECT Id, Title FROM board", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  },

  //return post comment
  getPostComment : function(req, res){
    connection.query("SELECT IsThread FROM post WHERE Id=\""
                    + req.params.type + "\"", function(err, result){
        if(result[0].IsThread == 1){
          connection.query("SELECT Comment FROM thread WHERE Id=\""
                          + req.params.type + "\"", function(err, result){
            regex(result, function(response){
              res.writeHead(200);
              res.end(JSON.stringify(response));
            });
          });
        } else {
          connection.query("SELECT Comment FROM post WHERE Id=\""
                          + req.params.type + "\"", function(err, result){
            regex(result, function(response){
              res.writeHead(200);
              res.end(JSON.stringify(response));
            });
          });
        }
    });
  },

  //return threads
  getThreads : function(req, res){
    connection.query("SELECT * FROM thread WHERE Board=\""
                    + req.params.type + "\" ORDER BY UpdatedTime DESC", function(err, result){
        regex(result, function(response){
          clip(response, function(clip){
            res.writeHead(200);
            res.end(JSON.stringify(clip));
          });
      });
    });
  },

  //return posts (comments are clipped)
  getPosts : function(req, res){
    connection.query("SELECT * FROM post WHERE Thread=\""
                    + req.params.type + "\"", function(err, result){
      regex(result, function(response){
        clip(response, function(clip){
          res.writeHead(200);
          res.end(JSON.stringify(clip));
        });
      });
    });
  },

  //return popular threads
  getPopular : function(req, res){
    connection.query("SELECT thread.*, board.Title FROM board, thread "
                   + "WHERE board.id=thread.Board ORDER BY UpdatedTime "
                   + "DESC LIMIT 12", function(err, result){
      regex(result, function(response){
        clip(response, function(clip){
          res.writeHead(200);
          res.end(JSON.stringify(clip));
        });
      });
    });
  },

  //return announcements
  getAnnouncements : function(req, res){
    connection.query("SELECT Comment FROM announcements WHERE "
                     + "CreationDate > NOW() - INTERVAL 1 DAY", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  },


  //return stats
  getStats : function(req, res){
    connection.query("SELECT MAX(Id) AS Count FROM post", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  }
}
