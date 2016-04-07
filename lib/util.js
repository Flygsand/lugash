'use strict';

let _ = require('highland');

exports.without = function(obj, keys) {
  obj = _.extend(obj, {});
  keys.forEach(function(key) {
    delete obj[key];
  });

  return obj;
};
