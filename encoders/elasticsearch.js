'use strict';

var _ = require('highland')
  , moment = require('moment');

module.exports = function(opts) {
  opts = opts || {};
  var index = opts.index || '[lugash]-YYYY.MM.DD';

  function encode(event) {
    return [
      {
        index: {
          _index: moment(new Date(event['@timestamp'])).format(index),
          _type: event.type || opts.type || 'logs'
        }
      },
      event
    ].map(JSON.stringify).join('\n') + '\n';
  }

  return _.pipeline(function(events) {
    return events.map(encode).intersperse('');
  });
};
