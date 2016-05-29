
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
      li.className = "thread";
      li.innerHTML = result[i].Id + "<br />" + result[i].Name + "<br />"
                   + result[i].Subject + "<br />" + result[i].Comment + "<br />"
                   + result[i].CreationDate;
      document.getElementById("threads").appendChild(li);
    }
  });
}
