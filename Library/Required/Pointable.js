Leap.Pointable = function(pointableData, parentHand, obj){
	
	if(obj==null) obj = this;
	
	if(pointableData == null){
	
		obj._frame = Leap.Frame.invalid();
		obj._hand = Leap.Hand.invalid();
		obj._id = null;
		obj._valid = false;
		
		obj._direction = new Leap.Vector();
		obj._tipPosition = new Leap.Vector();
		obj._tipVelocity = new Leap.Vector();
		
		obj._length = 0;
		obj._width = 0;
	}
	else{
		
		obj._frame = (parentHand)?parentHand._frame:Leap.Frame.invalid();
		obj._hand = parentHand;
		obj._id = pointableData.id;
		obj._valid = true;
		
		obj._direction = new Leap.Vector(pointableData.direction);
		obj._tipPosition = new Leap.Vector(pointableData.tipPosition);
		obj._tipVelocity = new Leap.Vector(pointableData.tipVelocity);
		
		obj._length = pointableData.length;
		obj._width = pointableData.width;
	}
};

Leap.Pointable.prototype = {

	frame : function(){
		return this._frame;
	},
	
	hand : function(){
		return this._hand;
	},
	
	id : function(){
		return this._id;
	},
	
	direction : function(){
		return this._direction;
	},
	
	tipPosition : function(){
		return this._tipPosition;
	},
	
	tipVelocity : function(){
		return this._tipVelocity;
	},
	
	isFinger : function(){
		return this._isFinger;
	},
	
	isTool : function(){
		return this._isTool;
	},
	
	length : function(){
		return this._length;
	},
	
	width : function(){
		return this._width;
	},
	
	toString : function(){
		var val = "{id:"+this._id+",direction:"+this._direction.toString()+",";
		val += "tipPosition:"+this._tipPosition.toString()+",";
		val += "tipVelocity:"+this._tipVelocity.toString()+",";
		val += "length:"+this._length+",";
		val += "width:"+this._width+"}";
		return val;
	},
	
	isValid : function(){
		return this._valid;
	},
	
	_delete : function(){
		this._frame = null;
	}
};

Leap.Pointable.invalid = function(){
	return new Leap.Pointable();
};
