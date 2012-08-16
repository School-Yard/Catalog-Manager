var categories = require('./controllers/categories'),
    CategoryModel = require('./models/category');

module.exports = {
  'name': 'Manager',
  'slug': 'manage',

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
      '/categories/:id/edit': categories.edit
    },
    'put': {
      '/categories/:id': categories.update
    },
    'post': {
      '/categories': categories.create
    },
    'delete': {
      '/categories/:id': categories.destroy
    }
  },

  'events': {

  },

  'static': __dirname + '/public'
};