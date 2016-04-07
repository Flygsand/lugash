'use strict';

var path = require('path')
  , glob = require('glob')
  , _ = require('highland')
  , Grok = require('../lib/grok').Grok
  , without = require('../lib/util').without;

module.exports = function(opts) {
  opts = opts || {};

  var grok = new Grok()
    , patterns = {}
    , removeField = opts.removeField || [];

  function match(event) {
    var match = {}
      , newEvent;

    for (var field in patterns) {
      if (event.hasOwnProperty(field)) {
        _.extend(patterns[field].parseSync(event[field]), match);
      }
    }

    newEvent = _.extend(match, _.extend(event, {}));
    if (Object.keys(match).length > 0) {
      return without(newEvent, removeField);
    } else {
      return newEvent;
    }
  }

  grok.loadDefaultSync();
  if (opts.patternsDir) {
    grok.loadSync(path.join(opts.patternsDir, opts.patternsFilesGlob || '*'));
  }

  for (var field in opts.match) {
    patterns[field] = grok.createPattern(opts.match[field]);
  }

  return _.pipeline(function(events) {
    return events.map(match);
  });
};
