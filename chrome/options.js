// Saves ScreenInvader options to localStorage. sanitizes input.
function save_options() {
  var returnString = "Settings saved.";
  
  // saving the ip/url
  var ip = document.getElementById("ip").value.replace('http://', '');
  
  if(ip.charAt(ip.length - 1) === '/') {
    
    if(ip != document.getElementById("ip").value ) {
      returnString =  "you naughty person."+
              " you used a trailing slash AND http:// in front of the url."+
              " fortunately i fixed that for you. save completed";
    } else {
      returnString =  "well, there was a trailing slash, but at least you didnt add the http://."+
              "we all know its http anyways. save completed.";
    }
    
    //remove trailing slash
    ip.length--;
    
  }else if(ip != document.getElementById("ip").value) {
    returnString = "you did use http:// in your url. but you get a gold star for not using a trailing slash. settings saved."
  }
  
  localStorage["ip"] = ip;
  
  
  //saving the bool that decides if the invader switches to the screeninvader tab when the plugin button gets clicked
  localStorage["switchToTabOnLoad"] = document.getElementById("switchToTabOnLoad").checked;
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = returnString;
  setTimeout(function() {
    status.innerHTML = "";
  }, 5000);
}


// Restores select box state to saved value from localStorage.
function restore_ip() {
  var ip = localStorage["ip"];
  if (!ip) {
    localStorage["ip"] = '10.20.30.51';
    ip = '10.20.30.51';
    return;
  }
  
  document.getElementById('ip').value = ip;
}


// Restores select box state to saved value from localStorage.
function restore_switchToTabOnLoad() {
  var switchToTabOnLoad = localStorage["switchToTabOnLoad"];
  if(switchToTabOnLoad == 'false') {
    switchToTabOnLoad = false;
  } else {
    switchToTabOnLoad = true;
  }
  console.log(switchToTabOnLoad)

  document.getElementById('switchToTabOnLoad').checked = switchToTabOnLoad;
}


document.getElementById('ip').onload = restore_ip();
document.getElementById('switchToTabOnLoad').onload = restore_switchToTabOnLoad();

document.getElementById('save').addEventListener('click', save_options);
