
//get boards
function getBoardListHome(){
  $.getJSON("/boardlist", function(result){
    var content = "";
    for(var i = 0; i < result.length; i++){
      content += "<a href=\"/" + result[i].Id + "\"> " + result[i].Title +"</a><br/>";
    }
    document.getElementById("boardlist").innerHTML = content;
  });
}

//get stats
function getStats(){
  $.getJSON("/stats", function(result){
    var postCount = "<b>Total Posts: </b>" + result[0].Count;
    var content  = postCount;
    document.getElementById("statcontent").innerHTML = content;
  });
}

//get threads
function getPopulairThreads(){
  $.getJSON("/populair", function(result){
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
        var image = "<a href=\"/"+result[i].Board+"/thread/"+result[i].Id+"\"><img src=\"/uploads/" + result[i].Image + "\"></a>";
      } else {
        var image = "<a href=\"/"+result[i].Board+"/thread/"+result[i].Id+"\"><img src=\"/images/placeholder.jpg\"/></a>";
      }

      var subject = "<b>" + result[i].Subject + " </b>";
      var board = "<b>" + result[i].Title + " </b>";

      li.innerHTML = board + "<br/>" + image + "<span class=\"counter\"></span>" + subject + result[i].Comment;
      document.getElementById("threads").appendChild(li);
    }
  });
}