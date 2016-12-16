var db = require("./database");
var settings = require("./../settings");
var nsfw = "yotsuba.css";
var sfw = "yotsubaB.css";

module.exports = {

  //render thread
  renderThread : function(req, res){
    var type = req.params.type;
    var board = req.params.board;

    db.connection.query("SELECT Title, thread.Board, board.Nsfw, thread.Closed FROM board, thread "
                   + "WHERE thread.Id=\"" + type + "\" AND "
                   + "board.Id=\"" + board + "\"", function(err, result){
      if(result[0] != null && result[0].Board == board){

        if(result[0].Nsfw){
          var css = nsfw;
        } else {
          var css = sfw;
        }

        if(result[0].Closed){
          res.render("closedThread", {
            theme: css,
            thread: type,
            board: board,
            title: "/" + board + "/ - " + result[0].Title
          });
          return;
        }

        res.render("thread", {
          theme: css,
          thread: type,
          board: board,
          title: "/" + board + "/ - " + result[0].Title
        });
      } else {
        res.render("default");
      }
    });
  },

  //render board
  renderBoard : function(req, res){
    var type = req.params.type;

    db.connection.query("SELECT Title, Nsfw FROM board WHERE Id=\"" + type + "\"", function(err, result) {
      if(result[0] == undefined){
        res.render("default");
        return;
      }

      if(result[0].Nsfw){
        var css = nsfw;
      } else {
        var css = sfw;
      }

      res.render("board", {
        theme: css,
        board: type,
        title: "/" + type + "/ - " + result[0].Title
      });
    });
  },

  //render catalog
  renderCatalog : function(req, res){
    var type = req.params.type;

    db.connection.query("SELECT Title, Nsfw FROM board WHERE Id=\"" + type + "\"", function(err, result) {
      if(result[0] == undefined){
        res.render("default");
        return;
      }

      if(result[0].Nsfw){
        var css = nsfw;
      } else {
        var css = sfw;
      }

      res.render("catalog", {
        theme: css,
        board: type,
        title: "/" + type + "/ - " + result[0].Title
      });
    });
  },

  renderHome : function(req, res){
      res.render("home");
  },

  renderPageNotFound : function(req, res){
      res.render("default");
  }
}
