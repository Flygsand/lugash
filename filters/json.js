'use strict';

var _ = require('highland')
  , without = require('../lib/util').without;

module.exports = function(opts) {
  opts = opts || {};
  var removeField = opts.removeField || [];

  function filter(event) {
    try {
      return without(_.extend(JSON.parse(event[opts.source]), _.extend(event, {})), removeField);
    } catch (err) {
      return event;
    }
  }

  return _.pipeline(_.map(filter));
};
