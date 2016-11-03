var mysql = require("mysql");
var settings = require("./../settings");

//set database connection variables
var connection = mysql.createConnection({
  host     : settings.getHost,
  user     : settings.getUser,
  password : settings.getPassword,
  database : settings.getDatabase
});

module.exports = {

  //render thread
  renderThread : function(req, res){
    var type = req.params.type;
    var board = req.params.board;

    connection.query("SELECT Title, thread.Board FROM board, thread "
                   + "WHERE thread.Id=\"" + type + "\" AND "
                   + "board.Id=\"" + board + "\"", function(err, result){
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
  },

  //render board
  renderBoard : function(req, res){
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
  },

  //render catalog
  renderCatalog : function(req, res){
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
  },

  renderHome : function(req, res){
      res.render("home");
  },

  renderPageNotFound : function(req, res){
      res.render("default");
  }
}
