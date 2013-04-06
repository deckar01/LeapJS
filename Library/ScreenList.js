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
