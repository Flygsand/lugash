'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , logstash = require('../../../filters/logstash');

describe('filters/logstash', function() {
  it('adds logstash @-attributes', function(done) {
    _([
      {
        timestamp: '2016-03-15T12:42:15+11:00'
      }
    ])
    .pipe(logstash())
    .toArray(function(events) {
      expect(events).to.eql([
        {
          '@version': '1',
          '@timestamp': '2016-03-15T01:42:15.000Z',
          'timestamp': '2016-03-15T12:42:15+11:00'
        }
      ]);
      done();
    });
  });

  it('produces error on missing timestamp', function(done) {
    var errors = [];

    _([
      {
        foo: 'bar'
      }
    ])
    .pipe(logstash())
    .errors(function(err) {
      errors.push(err);
    })
    .toArray(function(events) {
      expect(events).to.eql([]);
      expect(errors).to.eql([new Error('missing timestamp')]);
      done();
    });
  });

  it('produces error on invalid timestamp', function(done) {
    var errors = [];

    _([
      {
        timestamp: 'bar'
      }
    ])
    .pipe(logstash())
    .errors(function(err) {
      errors.push(err);
    })
    .toArray(function(events) {
      expect(events).to.eql([]);
      expect(errors).to.eql([new Error('invalid timestamp')]);
      done();
    });
  });
});
