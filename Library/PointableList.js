Leap.PointableList = function(){};

Leap.PointableList.prototype = new Array;

Leap.PointableList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Pointable(other[i]));
};

Leap.PointableList.prototype.count = function(){
	return this.length;
};

Leap.PointableList.prototype.empty = function(){
	return this.length>0;
};

Leap.FingerList = function(){};

Leap.FingerList.prototype = new Array;

Leap.FingerList.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(new Leap.Finger(other[i]));
};

Leap.FingerList.prototype.count = function(){
	return this.length;
};

Leap.FingerList.prototype.empty = function(){
	return this.length > 0;
};

Leap.ToolList = function(){};

Leap.ToolList.prototype = new Array;

Leap.ToolList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Tool(other[i]));
};

Leap.ToolList.prototype.count = function(){
	return this.length;
};

Leap.ToolList.prototype.empty = function(){
	return this.length>0;
};
