'use strict';

var _ = require('highland')
  , without = require('../lib/util').without
  , rename = require('../lib/util').rename;

module.exports = function(opts) {
  opts = opts || {};

  var removeField = opts.removeField || []
    , renames = opts.rename || {};

  function filter(event) {
    return rename(without(event, removeField), renames);
  }

  return _.pipeline(_.map(filter));
};
