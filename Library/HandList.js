Leap.HandList = function(){};

Leap.HandList.prototype = new Array;

Leap.HandList.prototype.append = function(other){

	for(i = 0; i < other.length; i++) this.push(new Leap.Hand(other[i]));
};

Leap.HandList.prototype.count = function(){

	return this.length;
};

Leap.HandList.prototype.empty = function(){

	return this.length > 0;
};
