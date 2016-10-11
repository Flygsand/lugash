'use strict';

var _ = require('highland')
  , util = require('../lib/util')
  , without = util.without
  , rename = util.rename
  , interpolate = util.interpolate
  , FilterError = require('../errors').FilterError.bind(null, 'mutate');

var getterFuncs = {
  integer: function(event, field) {
    var i = parseInt(event[field]);
    if (isNaN(i)) {
      throw new FilterError('integer conversion of \'' + field + '\' yielded NaN', event);
    }
    return i;
  },
  float: function(event, field) {
    var f = parseFloat(event[field]);
    if (isNaN(f)) {
      throw new FilterError('float conversion of \'' + field + '\' yielded NaN', event);
    }
    return f;
  },
  string: function(event, field) {
    return String(event[field]);
  },
  boolean: function(event, field) {
    var s = String(event[field]).toLowerCase();
    if (s === 'true' || s === 't' || s === 'yes' || s === 'y' || s === '1') {
      return true;
    } else if (s === 'false' || s === 'f' || s === 'no' || s === 'n' || s === '0') {
      return false;
    } else {
      throw new FilterError('\'' + field + '\' is neither truthy nor falsy', event);
    }
  }
};

module.exports = function(opts) {
  opts = opts || {};

  var removeField = opts.removeField || []
    , renames = opts.rename || {}
    , addField = opts.addField || {}
    , convert = _.extend(opts.convert, {});

  for (var field in convert) {
    if (convert.hasOwnProperty(field) && typeof getterFuncs[convert[field]] === 'undefined') {
      throw new FilterError('invalid type \'' + convert[field] + '\'');
    }
  }

  function filter(event) {
    var newEvent = rename(without(event, removeField), renames)
      , field;
    for (field in addField) {
      if (addField.hasOwnProperty(field)) {
        newEvent[field] = interpolate(addField[field], event);
      }
    }
    for (field in convert) {
      if (convert.hasOwnProperty(field) && newEvent.hasOwnProperty(field)) {
        newEvent[field] = getterFuncs[convert[field]](newEvent, field);
      }
    }

    return newEvent;
  }

  return _.pipeline(_.map(filter));
};
