var fs = require('fs'),
    path = require('path'),
    dot = require('dot');

module.exports = (function() {

  var _subdirs = [],
      _compiled = {},
      _extension = '.html';

  function set_extension(ext) {
    _extension = ext;
  }

  function read_dir(dir) {
    var files = fs.readdirSync(dir),
        subdir,
        name;

    if(_subdirs.length > 0) subdir = _subdirs.pop();

    files.forEach(function(file) {

      // Check if file is a directory
      var stats = fs.statSync(dir+'/'+file);
      if(stats.isDirectory()) {
        _subdirs.push(file);
        return read_dir(dir+'/'+file);
      }

      // ensure the correct file extension
      if(path.extname(file) !== _extension) return;

      name = subdir ? subdir + '/' : '';
      name += file.split('.')[0];

      load_file(dir+'/'+file, name);
    });
  }

  function load_file(path, name) {
    if (!name) name = path;
    var source = fs.readFileSync(path, 'utf8');
    _compiled[name] = dot.template(source);
  }

  return {
    dirs: read_dir,
    extension: set_extension,
    templates: _compiled
  };

}).call();