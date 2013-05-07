Leap.PointableList = function(){};

Leap.PointableList.prototype = new Leap.List;

Leap.PointableList.prototype.leftmost = function(){
	var leftmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((leftmost._valid == false || this[i].tipPosition().x < leftmost.tipPosition().x) && this[i]._valid)
			leftmost = this[i];
	}
	
	return leftmost;
};

Leap.PointableList.prototype.rightmost = function(){
	var rightmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((rightmost._valid == false || this[i].tipPosition().x > rightmost.tipPosition().x) && this[i]._valid)
			rightmost = this[i];
	}
	
	return rightmost;
};

Leap.PointableList.prototype.frontmost = function(){
	var frontmost = Leap.Pointable.invalid();
	
	for(i = 0; i < this.length; i++){
		if((frontmost._valid == false || this[i].tipPosition().z < frontmost.tipPosition().z) && this[i]._valid)
			frontmost = this[i];
	}
	
	return frontmost;
};
