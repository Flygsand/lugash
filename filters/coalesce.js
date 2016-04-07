'use strict';

var path = require('path')
  , OnigRegExp = require('oniguruma').OnigRegExp
  , _ = require('highland')
  , Grok = require('../lib/grok').Grok;

function key(event) {
  return [event.type, event.host, event.source].map(function(s) { return s || ''; }).join('-');
}

module.exports = function(remaining, opts) {
  opts = opts || {};

  var grok = new Grok();
  grok.loadDefaultSync();
  if (opts.patternsDir) {
    grok.loadSync(path.join(opts.patternsDir, opts.patternsFilesGlob || '*'));
  }

  var buf = {}
    , pattern = grok.createPattern(opts.pattern)
    , regexp = new OnigRegExp(pattern.resolved)
    , negate = !!opts.negate
    , what = opts.what || 'previous'
    , maxEvents = opts.maxEvents || 500
    , source = opts.source || 'message'
    , handler;

  function buffer(key, event) {
    buf[key] = buf[key] || [];
    buf[key].push(event);
  }

  function bufferFull(key) {
    return buf[key] && buf[key].length >= maxEvents;
  }

  function bufferEmpty(key) {
    return !buf[key] || buf[key].length === 0;
  }

  function merge(key) {
    var events = buf[key]
      , event = events.reduce(function(dst, src) {
        return _.extend(dst, _.extend(src, {}));
      });

    event[source] = events.map(function(e) { return e[source]; }).filter(function(v) { return v !== undefined; }).join('\n');
    return event;
  }

  if (what === 'previous') {
    handler = function(key, event, matches, push) {
      if ((!matches || bufferFull(key)) && !bufferEmpty(key)) {
        push(null, merge(key));
        delete buf[key];
      }

      buffer(key, event);
    };
  } else if (what === 'next') {
    handler = function(key, event, matches, push) {
      buffer(key, event);

      if (!matches || bufferFull(key)) {
        push(null, merge(key));
        delete buf[key];
      }
    };
  } else {
    throw new Error('what must equal previous or next');
  }

  return _.pipeline(function(events) {
    return events.consume(function(err, event, push, next) {
      if (err) {
        push(err);
        next();
      } else if (event === _.nil) {
        _.values(buf).pipe(remaining);
        push(null, _.nil);
      } else {
        regexp.test(event[source], function(err, matches) {
          matches = (matches && !negate) || (!matches && negate);
          handler(key(event), event, matches, push);
          next();
        });
      }
    });
  });
};
