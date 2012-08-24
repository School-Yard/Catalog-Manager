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
      res.redirect(path);
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
      res.redirect(path);
    });
  });
};

// Get - Form to edit a Card
Cards.edit = function edit(req, res, params) {
  var self = this,
      card,
      data,
      pName,
      html;

  this.category.get(params.category, function(err, category) {
    if(err) return error.call(self, req, res, err);
    if(!self.collection[params.slug]) return error.call(self, req, res, new Error('Card does no exist'));

    card = self.collection[params.slug];

    data = {
      active_category: req.category,
      active_card: self.slug,
      category: category,
      card: card.slug,
      result: {}
    };

    for(var i = 0; i < category.plugins.length; i++) {
      pName = Object.keys(category.plugins[i])[0];
      if(pName === card.name) {
        data.result = {
          name: pName,
          attrs: category.plugins[i][pName]
        };
      }
    }

    res.render('cards/edit', data);
  });
};

// PUT - Update the Card
Cards.update = function update(req, res, params) {
  var self = this,
      data,
      card,
      plugins,
      pName;

  data = req.body.card;

  // Ensure published flag is set correctly
  data.published = data.published === 'true' ? true : false;

  this.category.get(params.category, function(err, category) {
    if(err) return error.call(self, req, res, err);
    if(!self.collection[params.slug]) return error.call(self, req, res, new Error('Card does no exist'));

    card = self.collection[params.slug];
    plugins = category.plugins;

    for(var i = 0; i < plugins.length; i++) {
      pName = Object.keys(plugins[i])[0];
      if(pName === card.name) {
        category.plugins[i][pName] = data;
      }
    }

    self.category.update(category.id, category, function(err) {
      if(err) return error.call(self, req, res, err);

      // Detach and re-attach
      self.adapters.memory.emit('detached:card', category);
      self.adapters.memory.emit('attached:card', category);

      path = '/' + req.category.slug + '/' + self.slug + '/categories/' + category.id;
      res.redirect(path);
    });
  });

};