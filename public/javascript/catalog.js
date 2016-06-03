//get threads
function getCatalog(boardId){
  console.log("gotten board request");
  $.getJSON("/threads/" + boardId, function(result){
    for(var i = 0; i < result.length; i++){
      console.log("gotten board request during");
      var li = document.createElement("li");
      li.className = "thread";
      li.id = result[i].Id;

      if(result[i].Subject == null) result[i].Subject = "";
      if(result[i].Name == null) result[i].Name = "Anonymous";
      if(result[i].Comment == null) result[i].Comment = "";

      var mime = result[i].Image.split(".")[1];

      if(mime == "webm" || mime == "mp4" || mime == "ogg") {
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].Id+"\"><video preload=\"metadata\">"
                  + "<source src=\"/uploads/" + result[i].Image +"\" type=\"video/"+mime+"\"/>"
                  + "</video></a>";
      } else if(mime == "jpeg" || mime == "gif" ||mime == "png" ||mime == "svg" || mime == "bmp"){
        var image = "<a href=\"/"+boardId+"/thread/"+result[i].Id+"\"><img src=\"/uploads/" + result[i].Image + "\"></a>";
      } else {
        var image = "<img src=\"/images/placeholder.jpg\"/>";
      }

      var subject = "<b>" + result[i].Subject + " " +"</b>";

      li.innerHTML = image + "<br/>" + subject + result[i].Comment;

      document.getElementById("threads").appendChild(li);
    }
    console.log("gotten board request ended");
  });
}
