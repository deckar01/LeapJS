Leap.Finger = function(fingerData, parentHand){
	
	Leap.Pointable(fingerData, parentHand, this);
	
	this._isFinger = true;
	this._isTool = false;
};

Leap.Finger.prototype = Leap.Pointable.prototype;

Leap.Finger.invalid = function(){
	return new Leap.Finger();
};
