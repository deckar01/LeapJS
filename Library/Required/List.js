Leap.List = function(){};

Leap.List.prototype = new Array;

Leap.List.prototype.count = function(){
	return this.length;
};

Leap.List.prototype.isEmpty = function(){
	return this.length === 0;
};

// Depricated
Leap.List.prototype.empty = function(){
	return this.length === 0;
};

Leap.List.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(other[i]);
};

Leap.List.prototype._delete = function(){
	for(var i = 0; i < this.length; i++) this[i]._delete();
};