//1->top scroll, 2->bottom scroll, 4->bottom disappear, 5->top disappear, 6->reverse scroll
var commentModes = [1, 1, 1, 5, 5, 2, 7, 4, 6];

var commentSizes = [25, 25, 25, 25, 36, 18, 16, 18, 36, 45, 64];

/*
green:00ff00, black:000000, grey:C0C0C0, white:ffffff, red:ff0000
blue:0000ff, yellow:ffff00, dark green:00ffff, magenta:ff00ff
*/
var commentColors = [0x00ff00, 0x000000, 0xC0C0C0, 0xffffff, 0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff];

window.addEventListener("load",function(){
	window.thevideojs = videojs("xComment_video");
	thevideojs.ABP();
	// thevideojs.danmu.load("jsons/comment.xml");
	insertHistoryComment();
	openSocket();
});

function openSocket() {
	var socket = new WebSocket('ws://10.21.163.17:8080/chat/2');
	
	socket.onopen = function() {
		// $('#btnMsgSend').click(function(e){
		$('#commentForm').submit(function(e){
			e.preventDefault();
			var videoTime = Math.round(parseFloat(thevideojs.danmu.getVideoCurrentTime()*1000));
			var commentMsg = {
				"text" : $('#commentMsg').val(),
				"stime" : videoTime
			};
			var msg = JSON.stringify(commentMsg);
			console.log("Send Socket Message: " + msg);
			socket.send(msg);
			$('#commentMsg').val('');
		});
	};

	socket.onerror = function(error) { console.log('WebSocket Error ', error) };

	socket.onmessage = function(event) {
		console.log("Get Scoket Message: " + event.data);
		if (event.data === "Ping") {
			socket.send("Pong");
			console.log("Send Socket Message: Pong");
		} else {
			try {
				var msgJson = JSON.parse(event.data);
				var mode = commentModes[getRandomInt(0, commentModes.length)];
				var size = commentSizes[getRandomInt(0, commentSizes.length)];
				var color = commentColors[getRandomInt(0, commentColors.length)];
				var duration = getRandomInt(6000, 12000);
				if(msgJson && typeof msgJson === "object") {
					var commentMsg = msgJson.text;
					var stime = msgJson.stime + 2000;
					if (commentMsg !== "undefined") {
						var comment = {
							"mode": 1,
							"text": commentMsg,
							"stime": stime,
							"size": size,
							"color": color,
							"dur": duration
						};
						console.log("Insert comment: " + JSON.stringify(comment));
						console.log("Video Time: " + thevideojs.danmu.getVideoCurrentTime());
						thevideojs.danmu.cmManager.insert(comment);
						console.log("Video Time: " + thevideojs.danmu.getVideoCurrentTime());
					}
				}
			}
			catch (e) {	}
		}
	};
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

function insertHistoryComment() {
    // $.ajax(
    // 	{
    // 		type: "GET",
    // 		dataType: "jsonp",
    // 		url: "http://10.21.163.17:8080/messages/2",
    // 		success: function(result) {
    //     		console.log(result);
    // 		}
    // 	}
    // );

	var xhr = createCORSRequest('GET', 'http://10.21.163.17:8080/messages/2');
	if (!xhr) {
		throw new Error('CORS not supported');
	}

	xhr.onload = function() {
		var responseText = xhr.responseText;
		//console.log(responseText);
		loadComment(responseText);
	};

	xhr.onerror = function() {
		console.log('There was an error!');
	};

	xhr.send();

	// socket.onmessage = function() {
	// 	try {
	// 		var msgJson = JSON.parse(event.data);
	// 		var mode = commentModes[getRandomInt(0, commentModes.length)];
	// 		var size = commentSizes[getRandomInt(0, commentSizes.length)];
	// 		var color = commentColors[getRandomInt(0, commentColors.length)];
	// 		var duration = getRandomInt(6000, 12000);
	// 		if(msgJson && typeof msgJson === "object") {
	// 			var commentMsg = msgJson.text;
	// 			var stime = msgJson.stime;
	// 			if (commentMsg !== "undefined") {
	// 				var comment = {
	// 					"mode": 1,
	// 					"text": commentMsg,
	// 					"stime": stime,
	// 					"size": size,
	// 					"color": color,
	// 					"dur": duration
	// 				};
	// 				console.log("Insert History comment: " + JSON.stringify(comment));
	// 				thevideojs.danmu.cmManager.insert(comment);
	// 			}
	// 		}
	// 	}
	// 	catch (e) {	}
	// };
};

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {

		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {

		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {

		// Otherwise, CORS is not supported by the browser.
		xhr = null;

	}
	return xhr;
};

function loadComment(text) {
	try {
		var msgJsons = JSON.parse(text);
		msgJsons.forEach(insertComment);
	}
	catch (e) {	}
};

function insertComment(msgJson, index) {
	var mode = commentModes[getRandomInt(0, commentModes.length)];
	var size = commentSizes[getRandomInt(0, commentSizes.length)];
	var color = commentColors[getRandomInt(0, commentColors.length)];
	var duration = getRandomInt(6000, 12000);
	if(msgJson && typeof msgJson === "object") {
		var commentMsg = msgJson.text;
		var stime = msgJson.stime;
		if (commentMsg !== "undefined") {
			var comment = {
				"mode": 1,
				"text": commentMsg,
				"stime": stime,
				"size": size,
				"color": color,
				"dur": duration
			};
			console.log("Insert History comment: " + JSON.stringify(comment));
			thevideojs.danmu.cmManager.insert(comment);
		}
	}
}