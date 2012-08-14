var card_catalog = require('cardcatalog'),
    util = require('util'),
    template_loader = require('../utils/template_loader');

var Manager = module.exports = function Manager(options) {
  card_catalog.Card.call(options);

  this.name = "Manager"; // Required
  this.slug = "manager"; // Required

  // load templates
  template_loader.dirs(path.join(__dirname + '/templates'));

  // Set the static folder for this card
  this.set_static(path.join(__dirname, 'public'));

  // Create the Manager routing table
  this.router = {
    'get': {

    },
    'put': {

    },
    'post': {

    },
    'delete': {

    }
  };
};

util.inherits(Manager, card_catalog.Card);