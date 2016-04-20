'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , grok = require('../../../filters/grok');

describe('filters/grok', function() {
  it('matches a single field', function(done) {
    _([
      {
        message: '55.3.244.1 GET /index.html 15824 0.043'
      },
      {
        message: '55.3.244.1 GET /index.html 15825 0.043'
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
        },
        {
          message: '55.3.244.1 GET /index.html 15825 0.043',
          client: '55.3.244.1',
          method: 'GET',
          request: '/index.html',
          bytes: '15825',
          duration: '0.043'
        }
      ]);

      done();
    });
  });
  it('removes fields', function(done) {
    _([
      {
        message: 'bar'
      }
    ])
    .pipe(grok({
      match: {
        message: '%{WORD:foo}'
      },
      removeField: ['message']
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          foo: 'bar'
        }
      ]);
      done();
    });
  });
  it('does not remove fields from parsed input', function(done) {
    _([
      {
        message: 'foo'
      }
    ])
    .pipe(grok({
      match: {
        message: '%{WORD:message}'
      },
      removeField: ['message']
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          message: 'foo'
        }
      ]);
      done();
    });
  });
});
