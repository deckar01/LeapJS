Leap.GestureList = function(){};

Leap.GestureList.prototype = new Array;

Leap.GestureList.prototype.append = function(other){

	for(i = 0; i < other.length; i++) this.push(new Leap.Gesture(other[i]));
};

Leap.GestureList.prototype.count = function(){

	return this.length;
};

Leap.GestureList.prototype.empty = function(){

	return this.length > 0;
};

Leap.GestureList.prototype._delete = function(){
	
	for(var i = 0; i < this.length; i++) this[i]._delete();
};