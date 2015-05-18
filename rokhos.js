var rokhos = {};

rokhos.storage = function() {
	this.store = {};
};

rokhos.storage.prototype.create = function(key,value) {
	if(this.store[key] === undefined) {
		this.store[key] = value;
	}
	else {
	}
	return value;
};

rokhos.storage.prototype.read = function(key) {
	return this.store[key];

};

rokhos.storage.prototype.update = function(key,value) {
	this.store[key] = value;
};

rokhos.storage.prototype.delete = function(key) {
	delete this.store[key];
};

rokhos.debug = {};
rokhos.debug.levels = {
	verbose: 0,
	info: 1,
	warning: 2,
	error: 3,
	critical: 4
};
rokhos.debug.level = rokhos.debug.levels.verbose;
rokhos.log = function(msg,lvl) {
	if(lvl >= rokhos.debug.level) {
		console.log(msg);
	}
};