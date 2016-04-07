'use strict';

var _ = require('highland');

function decode(chunk) {
  return {
    message: chunk
  };
}

module.exports = function() {
  return _.pipeline(function(s) {
    return s.split().filter(function(l) { return l.length > 0; }).map(decode);
  });
};
