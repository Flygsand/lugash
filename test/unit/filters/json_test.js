'use strict';

let expect = require('chai').expect
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
});
