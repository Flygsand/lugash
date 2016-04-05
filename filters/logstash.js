'use strict';

let moment = require('moment')
  , _ = require('highland');

function timestamp(event) {
  if (!event.timestamp) {
    throw new Error('missing timestamp');
  }

  let ts = moment(new Date(event.timestamp));
  if (!moment.isMoment(ts) || !ts.isValid()) {
    throw new Error('timestamp is invalid');
  }

  return ts.toISOString();
}

module.exports = function() {
  return _.pipeline(_.map(function(event) {
    return _.extend(event, {
      '@version': '1',
      '@timestamp': event['@timestamp'] || timestamp(event)
    });
  }));
};
