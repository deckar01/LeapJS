window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

function pad(val, min){
	while(val.toString().length<min) val = '0'+val;
	return val;
}

function realTime(timestamp){
	var ms = timestamp/1000;
	var s = ms/1000;
	var m = s/60;
	var h = m/60;
	return '(' + pad(Math.floor(h)%60,2) + ':' + pad(Math.floor(m)%60,2) + ':' + pad(Math.floor(s)%60,2) + ':' + pad(Math.floor(ms)%1000,3) + ')';
}

function drawFinger(finger){
	var radius = 10;
	var x = 400-(finger.tipPosition().z + 50);
	var y = 600-(finger.tipPosition().y);
	buffercx1.beginPath()
	buffercx1.moveTo(x, y);
	buffercx1.lineTo(x-finger.direction().z*20, y-finger.direction().y*20);
	buffercx1.strokeStyle = 'red';
	buffercx1.stroke();
	
	buffercx1.beginPath();
	buffercx1.arc(x, y, radius, 0, 2 * Math.PI, false);
	buffercx1.fillStyle = 'rgba(255,255,255,.3)';
	buffercx1.fill();
	buffercx1.lineWidth = 1;
	buffercx1.strokeStyle = 'black';
	buffercx1.stroke();
	
	
	radius = 10;
	x = finger.tipPosition().x + 250;
	y = finger.tipPosition().z + 250;
	buffercx2.beginPath();
	buffercx2.moveTo(x, y);
	buffercx2.lineTo(x+finger.direction().x*20, y+finger.direction().z*20);
	buffercx2.strokeStyle = 'red';
	buffercx2.stroke();
	
	buffercx2.beginPath();
	buffercx2.arc(x, y, radius, 0, 2 * Math.PI, false);
	buffercx2.fillStyle = 'rgba(255,255,255,.3)';
	buffercx2.fill();
	buffercx2.lineWidth = 1;
	buffercx2.strokeStyle = 'black';
	buffercx2.stroke();
}

function drawTool(tool){
	var x = 400-(tool.tipPosition().z + 50);
	var y = 600-(tool.tipPosition().y);
	
	buffercx1.beginPath();
	buffercx1.lineWidth = 1;
	buffercx1.moveTo(x, y);
	buffercx1.lineTo(x-tool.direction().z*20, y-tool.direction().y*20);
	buffercx1.strokeStyle = 'red';
	buffercx1.stroke();
	
	buffercx1.beginPath();
	buffercx1.moveTo(x, y);
	buffercx1.lineTo(x+tool.direction().z*tool.length(), y+tool.direction().y*tool.length());
	buffercx1.lineWidth = tool.width();
	buffercx1.strokeStyle = 'black';
	buffercx1.stroke();
	
	
	radius = 5;
	x = tool.tipPosition.x + 250;
	y = tool.tipPosition.z + 250;
	
	buffercx2.beginPath();
	buffercx2.moveTo(x, y);
	buffercx2.lineTo(x+tool.direction().x*20, y+tool.direction().z*20);
	buffercx2.strokeStyle = 'red';
	buffercx2.lineWidth = 1;
	buffercx2.stroke();
	
	buffercx2.beginPath();
	buffercx2.lineWidth = tool.width();
	buffercx2.moveTo(x, y);
	buffercx2.lineTo(x-tool.direction().x*tool.length(), y-tool.direction().z*tool.length());
	buffercx2.strokeStyle = 'black';
	buffercx2.stroke();
}

function drawHand(hand){

	if(hand.sphereRadius != null){
		var radius = hand.sphereRadius();
		var x = 400-(hand.sphereCenter().z + 50);
		var y = 600-(hand.sphereCenter().y);
		
		buffercx1.beginPath()
		buffercx1.moveTo(x, y);
		buffercx1.lineTo(x-hand.palmNormal().z*radius, y-hand.palmNormal().y*radius);
		buffercx1.strokeStyle = 'red';
		buffercx1.stroke();
	
		buffercx1.beginPath();
		buffercx1.arc(x, y, radius, 0, 2 * Math.PI, false);
		buffercx1.fillStyle = 'rgba(255,255,255,.3)';
		buffercx1.fill();
		buffercx1.lineWidth = 1;
		buffercx1.strokeStyle = 'black';
		buffercx1.stroke();
		
		
		radius = hand.sphereRadius();
		x = hand.sphereCenter().x + 250;
		y = hand.sphereCenter().z + 250;
		
		buffercx2.beginPath();
		buffercx2.moveTo(x, y);
		buffercx2.lineTo(x+hand.palmNormal().x*radius, y+hand.palmNormal().z*radius);
		buffercx2.strokeStyle = 'red';
		buffercx2.stroke();
	
		buffercx2.beginPath();
		buffercx2.arc(x, y, radius, 0, 2 * Math.PI, false);
		buffercx2.fillStyle = 'rgba(255,255,255,.3)';
		buffercx2.fill();
		buffercx2.lineWidth = 1;
		buffercx2.strokeStyle = 'black';
		buffercx2.stroke();
	}
}

function drawFrame(frame){

	for(id = 0; id < frame.hands().count(); id++){
		var hand = frame.hands()[id];
		drawHand(hand);
	}
	
	for(tid = 0; tid < frame.tools().count(); tid++){
		var tool = frame.tools()[tid];
		drawTool(tool);
	}
	
	for(hid = 0; hid < frame.fingers().count(); hid++){
		var finger =frame.fingers()[hid];
		drawFinger(finger);
	}
}

function fade(){
	buffercx1.fillStyle = 'rgba(255,255,255,.3)';
	buffercx1.fillRect(0,0,600,600);
	buffercx2.fillStyle = 'rgba(255,255,255,.3)';
	buffercx2.fillRect(0,0,500,600);
}