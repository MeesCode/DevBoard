var fs = require("fs");
var db = require("./database");

//clip thread and post comments to max 15 lines
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

//change text so that it can be properly displayed on the web
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
    db.connection.query("SELECT COUNT(post.Id) AS Posts, COUNT(post.ImageId) "
                   + "As Images, COUNT(post.ImageId) - ANY_VALUE(temp2.ShownImages) "
                   + "AS OmittedImages FROM post, (SELECT COUNT(temp.Images) As "
                   + "ShownImages FROM (SELECT ImageId AS Images FROM post WHERE "
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
    db.connection.query("SELECT Id, Title FROM board", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  },

  //return post comment
  getPostComment : function(req, res){
    db.connection.query("SELECT Id FROM post WHERE Id=\""
                    + req.params.type + "\"", function(err, result){
        if(result[0] == undefined){
          db.connection.query("SELECT Comment FROM thread WHERE Id=\""
                          + req.params.type + "\"", function(err, result){
            regex(result, function(response){
              res.writeHead(200);
              res.end(JSON.stringify(response));
            });
          });
        } else {
          db.connection.query("SELECT Comment FROM post WHERE Id=\""
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
    db.connection.query("SELECT thread.*, image.OriginalName AS OriginalName, "
                    + "image.Extention AS Extention, image.Spoiler AS Spoiler FROM thread, image WHERE image.Id=thread.imageId AND Board=\""
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
    db.connection.query("SELECT post.*, image.OriginalName AS OriginalName, "
                   + "image.Extention AS Extention, image.Spoiler AS Spoiler "
                   + "FROM post LEFT JOIN image ON post.ImageId=image.Id WHERE Thread="
                   + req.params.type + " ORDER BY post.Id ASC", function(err, result){
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
    db.connection.query("SELECT board.Id AS Board, thread.Id, thread.Comment, "
                   + "thread.Name, thread.Subject, board.Title, image.Extention,"
                   + " thread.ImageId, image.Spoiler FROM board, thread LEFT JOIN image ON "
                   + "image.Id=thread.ImageId WHERE board.id=thread.Board ORDER BY"
                   + " UpdatedTime DESC", function(err, result){
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
    db.connection.query("SELECT Comment FROM announcements WHERE "
                     + "CreationTime > NOW() - INTERVAL 1 DAY", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  },


  //return stats
  getStats : function(req, res){
    db.connection.query("SELECT GREATEST(IFNULL(MAX(post.Id), 0), IFNULL(MAX(thread.id), 0)) AS Count FROM post, thread", function(err, result){
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  }
}
