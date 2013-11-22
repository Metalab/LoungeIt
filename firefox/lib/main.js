var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var simplePrefs = require("sdk/simple-prefs");
var contextMenu = require("sdk/context-menu");
var ico = simplePrefs.prefs.ScreenInvader + "/_inc/img/favicon.ico";
var Request = require("sdk/request").Request;

function loungeit(url) {
	tabs.open({
		url: simplePrefs.prefs.ScreenInvader + "/cgi-bin/show?" + url,
		inBackground:true,
		onLoad:function(tab){
			tab.close();
		}
	});
};

function create(icon){
	//Toolbar button
	var widget = widgets.Widget({
		id: "loungeit-button",
		label: "Lounge It!",
		contentURL: icon,
		onClick: function() {
			loungeit(tabs.activeTab.url);
		}
	});
	//Contextmenuitem for pages
	var pageMenuItem = contextMenu.Item({
		label: "Lounge Page!",
		image: icon,
		context: contextMenu.PageContext(),
		contentScript:'self.on("click", function(){' +
			'self.postMessage(null);' +
			'});',
		onMessage: function (foo){
			loungeit(tabs.activeTab.url);
		}
	});
	//Contextmenuitem for links
	var linkMenuItem = contextMenu.Item({
		label: "Lounge Link!",
		image: icon,
		context: contextMenu.SelectorContext('a[href]'),
		contentScript:'self.on("click", function(node){' +
			'self.postMessage(node.toString());' +
			'});',
		onMessage: function (url){
			loungeit(url);
		}
	});
	//Contextmenuitem for Images
	var imageMenuItem = contextMenu.Item({
		label: "Lounge Image!",
		image: icon,
		context: contextMenu.SelectorContext('img'),
		contentScript:'self.on("click", function(node){' +
			'self.postMessage(node.src);' +
			'});',
		onMessage: function (url){
			loungeit(url);
		}
	});
}
function refreshInvader() {
	var iconRequest = Request({
		url: simplePrefs.prefs.ScreenInvader + "/_inc/img/favicon.ico",
		onComplete: function (response) {
			if(response.status == 200)
				create(simplePrefs.prefs.ScreenInvader + "/_inc/img/favicon.ico");
		}
	}).get()
}

simplePrefs.on("ScreenInvader", refreshInvader);

refreshInvader()