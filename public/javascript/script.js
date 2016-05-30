
//do initialization stuff
function init(board){
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

  //get threads
  $.getJSON("../threads/" + board, function(result){
    for(var i = 0; i < result.length; i++){
      var li = document.createElement("li");
      var hr = document.createElement("hr");
      li.className = "thread";

      var image = "<img src=\"../uploads/" + result[i].Image + "\">";
      var filelink = "File: <a href=\"" + "../uploads/" + result[i].Image + "\"/>" +result[i].Image + "</a>";
      var subject = "<p class=\"threadSubject\">" + result[i].Subject + " " +"</p>";
      var title = "<p class=\"threadName\">" + result[i].Name + " " +"</p>";
      var date = result[i].CreationDate.replace("T", " ").replace(".000Z", "")+" ";
      var id = "No.<a href=\"../thread/" + result[i].Id + "\">" + result[i].Id + "</a>   ";
      var reply = "[<a id=\"threadReply\" href=\"../thread/" + result[i].Id + "\">Reply</a>]";

      li.innerHTML = filelink + "<br/>" + image + subject + title + date
                   + id + reply + "<br/>" + "<br/>" + result[i].Comment;
      document.getElementById("threads").appendChild(hr);
      document.getElementById("threads").appendChild(li);
    }
  });

  //get header image
  $.get("/header", function(result){
    document.getElementById("headerImage").innerHTML = "<img src=\"/../images/headers/" + result + "\">";
  });
}
