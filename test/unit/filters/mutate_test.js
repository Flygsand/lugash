'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , mutate = require('../../../filters/mutate');

describe('filters/mutate', function() {
  it('removes fields', function(done) {
    _([
      {
        foo: 'bar',
        baz: 'boo'
      }
    ])
    .pipe(mutate({
      removeField: ['foo']
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          baz: 'boo'
        }
      ]);

      done();
    });
  });
});
