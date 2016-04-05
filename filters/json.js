'use strict';

let _ = require('highland');

module.exports = function(opts) {
  opts = opts || {};

  return _.pipeline(_.map(function(event) {
    try {
      return _.extend(JSON.parse(event[opts.source]), _.extend(event, {}));
    } catch (err) {
      return event;
    }
  }));
};
