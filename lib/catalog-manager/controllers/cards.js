var template_loader = require('../../utils/template_loader');

// Set a path to load templates from
template_loader.dirs(__dirname + '/../templates');

// Create a new export object
var Cards = module.exports;

function error(req, res, err) {
  this.emit('error', { res: res, status: 400, message: err });
}

// POST - Add a card to a category
Cards.create = function create(req, res, params) {
  var self = this,
      obj = {},
      card;

  this.category.get(params.category, function(err, category) {
    if(err) return error.call(self, req, res, err);
    if(!self.collection[params.slug]) return error.call(self, req, res, new Error('Card does no exist'));

    card = self.collection[params.slug];
    obj[card.name] = { published: false };
    category.plugins.push(obj);

    self.category.update(category.id, category, function(err) {
      if(err) return error.call(self, req, res, err);

      self.adapters.memory.emit('attached:card', category);

      path = '/' + req.category.slug + '/' + self.slug + '/categories/' + category.id;
      res.writeHead(302, {'Location': path});
      res.end();
    });
  });
};

// POST - Add a card to a category
Cards.destroy = function destroy(req, res, params) {
  var self = this,
      card,
      plugins,
      pName;

  this.category.get(params.category, function(err, category) {
    if(err) return error.call(self, req, res, err);
    if(!self.collection[params.slug]) return error.call(self, req, res, new Error('Card does no exist'));

    card = self.collection[params.slug];
    plugins = category.plugins;

    for(var i = 0; i < plugins.length; i++) {
      pName = Object.keys(plugins[i])[0];
      if(pName === card.name) {
        category.plugins.splice(i, 1);
      }
    }

    self.category.update(category.id, category, function(err) {
      if(err) return error.call(self, req, res, err);

      self.adapters.memory.emit('detached:card', category);

      path = '/' + req.category.slug + '/' + self.slug + '/categories/' + category.id;
      res.writeHead(302, {'Location': path});
      res.end();
    });
  });
};