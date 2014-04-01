//stop the vimeo video from playing
var node_list = document.getElementsByTagName('object');
 
for (var i = 0; i < node_list.length; i++) {
  var node = node_list[i];
  if (node.id.indexOf('player') !== -1) {
    node.api_pause();
  }
} 
