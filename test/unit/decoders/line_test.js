'use strict';

let expect = require('chai').expect
  , _ = require('highland')
  , line = require('../../../decoders/line');

describe('decoders/line', function() {
  it('decodes lines', function(done) {
    _([
      'foo bar\nbar baz'
    ])
    .pipe(line())
    .toArray(function(events) {
      expect(events).to.eql([
        {
          message: 'foo bar'
        },
        {
          message: 'bar baz'
        }
      ]);
      done();
    });
  });
});
