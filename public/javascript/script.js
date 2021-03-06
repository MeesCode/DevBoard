//default amount of posts in board
amount = 5;

//displayed file formats
imageFormats = ["svg", "bmp", "jpg", "jpeg", "gif", "png", "webp"];
videoFormats = ["mp4", "ogg", "webm"];

//dynamic stuff
//resize images when you click on them
function resize(id, index){
  var element = document.getElementById(id);
  media = element.getElementsByTagName("*")[index];
  if(media.style.maxHeight != "100%"){
    media.style.maxWidth = window.innerWidth - 90;
    media.style.maxHeight = "100%";
  } else {
    media.style.maxWidth = "";
    media.style.maxHeight = "";
  }
}

function spoiler(id, index, src){
  var element = document.getElementById(id);
  media = element.getElementsByTagName("*")[index];
  media.src = "/uploads/" + src;
  resize(id, index);
}

//make sure every thread has an image
$(function() {
    $('#boardForm').submit(function() {
        var input = document.getElementById("selectImage").value;
        if(input == ""){
          document.getElementById("boardForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: no file selected</p>";
          return false;
        }
        if(input.length > 2000){
          document.getElementById("threadForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: Comment too long (" + input2.length + "/2000)</p>";
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
          document.getElementById("threadForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: no file selected or comment given</p>";
          return false;
        }
        if(input2.length > 2000){
          document.getElementById("threadForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: Comment too long (" + input2.length + "/2000)</p>";
          return false;
        }
        return true;
    });
});

//make sure every post has either an image or a comment
$(function() {
    $("#quickreplyForm").submit(function() {
        var input1 = document.getElementById("selectImage").value;
        var input2 = document.getElementById("quickreplyComment").value;
        if(input1 == "" && input2 == ""){
          document.getElementById("quickreplyForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: no file selected or comment given</p>";
          return false;
        }
        if(input2.length > 2000){
          document.getElementById("quickreplyForm").innerHTML +=
            "<p style=\"color:red;align: center;\">ERROR: Comment too long (" + input2.length + "/2000)</p>";
          return false;
        }
        return true;
    });
});

//link a post
function postlinkThread(postId){
  if(!$( "#quickreply" ).dialog( "isOpen" )){
    $( "#quickreply" ).dialog( "open" );
    document.getElementsByClassName("ui-dialog")[0].style.top = "50px";
    document.getElementsByClassName("ui-dialog")[0].style.right = "50px";
  }
  var text = document.getElementById("quickreplyComment");
  text.value = text.value + ">>" + postId + "\n";
  text.focus();
}

function postlinkBoard(threadId, postId){
  $( "#quickreply" ).dialog({title: "Reply to thread No." + threadId});
  if(document.getElementById("threadId").value != threadId){
    var text = document.getElementById("quickreplyComment");
    text.value = "";
  }
  document.getElementById("threadId").value = threadId;
  postlinkThread(postId);
}

//initialize page
function init(type, boardId, threadId, page){
  if(type == "board" && (page == undefined || page == null || !Number.isInteger(page) || page < 1)){
    window.location = "/" + boardId;
    return;
  }
  if(type == "board")
    getPageCount(boardId, page);
  getBoardList();
  getHeaderImage();
  getThreads(type, boardId, threadId, page);
  getAnnouncements();
}

//get the amount of pages on a board
function getPageCount(boardId, page){
  $.getJSON("/api/pagecount/" + boardId, function(result){
    if(page < 1 || page > result[0].Count){
      window.location = "/dealWithItNerd";
      return;
    }
    var content = "";
    if(page != 1)
      content += "<a href=\"/" + boardId + "/" + (page - 1) + "\"><input type=\"button\" value=\"Previous\"></a> ";
    var div = document.getElementById("boardPage");
    for(var i = 1; i <= result[0].Count; i++){
      if(i == page)
        content += "[<span id=\"pageIndicator\">" + i + "</span>]";
      else
        content += "[<a href=\"/" + boardId + "/" + i + "\">" + i + "</a>]";
      
      content += " ";
    }
    if(result[0].Count != page)
      content += " <a href=\"/" + boardId + "/" + (page + 1) + "\"><input type=\"button\" value=\"Next\"></a>";
    content += "<a href=\"/" + boardId + "/catalog\"><span class=\"catalogButton\"> Catalog </span></a>";
    div.innerHTML = content;
  });
}


//get announcements
function getAnnouncements(){
  $.getJSON("/api/announcements", function(result){
    var div = document.getElementById("announcements");
    if(result.length == 0){
      return;
    }
    div.innerHTML = "<hr>";
    for(var i = 0; i < result.length; i++){
      div.innerHTML += "<b>" + result[i].Comment + "</b><br/>";
    }
  });
}

//get boardlists on the top and bottom of the page
function getBoardList(){
  $.getJSON("/api/boardlist", function(result){
    var list = "[ ";
    for(var i = 0; i < result.length; i++){
      list += "<a href=\"/" + result[i].Id + "\"> " + result[i].Id +"</a>";
      if(i+1 < result.length){
        list += " / ";
      }
    }
    list += " ] <span class=\"home\">[<a href=\"/\">Home</a>]</span>";
    document.getElementsByClassName("boardlist")[0].innerHTML = list;
    document.getElementsByClassName("boardlist")[1].innerHTML = list;
  });
}

//get header image
function getHeaderImage(){
  $.get("/api/header", function(result){
    document.getElementById("headerImage").innerHTML = "<img src=\"/images/headers/" + result + "\">";
  });
}

//get reply and image count per thread
function getCounter(id, boardId, callback){
  $.getJSON("/api/counter/" + id, function(counter){
    if(counter[0].Posts > amount){
      var thread = document.getElementById(id).getElementsByTagName("ul")[0];
      thread.innerHTML = "<div class=\"info omitted\">" + (counter[0].Posts - 5) + " replies and "
                       + counter[0].OmittedImages + " images omitted. "
                       + "<a href=\"/"+ boardId + "/thread/"+id+"\">Click here</a> to view.</div>"
                       + thread.innerHTML;
    }
  });
}

function getLines(id){
  var comment = document.getElementById(id).getElementsByClassName("threadComment")[0];
  var commentLines = comment.innerHTML.split("<br>");
  if(commentLines.length >= 15){
    var lines = "";
    for(var i = 0; i < 15; i++){
      lines += commentLines[i] + "<br>";
    }
    var info = "<div class=\"info longcomment\"> Comment too long. <a id=\"threadReply\" "
             + "onclick=\"getPostComment("+id+")\">Click here</a> to view the full text.</div>";
    var thread = document.getElementById(id).getElementsByTagName("ul")[0];
    comment.innerHTML = lines;
    thread.innerHTML = info + thread.innerHTML;
  }
}

function getPostComment(id){
  var comment = document.getElementById(id).getElementsByClassName("threadComment")[0];
  $.getJSON("/api/postcomment/" + id, function(result){
    comment.innerHTML = result[0].Comment;
  });
  var list = document.getElementById(id).getElementsByTagName("ul")[0];
  var info = document.getElementById(id).getElementsByClassName("longcomment")[0];
  list.removeChild(info);
}

function alertClosed(){
  alert("This thread is closed.");
}

//get threads
function getThreads(type, boardId, threadId, page){
  var query = "/api/threads/" + boardId;
  if(page != null && type == "board")
    query += "/" + page;
  if(type == "thread")
    query = "/api/thread/" + threadId;
  $.getJSON(query, function(result){
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

      if(result[i].Spoiler){
        var image = "<a onclick=\"spoiler(" + result[i].Id + ", 4,\'"+result[i].ImageId + "." + result[i].Extention +"\')\"><img src=\"/images/spoiler.jpg\"/></a>";
      } else if(videoFormats.indexOf(result[i].Extention) != -1) {
        var image = "<a onclick=\"resize(" + result[i].Id + ", 4)\""
                  + result[i].ImageId + "." + result[i].Extention +"\"><video controls preload=\"metadata\">"
                  + "<source src=\"/uploads/" +  result[i].ImageId + "." + result[i].Extention+"\" type=\"video/"+result[i].Extention+"\"/>"
                  + "</video></a>";
      } else if(imageFormats.indexOf(result[i].Extention) != -1){
        var image = "<a onclick=\"resize(" + result[i].Id + ", 4)\">"
          + "<img src=\"/uploads/" + result[i].ImageId + "." + result[i].Extention + "\"></a>";
      } else {
        var image = "<img src=\"/images/placeholder.jpg\"/>";
      }

      var filelink = "File: <u><a href=\"/uploads/" + result[i].ImageId + "." + result[i].Extention + "\"/>" + result[i].OriginalName + "</a></u>";
      var subject = "<p class=\"threadSubject\">" + result[i].Subject + " " +"</p>";
      var name = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
      var date = result[i].CreationTime.replace("T", " ").replace(".000Z", "")+" ";
      var reply = "[<a id=\"threadReply\" href=\"/" + boardId + "/thread/" + result[i].Id + "\">Reply</a>]";
      var comment = "<div class=\"threadComment\">" + result[i].Comment + "</div>";

      if(type == "thread"){
        if(!result[i].Closed){
          var id = "No.<a class=\"counter\" onclick=\"postlinkThread(" + result[i].Id + ")\">" + result[i].Id + "</a>   ";
        } else {
          var id = "No.<a class=\"counter\" onclick=\"alertClosed()\")\">" + result[i].Id + "</a>   ";
        }
      } else {
        if(!result[i].Closed){
          var id = "No.<a class=\"counter\" onclick=\"postlinkBoard(" + result[i].Id + ", " + result[i].Id + ")\">" + result[i].Id + "</a>   ";
        } else {
          var id = "No.<a class=\"counter\" onclick=\"alertClosed()\")\">" + result[i].Id + "</a>   ";
        }
      }

      var sticky = "";
      if(result[i].Pinned){
        var sticky = "<span class=\"sticky\"><img title=\"Sticky\" src=\"/images/sticky.gif\"></span>";
      }

      var closed = "";
      if(result[i].Closed){
        var closed = "<span class=\"closed\"><img title=\"Closed\" src=\"/images/closed.gif\"></span>";
      }

      if(type == "board"){
        li.innerHTML = filelink + "<br/>" + image + subject + name + date
                     + id + sticky + closed + reply + "<br/>" + "<br/>" + comment;
      }
      if(type == "thread"){
        li.innerHTML = filelink + "<br/>" + image + subject + name + date
                     + id + sticky + closed + "<br/>" + "<br/>" + comment;
      }

      document.getElementById("threads").appendChild(hr);
      document.getElementById("threads").appendChild(li);

      getPosts(type, boardId, result[i].Closed, result[i].Id, function(id){
        if(type == "board"){
          getCounter(id, boardId);
        }
        getLines(id);
        var posts = document.getElementById(id).getElementsByClassName("post");
        for(var j = 0; j < posts.length; j++){
          getLines(posts[j].id);
        }
      });
    }
  });
}

//get posts
function getPosts(type, boardId, closed, thread, callback){
  $.getJSON("/api/posts/" + thread, function(result){
    var postUl = document.createElement("ul");

    var postAmount = amount;
    if(type == "thread"){
      postAmount = Number.MAX_SAFE_INTEGER;
    }

    if(result.length >= postAmount){
      var start = result.length - postAmount;
    } else {
      var start = 0;
    }

    for(var i = start; i < result.length && i < start + postAmount; i++){
      var postIl = document.createElement("li");
      postIl.className = "post";
      postIl.id = result[i].Id;

      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      if(result[i].Spoiler){
        var image = "<a onclick=\"spoiler(" + result[i].Id + ", 7,\'"+result[i].ImageId + "." + result[i].Extention +"\')\"><img src=\"/images/spoiler.jpg\"/></a>";
      } else if(videoFormats.indexOf(result[i].Extention) != -1) {
        var image = "<a onclick=\"resize(" + result[i].Id + ", 7)\"><video controls  applypreload=\"metadata\">"
                  + "<source src=\"/uploads/" + result[i].ImageId + "." + result[i].Extention +"\" type=\"video/"+result[i].Extention+"\"/>"
                  + "</video></a>";
      } else if(imageFormats.indexOf(result[i].Extention) != -1){
        var image = "<a onclick=\"resize(" + result[i].Id + ", 7)\"><img src=\"/uploads/" + result[i].ImageId + "." + result[i].Extention + "\"></a>";
      } else {
        var image = "<img src=\"/images/placeholder.jpg\"/>";
      }

      var filelink = "File: <u><a href=\"/uploads/" + result[i].ImageId + "." + result[i].Extention + "\"/>" + result[i].OriginalName + "</a></u>";
      var name = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
      var date = result[i].CreationTime.replace("T", " ").replace(".000Z", "")+" ";
      var comment = "<div class=\"threadComment\">" + result[i].Comment + "</div>";

      if(type == "thread"){
        if(!closed){
          var id = "No.<a class=\"counter\" onclick=\"postlinkThread(" + result[i].Id + ")\"" + result[i].Id + "\">" + result[i].Id + "</a>   ";
        } else {
          var id = "No.<a class=\"counter\" onclick=\"alertClosed()\")\">" + result[i].Id + "</a>   ";
        }
      } else {
        if(!closed){
          var id = "No.<a class=\"counter\" onclick=\"postlinkBoard(" + result[i].Thread + ", " + result[i].Id + ")\">" + result[i].Id + "</a>   ";
        } else {
          var id = "No.<a class=\"counter\" onclick=\"alertClosed()\")\">" + result[i].Id + "</a>   ";
        }
      }

      if(result[i].ImageId != null){
        postIl.innerHTML += name + date + id + "<br/>" + filelink + "<br/>" + image + comment + "<ul></ul>";
      } else {
        postIl.innerHTML += name + date + id + "<br/>" + "<br/>" + comment + "<ul></ul>";
      }
      postUl.appendChild(postIl);
    }
    document.getElementById(thread).appendChild(postUl);
    callback(thread);
  });
}
