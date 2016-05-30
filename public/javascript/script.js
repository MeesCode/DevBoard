
//make sure every thread has an image
$(function() {
    $('#boardForm').submit(function() {
        var input = document.getElementById("selectImage").value;
        console.log(input);
        if(input == ""){
          document.getElementById("boardForm").innerHTML += "<p style=\"color:red;align: center;\">ERROR: no file selected</p>";
          return false;
        }
        return true;
    });
});

//make sure every post has either an image or a comment
$(function() {
    $('#threadForm').submit(function() {
        var input1 = document.getElementById("selectImage").value;
        var input2 = document.getElementById("threadComment").value;
        if(input1 == "" && input2 == ""){
          document.getElementById("threadForm").innerHTML += "<p style=\"color:red;align: center;\">ERROR: no file selected or comment given</p>";
          return false;
        }
        return true;
    });
});

//NEEDS MASSIVE FUCKING CLEANUP OMG

//do initialization stuff
function initBoard(board){
  //get boardlists on the top and bottom of the page
  $.getJSON("../boardlist", function(result){
    var list = "[ ";
    for(var i = 0; i < result.length; i++){
      list += "<a href=\"../" + result[i].Id + "\"> " + result[i].Id +"</a>";
      if(i+1 < result.length){
        list += " / ";
      }
    }
    list += " ]";
    document.getElementsByClassName("boardlist")[0].innerHTML = list;
    document.getElementsByClassName("boardlist")[1].innerHTML = list;
  });

  //get header image
  $.get("/header", function(result){
    document.getElementById("headerImage").innerHTML = "<img src=\"/../images/headers/" + result + "\">";
  });

  //get threads and 5 posts from every thread
  $.getJSON("../threads/" + board, function(result){
    for(var i = 0; i < result.length; i++){
      var li = document.createElement("li");
      var hr = document.createElement("hr");
      li.className = "thread";
      li.id = result[i].Id;

      if(result[i].Subject == null) result[i].Subject = "";
      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      var image = "<img src=\"../uploads/" + result[i].Image + "\">";
      var filelink = "File: <a href=\"" + "../uploads/" + result[i].Image + "\"/>" +result[i].Image + "</a>";
      var subject = "<p class=\"threadSubject\">" + result[i].Subject + " " +"</p>";
      var name = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
      var date = result[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
      var id = "No.<a href=\"../thread/" + result[i].Id + "\">" + result[i].Id + "</a>   ";
      var reply = "[<a id=\"threadReply\" href=\"../thread/" + result[i].Id + "\">Reply</a>]";
      var comment = "<div class=\"threadComment\">" + result[i].Comment + "</div>";

      li.innerHTML = filelink + "<br/>" + image + subject + name + date
                   + id + reply + "<br/>" + "<br/>" + comment

      document.getElementById("threads").appendChild(hr);
      document.getElementById("threads").appendChild(li);

      $.getJSON("../posts/" + result[i].Id, function(posts){
        var postUl = document.createElement("ul");

        for(var i = 0; i < posts.length && i < 5; i++){
          var postIl = document.createElement("li");
          postIl.className = "post";

          if(posts[i].Name == null) posts[i].Name = "Anonymous";
          if(posts[i].Comment == null) posts[i].Comment = "";

          if(posts[i].Image == undefined){
            posts[i].Image == "joe";
          }
          var image = "<img src=\"../uploads/" + posts[i].Image + "\">";
          var filelink = "File: <a href=\"" + "../uploads/" + posts[i].Image + "\"/>" +posts[i].Image + "</a>";
          var name = "<p class=\"threadName\">" + posts[i].Name + " " +"</p>";
          var date = posts[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
          var id = "No.<a href=\"../thread/" + posts[i].Id + "\">" + posts[i].Id + "</a>   ";
          var comment = "<div class=\"threadComment\">" + posts[i].Comment + "</div>";

          if(posts[i].Image != null){
            postIl.innerHTML = name + date + id + "<br/>" + filelink + "<br/>" + image + comment
          } else {
            postIl.innerHTML = name + date + id + "<br/>" + "<br/>" + posts[i].Comment;
          }
          postUl.appendChild(postIl);
        }
        document.getElementById(posts[0].Thread).appendChild(postUl);
      });
    }
  });
}

function initThread(board, thread){
  //get boardlists on the top and bottom of the page
  $.getJSON("../boardlist", function(result){
    var list = "[ ";
    for(var i = 0; i < result.length; i++){
      list += "<a href=\"../" + result[i].Id + "\"> " + result[i].Id +"</a>";
      if(i+1 < result.length){
        list += " / ";
      }
    }
    list += " ]";
    document.getElementsByClassName("boardlist")[0].innerHTML = list;
    document.getElementsByClassName("boardlist")[1].innerHTML = list;
  });

  //get header image
  $.get("/header", function(result){
    document.getElementById("headerImage").innerHTML = "<img src=\"/../images/headers/" + result + "\">";
  });

  //get thread and all posts from thread
  $.getJSON("../threads/" + board, function(result){
    for(var i = 0; i < result.length; i++){
      if(thread == result[i].Id){
        var li = document.createElement("li");
        var hr = document.createElement("hr");
        li.className = "thread";
        li.id = result[i].Id;

        if(result[i].Subject == null) result[i].Subject = "";
        if(result[i].Name == null) result[i].Name = "Anonymous";
        if(result[i].Comment == null) result[i].Comment = "";

        var image = "<img src=\"../uploads/" + result[i].Image + "\">";
        var filelink = "File: <a href=\"" + "../uploads/" + result[i].Image + "\"/>" +result[i].Image + "</a>";
        var subject = "<p class=\"threadSubject\">" + result[i].Subject + " " +"</p>";
        var name = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
        var date = result[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
        var id = "No.<a href=\"../thread/" + result[i].Id + "\">" + result[i].Id + "</a>   ";
        var reply = "[<a id=\"threadReply\" href=\"../thread/" + result[i].Id + "\">Reply</a>]";
        var comment = "<div class=\"threadComment\">" + result[i].Comment + "</div>";

        li.innerHTML = filelink + "<br/>" + image + subject + name + date
                     + id + reply + "<br/>" + "<br/>" + comment

        document.getElementById("posts").appendChild(hr);
        document.getElementById("posts").appendChild(li);

        $.getJSON("../posts/" + result[i].Id, function(posts){
          var postUl = document.createElement("ul");

          for(var i = 0; i < posts.length; i++){
            var postIl = document.createElement("li");
            postIl.className = "post";

            if(posts[i].Name == null) posts[i].Name = "Anonymous";
            if(posts[i].Comment == null) posts[i].Comment = "";

            if(posts[i].Image == undefined){
              posts[i].Image == "joe";
            }
            var image = "<img src=\"../uploads/" + posts[i].Image + "\">";
            var filelink = "File: <a href=\"" + "../uploads/" + posts[i].Image + "\"/>" +posts[i].Image + "</a>";
            var name = "<p class=\"threadName\">" + posts[i].Name + " " +"</p>";
            var date = posts[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
            var id = "No.<a href=\"../thread/" + posts[i].Id + "\">" + posts[i].Id + "</a>   ";
            var comment = "<div class=\"threadComment\">" + posts[i].Comment + "</div>";

            if(posts[i].Image != null){
              postIl.innerHTML = name + date + id + "<br/>" + filelink + "<br/>" + image + comment
            } else {
              postIl.innerHTML = name + date + id + "<br/>" + "<br/>" + posts[i].Comment;
            }
            postUl.appendChild(postIl);
          }
          document.getElementById(posts[0].Thread).appendChild(postUl);
        });
      }
    }
  });
}
