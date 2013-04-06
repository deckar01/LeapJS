Leap.PointableList = function(){};

Leap.PointableList.prototype = new Array;

Leap.PointableList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Pointable(other[i]));
};

Leap.PointableList.prototype.count = function(){
	return this.length;
};

Leap.PointableList.prototype.empty = function(){
	return this.length === 0;
};

Leap.PointableList.prototype._delete = function(){
	
	for(var i = 0; i < this.length; i++) this[i]._delete();
};

Leap.FingerList = function(){};

Leap.FingerList.prototype = Leap.PointableList.prototype;

Leap.FingerList.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(new Leap.Finger(other[i]));
};

Leap.ToolList = function(){};

Leap.ToolList.prototype = Leap.PointableList.prototype;

Leap.ToolList.prototype.append = function(other){
	for(i=0; i<other.length; i++) this.push(new Leap.Tool(other[i]));
};
