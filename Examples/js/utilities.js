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
	context1.beginPath()
	context1.moveTo(x, y);
	context1.lineTo(x-finger.direction().z*20, y-finger.direction().y*20);
	context1.strokeStyle = 'red';
	context1.stroke();
	
	context1.beginPath();
	context1.arc(x, y, radius, 0, 2 * Math.PI, false);
	context1.fillStyle = 'rgba(255,255,255,.3)';
	context1.fill();
	context1.lineWidth = 1;
	context1.strokeStyle = 'black';
	context1.stroke();
	
	
	radius = 10;
	x = finger.tipPosition().x + 250;
	y = finger.tipPosition().z + 250;
	context2.beginPath();
	context2.moveTo(x, y);
	context2.lineTo(x+finger.direction().x*20, y+finger.direction().z*20);
	context2.strokeStyle = 'red';
	context2.stroke();
	
	context2.beginPath();
	context2.arc(x, y, radius, 0, 2 * Math.PI, false);
	context2.fillStyle = 'rgba(255,255,255,.3)';
	context2.fill();
	context2.lineWidth = 1;
	context2.strokeStyle = 'black';
	context2.stroke();
}

function drawTool(tool){
	var x = 400-(tool.tipPosition().z + 50);
	var y = 600-(tool.tipPosition().y);
	
	context1.beginPath();
	context1.lineWidth = 1;
	context1.moveTo(x, y);
	context1.lineTo(x-tool.direction().z*20, y-tool.direction().y*20);
	context1.strokeStyle = 'red';
	context1.stroke();
	
	context1.beginPath();
	context1.moveTo(x, y);
	context1.lineTo(x+tool.direction().z*tool.length(), y+tool.direction().y*tool.length());
	context1.lineWidth = tool.width();
	context1.strokeStyle = 'black';
	context1.stroke();
	
	
	radius = 5;
	x = tool.tipPosition.x + 250;
	y = tool.tipPosition.z + 250;
	
	context2.beginPath();
	context2.moveTo(x, y);
	context2.lineTo(x+tool.direction().x*20, y+tool.direction().z*20);
	context2.strokeStyle = 'red';
	context2.lineWidth = 1;
	context2.stroke();
	
	context2.beginPath();
	context2.lineWidth = tool.width();
	context2.moveTo(x, y);
	context2.lineTo(x-tool.direction().x*tool.length(), y-tool.direction().z*tool.length());
	context2.strokeStyle = 'black';
	context2.stroke();
}

function drawHand(hand){

	if(hand.sphereRadius != null){
		var radius = hand.sphereRadius();
		var x = 400-(hand.sphereCenter().z + 50);
		var y = 600-(hand.sphereCenter().y);
		
		context1.beginPath();
		context1.arc(x, y, radius, 0, 2 * Math.PI, false);
		context1.fillStyle = 'rgba(255,255,255,.3)';
		context1.fill();
		context1.lineWidth = 1;
		context1.strokeStyle = 'black';
		context1.stroke();
		
		
		radius = hand.sphereRadius();
		x = hand.sphereCenter().x + 250;
		y = hand.sphereCenter().z + 250;
		
		context2.beginPath();
		context2.arc(x, y, radius, 0, 2 * Math.PI, false);
		context2.fillStyle = 'rgba(255,255,255,.3)';
		context2.fill();
		context2.lineWidth = 1;
		context2.strokeStyle = 'black';
		context2.stroke();
	}
}

function fade(){
	context1.fillStyle = 'rgba(255,255,255,.3)';
	context1.fillRect(0,0,600,600);
	context2.fillStyle = 'rgba(255,255,255,.3)';
	context2.fillRect(0,0,500,600);
}