

function showHidePlaylistInterface() {
   
  var showingPlaylist = localStorage.showplaylist;
  
  if(showingPlaylist === "true") {
    localStorage.showplaylist = "false";
    destroyPlaylistInterface();
  }else{
    localStorage.showplaylist = "true";
    makePlaylistInterface();
  }
}

showHidePlaylistInterface();


/************ PAINT AND REPAINT UI *******************************/

function makePlaylistInterface() {
  console.log("makePlaylistInterface");
  //~ 
  //~ localStorage.playlists = "";
  
  if(!localStorage.playlists) {
    
    localStorage.playlists =  JSON.stringify(
                                [{title: "first playlist", items: [
                                  {name: "awesome video playlist 1 item 1", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                                  {name: "awesome video playlist 1 item 2", url: "https://www.youtube.com/watch?v=h8WiyX21A1c"}
                                ]},
                                {title: "second playlist", items: [
                                  {name: "awesome video playlist 2 item 1", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                                  {name: "awesome video playlist 2 item 2", url: "https://www.youtube.com/watch?v=h8WiyX21A1c"}
                                ]}]
                              );
                              
    //~ console.log(localStorage.playlists);
    //~ console.log(JSON.parse(localStorage.playlists));
  }
  

  var parent = document.getElementById("playlist_panel").parentNode;

  var parentHTML = parent.innerHTML;

  var htmlToAdd = '<div id="user_playlist_panel">' +
                    '<table id="user_playlist-control"> ' +
                      '<tbody>';
                      
  //userPlaylist = "playlist_title##video1name|video1url||video2name|video2url||...
  var playlists = deLocalStorePlaylists();
  
  var playlistHTML =  '<tr>'+
                        '<th><span>Playlists:</span> <button class="create_playlist toggle">create playlist</button></th>'+
                        '<th><button class="show_history toggle" data-id="history">show history</button></th>'+
                        '<th><button class="delete_history toggle">delete history</button></th>'+
                      '</tr>';
  
  for(var id in playlists) {
    playlistHTML += "<tr>";
    playlistHTML += '<td><span>playlist: '+playlists[id].title+' Songs:'+playlists[id].items.length+'</span> <button data-id="'+id+'" class="show_playlist_button toggle" style="width:auto;">show</button></td><td><button class="delete_playlist_button toggle" data-id="'+id+'">delete</button></td>';
    playlistHTML += "</tr>";
  }

  htmlToAdd += playlistHTML;
  htmlToAdd +=        '</tbody>' +
                    '</table>' +
                    '<table>'+
                      '<tbody id="current_playlist">'+
                      '</tbody>'+
                    '</table>'+
                  '</div>';

  parent.innerHTML = htmlToAdd + parent.innerHTML;
  
  addButtonEventListeners("show_playlist_button", showEventedPlaylist);
  
  addButtonEventListeners("show_history", showHistory);
  
  addButtonEventListeners("delete_history", deleteHistory);
  
}

function addButtonEventListeners(classname, callback) {
  
  var buttons = document.getElementsByClassName(classname);
  
  for(var key in buttons) {
    if(buttons[key].addEventListener) {
      
      buttons[key].addEventListener("click", callback);
    }
  }
}

function showEventedPlaylist(evt) {
    var id = evt.target.dataset.id;
    showPlaylist(id);
}

function showPlaylist(id) {
  var playlist = false;
  
  if(id == "history") {
    var history = JSON.parse(localStorage.history);
    if(history) {
      playlist = history;
    } else if(!playlist.title) {
      playlist.title = "No items in history yet";
    }
  }else{
    
    var playlists = deLocalStorePlaylists();
    playlist = playlists[id];
  }
  
  var htmlEle = document.getElementById("current_playlist");
  
  if(playlist) {
    
    var html = '<tr><th>'+playlist.title+'</th></tr>';
    
    var itms = playlist.items
    for (var key in itms) {
      var item = itms[key];
      
      
      html += '<tr>'+
                '<td>'+
                  item.name+
                '</td>'+
                '<td>'+
                  '<a style="color:#999;" href="'+item.url+'" target="utopia">'+item.url+'</a>'+
                '</td>'+
                '<td>'+
                  '<button id="delete_btn_'+id+"_"+key+'" class="playlist_item_delete_btn toggle" data-itemid="'+key+'" data-playlistid="'+id+'">delete</button>'+
                '</td>'+
              '</tr>';
              
      
    }
    
    htmlEle.innerHTML = html;
    
    addButtonEventListeners("playlist_item_delete_btn", deletePlaylistItem);
  }
}


function destroyPlaylistInterface() {
  
  console.log("destroyPlaylistInterface");
  var Node1 = document.getElementById("playlist_panel").parentNode;
  var len = Node1.childNodes.length;
   
  for(var i = 0; i < len - 1; i++) {   
    if(Node1.childNodes[i].id == "user_playlist_panel" || Node1.childNodes[i].id === "user_playlist_controls") {
      Node1.removeChild(Node1.childNodes[i]);
    }
  }
  
}



/*********************** STORE AND LOAD PLAYLISTS ********************/


function deLocalStorePlaylists() {
  var playlistsArr = JSON.parse(localStorage.playlists);

  return playlistsArr;
}

function localStorePlaylists(playlists) {
  
  var pls = [];

  for (var plid in playlists) {
    var playlist = playlists[plid];
    
    if(playlist.title) {
      var items = [];
      
      for(var itemid in playlist.items) {
        var item = playlist.items[itemid];
        if (item && item.url) {
          items.push(item);
        }
      }
      playlist.items = items;
      
      pls.push(playlist);
    }
  }
  
  localStorage.playlists = JSON.stringify(pls);
}



/*********************** EDIT AND DELETE PLAYLIST ITEMS ********************/


function deletePlaylistItem(evt) {
  console.log("delete playlistitem event =");
  console.log(evt);
  var itemid = evt.target.dataset.itemid;
  var playlistid = evt.target.dataset.playlistid;
  
  if(playlistid == "history") {
    var history = JSON.parse(localStorage.history);
    
    var hist_items = [];
    
    for(var i = 0; i < history.items.length; i++) {
      if(i != itemid) {
        hist_items.push(history.items[itemid]);
      } 
    }
    history.items = hist_items;
    localStorage.history = JSON.stringify(history);
    
  }else{
    var playlists = deLocalStorePlaylists();
  
    playlists[playlistid].items[itemid] = false;
  
    localStorePlaylists(playlists);
  }
  
  showPlaylist(playlistid);
}



/*********************** EDIT, SAVE AND DELETE HISTORY **************/

function showHistory() {
  showPlaylist("history");
}

function deleteHistory() {
  localStorage.playlist_history = "";
}  
