'use strict';

let glob = require('glob')
  , path = require('path')
  , GrokCollection = require('node-grok').GrokCollection;

function Grok() {
  this.patterns = new GrokCollection;
}

Grok.prototype.loadSync = function(globExpr) {
  let _this = this;

  glob.sync(globExpr).forEach(function(file) {
    _this.patterns.loadSync(file);
  });
};

Grok.prototype.loadDefaultSync = function() {
  this.loadSync(path.join(__dirname, 'patterns', '*'));
};

Grok.prototype.createPattern = function() {
  return this.patterns.createPattern.apply(this.patterns, arguments);
};

module.exports = {
  Grok: Grok
};
