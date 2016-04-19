'use strict';

var moment = require('moment')
  , _ = require('highland');

function validTimestamp(ts) {
  return moment.isMoment(ts) && ts.isValid();
}

function timestamp(event, formats) {
  var ts, fts;

  if (!event.timestamp) {
    throw new Error('missing timestamp');
  }

  for (var i in formats) {
    fts = moment(event.timestamp, formats[i]);
    if (validTimestamp(fts)) {
      ts = fts;
      break;
    }
  }

  if (!ts) {
    ts = moment(new Date(Number(event.timestamp) || event.timestamp));
    if (!validTimestamp(ts)) {
      throw new Error('timestamp is invalid');
    }
  }

  return ts.toISOString();
}

module.exports = function(opts) {
  opts = opts || {};
  var timestampFormats = opts.timestampFormats || [];

  function filter(event) {
    return _.extend(event, {
      '@version': '1',
      '@timestamp': event['@timestamp'] || timestamp(event, timestampFormats)
    });
  }

  return _.pipeline(_.map(filter));
};
