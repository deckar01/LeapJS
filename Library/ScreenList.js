Leap.ScreenList = function(){
	
	if(localStorage.screens){
		var screens = JSON.parse(localStorage.screens);
		for(var id in screens){
			var screen = screens[id];
			var data = [new Leap.Vector(screen[0]), new Leap.Vector(screen[1]), new Leap.Vector(screen[2])];
			this.push(new Leap.Screen(data));
		}
	}
};

Leap.ScreenList.prototype = new Array;

Leap.ScreenList.prototype.count = function(){

	return this.length;
};

Leap.ScreenList.prototype.empty = function(){

	return this.length === 0;
};

Leap.ScreenList.prototype.closestScreenHit = function(pointable){
	
	if(this.empty()) return Leap.Screen.invalid();
	
	var closest = Leap.Screen.invalid();
	var min;
	
	for(var index = 0; index < this.length; index++){
	
		var hit = this[index].intersect(pointable);
		
		if(hit && (closest._valid == false || hit.distance < min)){
			closest = this[index];
			min = hit.distance;
		}
	}
	
	return closest;
};

Leap.ScreenList.prototype.save = function(){

	var screenData = [];
	for(var i = 0; i < this.length; i++) screenData.push(this[i]._data);
	localStorage.screens = JSON.stringify(screenData);
};

Leap.ScreenList.prototype.save = function(){

	var screenData = [];
	for(var i = 0; i < this.length; i++) screenData.push(this[i]._data);
	localStorage.screens = JSON.stringify(screenData);
};

Leap.ScreenList.prototype.clear = function(){

	this.length = 0;
	this.save();
};