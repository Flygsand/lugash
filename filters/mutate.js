'use strict';

var _ = require('highland')
  , without = require('../lib/util').without;

module.exports = function(opts) {
  opts = opts || {};

  var removeField = opts.removeField || [];

  function mutate(event) {
    return without(event, removeField);
  }

  return _.pipeline(function(events) {
    return events.map(mutate);
  });
};
