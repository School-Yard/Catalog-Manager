var template_loader = require('../../utils/template_loader');

// Set a path to load templates from
template_loader.dirs(__dirname + '/../templates');

// Create a new export object
var Categories = module.exports;

// GET - Index
Categories.index = function index(req, res) {
  var self = this;

  this.category.all(function(err, results) {
    var data = {
      category: req.category.slug,
      card: self.slug,
      categories: results
    };

    var html = template_loader.templates['category/index'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// GET - New Form
Categories.form = function form(req, res) {

  var data = {
    category: req.category.slug,
    card: this.slug
  };

  var html = template_loader.templates['category/new'](data);
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(html);
};

// POST - Create
Categories.create = function create(req, res) {
  var self = this;

  this.category.create(req.body.category, function(err, result) {
    var path = '/' + req.category.slug + '/' + self.slug + '/categories/' + result.id;
    res.writeHead(302, {'Location': path});
    res.end();
  });
};

// GET - Show
Categories.show = function show(req, res, params) {
  var self = this;

  this.category.get(params.id, function(err, result) {
    var data = {
      category: req.category.slug,
      card: self.slug,
      result: result
    };

    var html = template_loader.templates['category/show'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// GET - Edit Form
Categories.edit = function edit(req, res, params) {
  var self = this;

  this.category.get(params.id, function(err, result) {
    var data = {
      category: req.category.slug,
      card: self.slug,
      result: result
    };

    var html = template_loader.templates['category/edit'](data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
};

// PUT - Update
Categories.update = function update(req, res, params) {
  var self = this;

  this.category.update(params.id, req.body.category, function(err, result) {
    var path = '/' + req.category.slug + '/' + self.slug + '/categories/' + result.id;
    res.writeHead(302, {'Location': path});
    res.end();
  });
};

// DELETE - Destroy
Categories.destroy = function destroy(req, res, params) {
  var self = this;

  this.category.destroy(params.id, function(err, result) {
    var path = '/' + req.category.slug + '/' + self.slug + '/categories';
    res.writeHead(302, {'Location': path});
    res.end();
  });
};