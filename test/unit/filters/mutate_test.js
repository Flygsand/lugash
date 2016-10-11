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

  it('renames fields', function(done) {
    _([
      {
        foo: 'bar',
        baz: 'boo'
      }
    ])
    .pipe(mutate({
      rename: {
        foo: 'bar'
      }
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          bar: 'bar',
          baz: 'boo'
        }
      ]);

      done();
    });
  });

  it('adds fields', function(done) {
    _([
      {
        foo: 'bar',
        baz: 'boo'
      }
    ])
    .pipe(mutate({
      addField: {
        bar: '%{foo}_%{baz}'
      }
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          foo: 'bar',
          bar: 'bar_boo',
          baz: 'boo'
        }
      ]);

      done();
    });
  });

  it('converts fields', function(done) {
    _([
      {
        truth: 'yes',
        count: '2',
        foo: 12345,
        sum: '5.25'
      }
    ])
    .pipe(mutate({
      convert: {
        truth: 'boolean',
        count: 'integer',
        foo: 'string',
        sum: 'float'
      }
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          truth: true,
          count: 2,
          foo: '12345',
          sum: 5.25
        }
      ]);
      done();
    });
  });
});
