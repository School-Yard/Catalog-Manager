var categories = require('./controllers/categories'),
    cards = require('./controllers/cards'),
    CategoryModel = require('./models/category'),
    consolidate = require('consolidate');

module.exports = {
  'name': 'Manager',
  'slug': 'manage',

  'engine': ['dot', consolidate.dot],
  'templates': __dirname + '/templates',

  'init': function() {
    this.category = new CategoryModel({
      adapters: this.adapters
    });
  },

  'router': {
    'get': {
      '/categories': categories.index,
      '/categories/new': categories.form,
      '/categories/:id': categories.show,
      '/categories/:id/edit': categories.edit,
      '/categories/:category/cards/:slug/edit': cards.edit
    },
    'put': {
      '/categories/:id': categories.update,
      '/categories/:category/cards/:slug': cards.update
    },
    'post': {
      '/categories': categories.create,
      '/categories/:category/cards/:slug': cards.create
    },
    'delete': {
      '/categories/:id': categories.destroy,
      '/categories/:category/cards/:slug': cards.destroy
    }
  },

  'events': {

  },

  'static': __dirname + '/public'
};