//default amount of posts in board
amount = 5;

//dynamic stuff
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
    $("#threadForm").submit(function() {
        var input1 = document.getElementById("selectImage").value;
        var input2 = document.getElementById("threadComment").value;
        if(input1 == "" && input2 == ""){
          document.getElementById("threadForm").innerHTML += "<p style=\"color:red;align: center;\">ERROR: no file selected or comment given</p>";
          return false;
        }
        return true;
    });
});

//initialize page
function init(type, boardId, threadId){
  getBoardList();
  getHeaderImage();
  getThreads(type, boardId, threadId);
}

//get boardlists on the top and bottom of the page
function getBoardList(){
  $.getJSON("/boardlist", function(result){
    var list = "[ ";
    for(var i = 0; i < result.length; i++){
      list += "<a href=\"/" + result[i].Id + "\"> " + result[i].Id +"</a>";
      if(i+1 < result.length){
        list += " / ";
      }
    }
    list += " ]";
    document.getElementsByClassName("boardlist")[0].innerHTML = list;
    document.getElementsByClassName("boardlist")[1].innerHTML = list;
  });
}

//get header image
function getHeaderImage(){
  $.get("/header", function(result){
    document.getElementById("headerImage").innerHTML = "<img src=\"/images/headers/" + result + "\">";
  });
}

//get threads
function getThreads(type, boardId, threadId){
  $.getJSON("/threads/" + boardId, function(result){
    for(var i = 0; i < result.length; i++){
      if(type == "thread" && threadId != result[i].Id){
        continue;
      }
      var li = document.createElement("li");
      var hr = document.createElement("hr");
      li.className = "thread";
      li.id = result[i].Id;

      if(result[i].Subject == null) result[i].Subject = "";
      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      var mime = result[i].Image.split(".")[1];

      if(mime == "webm" || mime == "mp4" || mime == "ogg") {
        var image = "<a href=\"/uploads/" + result[i].Image +"\"><video>"
                  + "<source src=\"/uploads/" + result[i].Image +"\" type=\"video/"+mime+"\"/>"
                  + "</video></a>";
      } else if(mime == "jpeg" || mime == "gif" ||mime == "png" ||mime == "svg" || mime == "bmp"){
        var image = "<a href=\"/uploads/" + result[i].Image +"\"><img src=\"/uploads/" + result[i].Image + "\"></a>";
      } else {
        result[i].Image = null;
      }

      var filelink = "File: <u><a href=\"/uploads/" + result[i].Image + "\"/>" +result[i].Image + "</a></u>";
      var subject = "<p class=\"threadSubject\">" + result[i].Subject + " " +"</p>";
      var name = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
      var date = result[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
      var id = "No.<a href=\"/"+boardId+"/thread/" + result[i].Id + "\">" + result[i].Id + "</a>   ";
      var reply = "[<a id=\"threadReply\" href=\""+boardId+"/thread/" + result[i].Id + "\">Reply</a>]";
      var comment = "<div class=\"threadComment\">" + result[i].Comment + "</div>";

      if(type == "board"){
        li.innerHTML = filelink + "<br/>" + image + subject + name + date
                     + id + reply + "<br/>" + "<br/>" + comment;
      }
      if(type == "thread"){
        li.innerHTML = filelink + "<br/>" + image + subject + name + date
                     + id + "<br/>" + "<br/>" + comment;
      }

      document.getElementById("threads").appendChild(hr);
      document.getElementById("threads").appendChild(li);

      if(type == "board"){
        getPosts(result[i].Id, amount);
      }
      if(type == "thread"){
        getPosts(result[i].Id, Number.MAX_SAFE_INTEGER);
      }
    }
  });
}

//get posts
function getPosts(thread, amount){
  $.getJSON("/posts/" + thread, function(posts){
    var postUl = document.createElement("ul");

    if(posts.length >= amount){
      var start = posts.length - amount;
    } else {
      var start = 0;
    }
    for(var i = start; i < posts.length && i < start + amount; i++){
      var postIl = document.createElement("li");
      postIl.className = "post";
      postIl.id = posts[i].Id;

      if(posts[i].Image != null){
        var mime = posts[i].Image.split(".")[1];
      }

      if(posts[i].Name == null) posts[i].Name = "Anonymous";
      if(posts[i].Comment == null) posts[i].Comment = "";

      if(mime == "webm" || mime == "mp4" || mime == "ogg") {
        var image = "<a href=\"/uploads/" + posts[i].Image +"\"><video>"
                  + "<source src=\"/uploads/" + posts[i].Image +"\" type=\"video/"+mime+"\"/>"
                  + "</video></a>";
      } else if(mime == "jpeg" || mime == "gif" ||mime == "png" ||mime == "svg" || mime == "bmp"){
        var image = "<a href=\"/uploads/" + posts[i].Image +"\"><img src=\"/uploads/" + posts[i].Image + "\"></a>";
      } else {
        posts[i].Image = null;
      }

      var filelink = "File: <u><a href=\"/uploads/" + posts[i].Image + "\"/>" +posts[i].Image + "</a></u>";
      var name = "<p class=\"threadName\">" + posts[i].Name + " " +"</p>";
      var date = posts[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
      var id = "No.<a href=\"#" + posts[i].Id + "\">" + posts[i].Id + "</a>   ";
      var comment = "<div class=\"threadComment\">" + posts[i].Comment + "</div>";

      if(posts[i].Image != null){
        postIl.innerHTML = name + date + id + "<br/>" + filelink + "<br/>" + image + comment;
      } else {
        postIl.innerHTML = name + date + id + "<br/>" + "<br/>" + comment;
      }
      postUl.appendChild(postIl);
    }
    document.getElementById(thread).appendChild(postUl);
  });
}
