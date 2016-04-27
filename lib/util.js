'use strict';

var _ = require('highland');

exports.without = function(obj, keys) {
  obj = _.extend(obj, {});
  keys.forEach(function(key) {
    delete obj[key];
  });

  return obj;
};

exports.rename = function(obj, renames) {
  obj = _.extend(obj, {});
  for (var src in renames) {
    if (renames.hasOwnProperty(src)) {
      obj[renames[src]] = obj[src];
      delete obj[src];
    }
  }

  return obj;
};
