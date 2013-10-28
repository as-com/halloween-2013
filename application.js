if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

jQuery.loadScript = function (url, arg1, arg2) {
  var cache = false, callback = null;
  //arg1 and arg2 can be interchangable
  if ($.isFunction(arg1)){
    callback = arg1;
    cache = arg2 || cache;
  } else {
    cache = arg1 || cache;
    callback = arg2 || callback;
  }
               
  var load = true;
  //check all existing script tags in the page for the url
  jQuery('script[type="text/javascript"]')
    .each(function () { 
      return load = (url != $(this).attr('src')); 
    });
  if (load){
    //didn't find it in the page, so load it
    jQuery.ajax({
      type: 'GET',
      url: url,
      crossDomain: true,
      success: callback,
      dataType: 'script',
      cache: cache
    });
  } else {
    //already loaded so just call the callback
    if (jQuery.isFunction(callback)) {
      callback.call(this);
    };
  };
};

function playSound(path){
	//$("#players").append("<audio onpause='removeMedia(this);' onended='removeMedia(this)' autoplay controls src='data/" + path + "'></audio>");
	$("<audio autoplay src='data/" + path + "'></audio>").appendTo("#players").bind("ended", function(){removeMedia($(this), 10)});
}
function printBtn(sound, index){
	$("#buttons").append("<div class='soundbtn button yellow' data-index='" + index + "'>" + sound.name + "</div>");
}

function foxBtn(sound, index){
	$("#foxbuttons").append("<div class='foxbtn button green' data-index='" + index + "'>" + sound.name + "</div>");
}
function removeMedia(stuff, time) {
	setTimeout(function(){stuff.remove();},time);
}

function removeFox(stuff, time) {
	setTimeout(function(){stuff.fadeOut("fast", function(){stuff.remove();})},time);
}

// Watchdog Part 2
function checkForEnded(element){
	if(element.ended){
		element.parentNode.removeChild(element);
	}
}

function playFox(path, index){
	$("#foxplayer").remove();
	$("<video width=176 height=96 id='foxplayer' src='" + foxes[index].video + "'></video>").prependTo("body").bind("ended", function(){removeFox($(this), 15)});
	//$("<video id='foxplayer' onpause='removeMedia(this);' onended='removeMedia(this)' src='" + foxes[index].video + "'></video>").prependTo("body");
	//$("#players").append("<audio onplay='$(\"#foxplayer\").get(0).play();' onpause='removeMedia(this);' onended='removeMedia(this);' autoplay controls src='data/" + path + "'></audio>");
	$("<audio onplay='$(\"#foxplayer\").get(0).play();' autoplay src='data/" + path + "'></audio>").appendTo("#players").bind("ended", function(){removeMedia($(this), 5)});
}

// Loading icon
$("#loader").attr("src", "data:image/gif;base64,R0lGODlhEAAQAPMIAIKCgnJycpSUlKioqLy8vGhoaM7Ozt7e3v///+jo6AAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgD/ACwAAAAAEAAQAAAEKxDJSau9OE/Fu/8cEAyEcWDhWJ5XSpqoIr6s5a7xjLeyCvOgIEdDLBqPlAgAIfkEBQoABAAsAQAEAAQABwAABApwCBAktXXmq3EEACH5BAUKAAUALAEABAAGAAcAAAQP0JAhQJDU4non35oXZkEEACH5BAUKAAUALAEABAAIAAcAAAQTMB1DhgBBUot1vdn0dSIXbqBnRgAh+QQFCgAFACwBAAQACgAHAAAEGRChdAwZAgRJLdZcdWXbJH5lN4KmR4auFgEAIfkEBQoABQAsAwAEAAoABwAABBkQoXQMGQIESS3WXHVl2yR+ZTeCpkeGrhYBACH5BAUKAAUALAUABAAKAAcAAAQZEKF0DBkCBEkt1lx1ZdskfmU3gqZHhq4WAQAh+QQFCgAAACwHAAQABwAHAAAEERChdAwpklo8680ep33dBm4RACH5BAUKAAMALAkABAAGAAcAAAQPEKESgJDU4non35oXZkIEACH5BAUKAAYALAkABAAGAAcAAAQPsAQgBpHU4non35oXZkQEACH5BAUKAAgALAcABAAIAAcAAAQTsAQgBjFHUot1vdn0dSIXbqBnRgAh+QQFCgAJACwFAAQACgAHAAAEGbAEIAYxByFJLdZcdWXbJH5lN4KmR4auFgEAIfkEBQoACQAsAwAEAAoABwAABBmwBCAGMQchSS3WXHVl2yR+ZTeCpkeGrhYBACH5BAUKAAkALAEABAAKAAcAAAQZsAQgBjEHIUkt1lx1ZdskfmU3gqZHhq4WAQA7");

// Load scripts, async style
$.loadScript('data.js', true, function() {
	$("#loadtext").text("Loading the Foxes...");
	$.loadScript('data/foxes.js', true, function(){
		sounds.forEach(printBtn);
		foxes.forEach(foxBtn);
		$("#loading").fadeOut(function(){$("#bodywrap").fadeIn();});
		$(".soundbtn").click(function(){
			playSound(sounds[parseInt($(this).attr("data-index"))].file);
		});
		$("#stop").click(function(){
			$("audio, video").remove();
		});
		$(".foxbtn").click(function(){
			playFox(foxes[parseInt($(this).attr("data-index"))].file, parseInt($(this).attr("data-index")));
		});
		// Watchdog for unremoved ended audio/video
		setInterval(function(){
			$("audio, video").get().forEach(checkForEnded);
			},1000);
		});
});

