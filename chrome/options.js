function check_ip (ip) {
	if ( ! ip ) { return false; }

	ip = ip.replace('https://', '').replace('http://', '');

	if( ip.charAt(ip.length - 1) === '/' ) {    
		//remove trailing slash
		ip.length--;
	}

	return ip;
}

// Saves ScreenInvader options to localStorage. sanitizes input.
function save_options() {
	var ip = check_ip( document.getElementById('ip').innerHTML )
	, slackomatic_ip = check_ip( document.getElementById('slackomatic_ip').innerHTML );

	if ( ! booleanize( ip ) ) {
		ip = '10.20.30.44';
	}

	if ( ! booleanize( slackomatic_ip ) ) {
		slackomatic_ip = '10.20.30.90';
	}

  localStorage.ip = ip;
  localStorage.slackomatic_ip = slackomatic_ip;

  //saving the bool that decides if the invader switches to the screeninvader tab when the plugin button gets clicked
  localStorage.switchToTabOnLoad = booleanize(document.getElementById('switchToTabOnLoad').checked);

  //saving the bool that decides if the invader switches to the screeninvader tab when the plugin button gets clicked
  localStorage.redirectToSlackomatic = booleanize(document.getElementById('redirectToSlackomatic').checked);

	document.getElementById('ip').innerHTML = localStorage.ip;
	document.getElementById('slackomatic_ip').innerHTML = localStorage.slackomatic_ip;

  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.innerHTML = 'Settings saved.';
  setTimeout(function() {
    status.innerHTML = '';
  }, 5000);
}


// Restores select box state to saved value from localStorage.
function restore_ip() {
  var ip = localStorage.ip;
  if ( ! booleanize( ip ) ) {
    localStorage.ip = '10.20.30.44';
    ip = '10.20.30.44';
  }
  document.getElementById('ip').value = ip;
}
// Restores select box state to saved value from localStorage.
function restore_slackomatic_ip() {
  var ip = localStorage.slackomatic_ip;
  if ( ! booleanize( ip ) ) {
    localStorage.slackomatic_ip = '10.20.30.90';
    ip = '10.20.30.90';
  }

  document.getElementById('slackomatic_ip').value = ip;
}

// Restores select box state to saved value from localStorage.
function restore_switchToTabOnLoad() {
	var bool = booleanize(localStorage.switchToTabOnLoad);
	
	document.getElementById('switchToTabOnLoad').checked = bool;
}

// Restores select box state to saved value from localStorage.
function restore_redirectToSlackomatic() {
	var bool = booleanize(localStorage.redirectToSlackomatic);
  document.getElementById('redirectToSlackomatic').checked = bool;
}


function booleanize(value) {
  return value && value !== 'false';
}


document.getElementById('ip').onload = restore_ip();
document.getElementById('slackomatic_ip').onload = restore_slackomatic_ip();
document.getElementById('switchToTabOnLoad').onload = restore_switchToTabOnLoad();
document.getElementById('redirectToSlackomatic').onload = restore_redirectToSlackomatic();

document.getElementById('save').addEventListener('click', save_options);
