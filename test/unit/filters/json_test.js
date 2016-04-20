'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , json = require('../../../filters/json');

describe('filters/json', function() {
  it('expands json in a field', function(done) {
    _([
      {
        message: '{"foo": "bar"}'
      }
    ])
    .pipe(json({
      source: 'message'
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          message: '{"foo": "bar"}',
          foo: 'bar'
        }
      ]);
      done();
    });
  });
  it('removes fields', function(done) {
    _([
      {
        message: '{"foo": "bar"}'
      }
    ])
    .pipe(json({
      source: 'message',
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
        message: '{"message": "foo"}'
      }
    ])
    .pipe(json({
      source: 'message',
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
