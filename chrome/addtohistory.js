var history = {title: "history", items: []}
    
if(localStorage.history){
  history = JSON.parse(localStorage.history);
}

var videoArr = window.location.href.split("#")[1].split("|");

var videoId = videoArr[0];
var provider = videoArr[1];

var url = "";

if (provider === "youtube") {
  url = 'https://www.youtube.com/watch?v='+videoId;
} else if (provider === "vimeo" ) {
  url = 'http://vimeo.com/'+videoId;
}

if(url) {
  history.items.push({url: url});

  localStorage.history = JSON.stringify(history);
}

var href = window.location.href.split("#");//window.location.href.split('#')[0];
window.location.href = href[0];
