Leap._List = function(){};

Leap._List.prototype = new Array;

Leap._List.prototype.count = function(){
	return this.length;
};

Leap._List.prototype.isEmpty = function(){
	return this.length === 0;
};

// Depricated
Leap._List.prototype.empty = function(){
	return this.length === 0;
};

Leap._List.prototype.append = function(other){
	for(i = 0; i < other.length; i++) this.push(other[i]);
};

Leap._List.prototype._delete = function(){
	for(var i = 0; i < this.length; i++) this[i]._delete();
};