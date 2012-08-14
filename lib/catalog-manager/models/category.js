var Category = module.exports = function Category(options) {
  this.options = options || {};

  // Define a new resource
  this.storage = options.connection.resource('categories');

  // Set some default values
  this._attributes = {
    name: '',
    slug: '',
    published: false
  };
  
};

// Helper function for setting properties
Category.prototype.set = function set(attrs) {
  var self = this;

  Object.keys(attrs).forEach(function(key) {
    if(key in self._attributes) {
      self._attributes[key] = attrs[key];
    }
  });
};

Category.prototype.all = function all(callback) {
  this.storage.all(function(err, results) {
    if(err) return callback(err);
    return callback(null, results);
  });
};

Category.prototype.get = function get(id, callback) {
  this.storage.get(id, function(err, result) {
    if(err) return callback(err);
    return callback(null, result);
  });
};

Category.prototype.create = function create(attrs, callback) {
  var self = this;

  this.set(attrs); // set to clean up data

  this.storage.create(this._attributes, function(err, result) {
    if(err) return callback(err);
    return callback(null, result);
  });
};

Category.prototype.destroy = function destroy(id, callback) {
  this.storage.destroy(id, function(err, result) {
    if(err) return callback(err);
    return callback(null, result);
  });
};

Category.prototype.update = function update(id, attrs, callback) {
  this.set(attrs); // set to clean up data

  this.storage.update(id, this._attributes, function(err, result) {
    if(err) return callback(err);
    return callback(null, result);
  });
};