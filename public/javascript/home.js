
//get boards
function getBoardListHome(){
  $.getJSON("/api/boardlist", function(result){
    var content = "";
    for(var i = 0; i < result.length; i++){
      content += "<a href=\"/" + result[i].Id + "\"> " + result[i].Title +"</a><br/>";
    }
    document.getElementById("boardlist").innerHTML = content;
  });
}

//get stats
function getStats(){
  $.getJSON("/api/stats", function(result){
    var postCount = "<b>Total Posts: </b>" + result[0].Count;
    var content  = postCount;
    document.getElementById("statcontent").innerHTML = content;
  });
}

//get threads
function getPopulairThreads(){
  $.getJSON("/api/popular", function(result){
    for(var i = 0; i < result.length; i++){
      var li = document.createElement("li");
      li.className = "thread";
      li.id = result[i].Id;

      if(result[i].Subject == null) result[i].Subject = "";
      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      if(videoFormats.indexOf(result[i].Extention) != -1) {
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].ImageId+"\"><video preload=\"metadata\">"
                  + "<source src=\"/uploads/" + result[i].ImageId + "." + result[i].Extention +"\" type=\"video/"+result[i].Extention+"\"/>"
                  + "</video></a>";
      } else if(imageFormats.indexOf(result[i].Extention) != -1){
        var image = "<a href=\"/"+result[i].Board+"/thread/"+result[i].Id+"\"><img src=\"/uploads/" + result[i].ImageId + "." + result[i].Extention + "\"></a>";
      } else {
        var image = "<a href=\"/"+result[i].Board+"/thread/"+result[i].Id+"\"><img src=\"/images/placeholder.jpg\"/></a>";
      }

      var subject = "<b>" + result[i].Subject + " </b>";
      var board = "<b>" + result[i].Title + " </b>";

      li.innerHTML = board + "<br/>" + image + "<br/>" + subject + result[i].Comment;
      document.getElementById("threads").appendChild(li);
    }
  });
}
