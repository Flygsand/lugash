'use strict';

var _ = require('highland');

function decode(chunk) {
  return {
    message: chunk
  };
}

module.exports = function() {
  return _.pipeline(
    _.split,
    _.filter(function(l) { return l.length > 0; }),
    _.map(decode)
  );
};
