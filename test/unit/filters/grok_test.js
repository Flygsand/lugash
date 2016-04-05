'use strict';

let expect = require('chai').expect
  , _ = require('highland')
  , grok = require('../../../filters/grok');

describe('filters/grok', function() {
  it('matches a single field', function(done) {
    _([
      {
        message: '55.3.244.1 GET /index.html 15824 0.043'
      }
    ])
    .pipe(grok({
      match: {
        message: '%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}'
      }
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          message: '55.3.244.1 GET /index.html 15824 0.043',
          client: '55.3.244.1',
          method: 'GET',
          request: '/index.html',
          bytes: '15824',
          duration: '0.043'
        }
      ]);

      done();
    });
  });
});
