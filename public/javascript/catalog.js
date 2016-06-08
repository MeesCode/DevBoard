//get threads
function getCatalog(boardId){
  $.getJSON("/threads/" + boardId, function(result){
    for(var i = 0; i < result.length; i++){
      var li = document.createElement("li");
      li.className = "thread";
      li.id = result[i].Id;

      if(result[i].Subject == null) result[i].Subject = "";
      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      var mime = result[i].Image.split(".")[1];

      if(videoFormats.indexOf(mime) != -1) {
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].Id+"\"><video preload=\"metadata\">"
                  + "<source src=\"/uploads/" + result[i].Image +"\" type=\"video/"+mime+"\"/>"
                  + "</video></a>";
      } else if(imageFormats.indexOf(mime) != -1){
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].Id+"\"><img src=\"/uploads/" + result[i].Image + "\"></a>";
      } else {
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].Id+"\"><img src=\"/images/placeholder.jpg\"/></a>";
      }

      var subject = "<b>" + result[i].Subject + " </b>";

      li.innerHTML = image + "<span class=\"counter\"></span>" + subject + result[i].Comment;
      document.getElementById("threads").appendChild(li);

      getCounter(result[i].Id);
    }
  });
}

function getCounter(id){
  $.getJSON("/counter/" + id, function(counter){
    var thread = document.getElementById(id).getElementsByTagName("span")[0];
    thread.innerHTML += "<div class=\"info\">R: <b>" + counter[0].Posts + "</b> / I: <b>" + counter[0].Images + "</b></div>";
  });
}

//get boardlists on the top and bottom of the page
function getBoardListCatalog(){
  $.getJSON("/boardlist", function(result){
    var list = "[ ";
    for(var i = 0; i < result.length; i++){
      list += "<a href=\"/" + result[i].Id + "/catalog\"> " + result[i].Id +"</a>";
      if(i+1 < result.length){
        list += " / ";
      }
    }
    list += " ] [<a href=\"/\">Home</a>]";
    document.getElementsByClassName("boardlist")[0].innerHTML = list;
    document.getElementsByClassName("boardlist")[1].innerHTML = list;
  });
}
