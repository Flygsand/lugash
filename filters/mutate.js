'use strict';

var _ = require('highland')
  , util = require('../lib/util')
  , without = util.without
  , rename = util.rename
  , interpolate = util.interpolate;

module.exports = function(opts) {
  opts = opts || {};

  var removeField = opts.removeField || []
    , renames = opts.rename || {}
    , addField = opts.addField || {};

  function filter(event) {
    var newEvent = rename(without(event, removeField), renames);
    for (var field in addField) {
      if (addField.hasOwnProperty(field)) {
        newEvent[field] = interpolate(addField[field], event);
      }
    }

    return newEvent;
  }

  return _.pipeline(_.map(filter));
};
