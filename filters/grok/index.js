'use strict';

let path = require('path')
  , glob = require('glob')
  , _ = require('highland')
  , GrokCollection = require('node-grok').GrokCollection;

module.exports = function(opts) {
  opts = opts || {};

  let grok = new GrokCollection
    , patterns = {};

  function loadPatterns() {
    glob.sync(path.join.apply(null, arguments)).forEach(function(file) {
      grok.loadSync(file);
    });
  }

  function match(event) {
    function parse(field, done) {
      patterns[field].parse(event[field], done);
    }

    return _.keys(patterns).map(_.wrapCallback(parse)).merge().reduce(_.extend(event, {}), _.flip(_.extend));
  }

  loadPatterns(__dirname, 'patterns', '*');
  if (opts.patternsDir) {
    loadPatterns(opts.patternsDir, opts.patternsFilesGlob || '*');
  }

  for (let field in opts.match) {
    patterns[field] = grok.createPattern(opts.match[field]);
  }

  return _.pipeline(function(events) {
    return events.map(match).merge();
  });
};
