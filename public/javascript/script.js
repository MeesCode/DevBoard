
//do initialization stuff
function init(){
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
}
