Leap.ScreenList = function(){};

Leap.ScreenList.prototype = new Array;

Leap.ScreenList.prototype.count = function(){

	return this.length;
};

Leap.ScreenList.prototype.empty = function(){

	return this.length === 0;
};

Leap.ScreenList.prototype.closestScreenHit = function(pointable){
	
	if(this.empty()) return Leap.Screen.invalid();
	
	var closest = this[0];
	var min = closest.intersect(pointable).distance;
	
	for(var index = 1; index < this.length; index++){
		var distance = this[index].intersect(pointable).distance;
		if(distance < min){
			closest = this[index];
			min = distance;
		}
	}
	
	return closest;
};
