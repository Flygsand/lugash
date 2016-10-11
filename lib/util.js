'use strict';

var _ = require('highland')
  , SmartBuffer = require('smart-buffer')
  , OnigRegExp = require('oniguruma').OnigRegExp
  , interpolateRegExp = new OnigRegExp('%%?\{(.+?)\}');

exports.without = function(obj, keys) {
  obj = _.extend(obj, {});
  keys.forEach(function(key) {
    delete obj[key];
  });

  return obj;
};

exports.rename = function(obj, renames) {
  obj = _.extend(obj, {});
  for (var src in renames) {
    if (renames.hasOwnProperty(src)) {
      obj[renames[src]] = obj[src];
      delete obj[src];
    }
  }

  return obj;
};

exports.interpolate = function(str, ctx) {
  var pos = 0, buf = new SmartBuffer(), m;

  while ((m = interpolateRegExp.searchSync(str, pos)) !== null) {
    if (m[0].match.indexOf('%%') === 0) {
      buf.writeString(str.substring(pos, m[0].start));
      buf.writeString(m[0].match.substring(1));
    } else {
      buf.writeString(str.substring(pos, m[0].start));
      buf.writeString(ctx[m[1].match] || m[0].match);
    }
    pos = m[0].end;
  }

  buf.writeString(str.substring(pos));
  return buf.toString();
};
