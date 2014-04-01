// Copyleft (a) 2012. All rites reversed.

//http get request
function httpGet(url) {  
  //if the url exists send a get to the server
  if (url) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open( "GET", url, true );

    xmlHttp.send( null );
  }
}

function invadeScreen(url, tab1) {

  var ScreenInvaderIpOrUrl = localStorage["ip"] || "10.20.30.51";
      checkUrl = "";
      vidId = "";

  //make sure the ip is set if not set by the user using the options page
  localStorage["ip"] = ScreenInvaderIpOrUrl;
  
  chrome.tabs.getSelected(null, function(tab) {
    var checkUrl = false;

    tab = tab1 || tab;
    
    if (url) {
      if (url.url) {
        checkUrl = url.url;
      } else {
        checkUrl = url;
      }
    }

    if (!checkUrl) {
      checkUrl = tab.url;
    }
    
    //disabled for now.
    //~ if(isOnScreenInvader(checkUrl)) {
      //~ 
      //~ chrome.tabs.executeScript(null, {file: "playlists.js"});
      //~ 
      //~ return false;
    //~ }

    //stop youtube video
    if (checkUrl.indexOf('youtube') != -1 ) {
      //~ chrome.tabs.executeScript(null,{file:"youtube.js"});
      
      var vidArr = checkUrl.split("v=");
      
      if (vidArr[1].indexOf("&") > -1) {
        vidId = vidArr[1].split("&")[0]+'|youtube';
      } else {
        vidId = vidArr[1]+'|youtube';
      }
    }
    if (checkUrl.indexOf('youtu.be') != -1 ) {
      checkUrl = "https://youtube.com/watch?v="+checkUrl.split("e/")[1];
    }

    //stop vimeo video
    if(checkUrl.indexOf('vimeo') != -1) {
      chrome.tabs.executeScript(null,{file: "vimeo.js"});
      
      vidArr = checkUrl.split("/");
      
      vidId = vidArr[vidArr.length -1]+'|vimeo';
    }

    var urlToLoad = 'http://' + ScreenInvaderIpOrUrl + '/cgi-bin/show?' + checkUrl;
    
    //this requests the screenInvader to load a video or image
    httpGet(urlToLoad);
    
    if (!isOnScreenInvader(checkUrl)) {
           
      chrome.windows.getCurrent(function(win) {
        chrome.tabs.getAllInWindow(win.id, function(tabs) {
          //will be set if a tab with the correct ip is opened.
          var foundTab = false;
          
          for(var k in tabs) {

            if(tabs[k].url.indexOf(ScreenInvaderIpOrUrl) > -1) {
              foundTab = tabs[k];
              
              if(makeTrueOrFalse(localStorage["switchToTabOnLoad"])) {
                //switch to tab
                chrome.tabs.update(foundTab.id, {selected: true});
              }
              break;
            }
          }
          
          //if there is no tab, create it
          if ( !foundTab ) {
            chrome.tabs.create({
              url: 'http://' + ScreenInvaderIpOrUrl,
              selected: makeTrueOrFalse(localStorage['switchToTabOnLoad'])
            });
          }
          
          //~ chrome.tabs.executeScript(null, {file: "addtohistory.js"});
          
        });
      });  
    }
  });
}

function makeTrueOrFalse(value) {
  if (value && value !== "false") {
    return true;  
  }
  return false;
}


function isOnScreenInvader (url) {
  if (url.indexOf(localStorage["ip"]) > -1 ) {
    return true;
  } else {
    return false;
  }
}

//if the widget button gets clicked
chrome.browserAction.onClicked.addListener(invadeScreen);

chrome.contextMenus.create({"title": "Invade Screen", "contexts": ["all"], "onclick": function (info, tab) {
  var link = info.linkUrl || info.srcUrl || info.pageUrl;

  invadeScreen(link, tab);

}});
