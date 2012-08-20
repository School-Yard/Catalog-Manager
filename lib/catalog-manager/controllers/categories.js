var template_loader = require('../../utils/template_loader');

// Set a path to load templates from
template_loader.dirs(__dirname + '/../templates');

// Create a new export object
var Categories = module.exports;

function error(req, res, err) {
  this.emit('error', { res: res, status: 400, message: err });
}

// GET - Index
Categories.index = function index(req, res) {
  var self = this,
      data,
      html;

  data = {
    category: req.category.slug,
    card: self.slug
  };

  this.category.all(function(err, results) {
    if(err) return error.call(self, req, res, err);

    data.categories = results;
    html = template_loader.templates['category/index'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// GET - New Form
Categories.form = function form(req, res) {
  var data,
      html;

  data = {
    category: req.category.slug,
    card: this.slug
  };

  html = template_loader.templates['category/new'](data);
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(html);
};

// POST - Create
Categories.create = function create(req, res) {
  var self = this,
      path;

  this.category.create(req.body.category, function(err, result) {
    if(err) return error.call(self, req, res, err);
    path = '/' + req.category.slug + '/' + self.slug + '/categories/' + result.id;
    res.writeHead(302, {'Location': path});
    res.end();
  });
};

// GET - Show
Categories.show = function show(req, res, params) {
  var self = this,
      data,
      html,
      plugins,
      name,
      idx;

  data = {
    category: req.category,
    card: this.slug,
    collection: this.collection
  };

  data.active_cards = [];

  this.category.get(params.id, function(err, result) {
    if(err) return error.call(self, req, res, err);

    data.result = result;

    Object.keys(self.collection).forEach(function(card) {

      plugins = result.plugins;
      name = self.collection[card].name;
      idx = plugins.indexOf(name);

      // This category has the card activated
      if(idx != -1) {
        data.active_cards.push(self.collection[card]);
      }

    });

    html = template_loader.templates['category/show'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// GET - Edit Form
Categories.edit = function edit(req, res, params) {
  var self = this,
      data,
      html;

  data = {
    category: req.category.slug,
    card: self.slug
  };

  this.category.get(params.id, function(err, result) {
    if(err) return error.call(self, req, res, err);

    data.result = result;
    html = template_loader.templates['category/edit'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// PUT - Update
Categories.update = function update(req, res, params) {
  var self = this,
      data,
      action,
      path;

  if (!req.body.category) return next(new Error('Nothing to update'));

  data = req.body.category;

  // Ensure published flag is set correctly
  data.published = data.published === 'true' ? true : false;

  this.category.update(params.id, data, function(err, result) {
    if(err) return error.call(self, req, res, err);
    if(!result) return error.call(self, req, res, new Error('No result returned'));

    // Emit an attach or detach method on an event emitter
    action = result.published === true ? 'attach' : 'detach';
    self.adapters.memory.emit(action, result);

    path = '/' + req.category.slug + '/' + self.slug + '/categories/' + result.id;
    res.writeHead(302, {'Location': path});
    res.end();
  });
};

// DELETE - Destroy
Categories.destroy = function destroy(req, res, params) {
  var self = this,
      path;

  this.category.destroy(params.id, function(err, result) {
    if(err) return error.call(self, req, res, err);

    self.adapters.memory.emit('detach', params.id);

    path = '/' + req.category.slug + '/' + self.slug + '/categories';
    res.writeHead(302, {'Location': path});
    res.end();
  });
};