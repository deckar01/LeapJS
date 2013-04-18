Leap.Tool = function(toolData, parentHand){

	Leap.Pointable(toolData, parentHand, this);
	
	this._isTool = true;
	this._isFinger = false;
};

Leap.Tool.prototype = Leap.Pointable.prototype;

Leap.Tool.invalid = function(){
	return new Leap.Tool();
};
