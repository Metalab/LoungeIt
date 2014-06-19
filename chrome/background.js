// Copyleft (a) 2012. All rites reversed.

//http get request
function httpGet(url) {  
  //if the url exists send a get to the server
  if (url) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open( 'GET', url, true );

    xmlHttp.send( null );
  }
}

function slackOrInvade (url, tab1) {
	if ( booleanize( localStorage.redirectToSlackomatic ) ) {
		openOrSwitchTab(localStorage.slackomatic_ip, true);
	} else {
		invadeScreen(url, tab1);
	}
}

function invadeScreen(url, tab1) {

	var ScreenInvaderIpOrUrl = localStorage.ip || '10.20.30.44'
	  , checkUrl = ''
      , vidId = '';

  //make sure the ip is set if not set by the user using the options page
  localStorage.ip = ScreenInvaderIpOrUrl;
  
  chrome.tabs.getSelected(null, function(tab) {
    var checkUrl = false
	  , urlToLoad;

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

	if (checkUrl.indexOf('youtu.be') != -1 ) {
      checkUrl = 'https://youtube.com/watch?v=' + checkUrl.split('youtu.be/')[1];
    }
    //manipulate youtube video url
    if (checkUrl.indexOf('youtube') != -1 ) {
      
      var vidArr = checkUrl.split('v=');
      
      if (vidArr[1].indexOf('&') > -1) {
        vidId = vidArr[1].split('&')[0] + '|youtube';
      } else {
        vidId = vidArr[1]+'|youtube';
      }
    }

    

    //stop vimeo video
    if(checkUrl.indexOf('vimeo') != -1) {      
      vidArr = checkUrl.split('/');
      
      vidId = vidArr[vidArr.length -1] + '|vimeo';
    }

	urlToLoad = 'http://' + ScreenInvaderIpOrUrl + '/cgi-bin/show?' + checkUrl;
		
	//this requests the screenInvader to load a video or image instantly
	httpGet(urlToLoad);

    if ( ! isOnScreenInvader(checkUrl) ) {
		  openOrSwitchTab(ScreenInvaderIpOrUrl, booleanize( localStorage.switchToTabOnLoad ) );
    }
  });
}

function openOrSwitchTab (ip, switchTo) {
	chrome.windows.getCurrent(function(win) {
		chrome.tabs.getAllInWindow(win.id, function(tabs) {
			//will be set if a tab with the correct ip is opened.
			var foundTab = false;
			
			for(var k in tabs) {
				if ( tabs[k].url.indexOf(ip) > -1 ) {
					foundTab = tabs[k];
		  
					if ( switchTo ) {
						//switch to tab
						chrome.tabs.update(foundTab.id, {selected: true});
					}
					break;
				}
			}
	  
			//if there is no tab, create it
			if ( ! foundTab ) {
				chrome.tabs.create({
					url: 'http://' + ip,
					selected: booleanize(localStorage.switchToTabOnLoad)
				});
			}
		});
	});  
}

function booleanize(value) {
  if ( value && value !== 'false' ) {
    return value;
  }
  return false;
}


function isOnScreenInvader (url) {
  return url.indexOf(localStorage.ip) > -1 || url.indexOf(localStorage.slackomatic_ip) > -1;
}

//if the widget button gets clicked
chrome.browserAction.onClicked.addListener(slackOrInvade);

chrome.contextMenus.create({title: 'Invade Screen', contexts: ['all'], onclick: function (info, tab) {
  var link = info.linkUrl || info.srcUrl || info.pageUrl;

  invadeScreen(link, tab);
}});
