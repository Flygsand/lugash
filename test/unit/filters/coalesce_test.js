'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , coalesce = require('../../../filters/coalesce');

describe('filters/coalesce', function() {
  it('transforms multiple events into one', function(done) {
    _([
      {seq: '1', type: 'logs', host: 'foo', source: 'bar', message: 'one'},
      {seq: '2', type: 'logs', host: 'foo', source: 'bar', message: '  two'},
      {seq: '3', type: 'logs', host: 'foo', source: 'bar', message: '  three'},
      {seq: '4', type: 'logs', host: 'foo', source: 'bar', message: 'four'}
    ])
    .pipe(coalesce({
      pattern: '^\\s+'
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          seq: '1',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: 'one\n  two\n  three'
        },
        {
          seq: '4',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: 'four'
        }
      ]);

      done();
    });
  });

  it('supports grok patterns', function(done) {
    _([
      {seq: '1', type: 'logs', host: 'foo', source: 'bar', message: '[2016-04-07T07:38:04.396Z] one'},
      {seq: '2', type: 'logs', host: 'foo', source: 'bar', message: 'two'},
      {seq: '3', type: 'logs', host: 'foo', source: 'bar', message: 'three'},
      {seq: '4', type: 'logs', host: 'foo', source: 'bar', message: '[2016-04-07T07:38:05.396Z] four'}
    ])
    .pipe(coalesce({
      pattern: '\\[%{TIMESTAMP_ISO8601}\\]',
      negate: true
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          seq: '1',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: '[2016-04-07T07:38:04.396Z] one\ntwo\nthree'
        },
        {
          seq: '4',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: '[2016-04-07T07:38:05.396Z] four'
        }
      ]);

      done();
    });
  });

  it('supports forward merging', function(done) {
    _([
      {type: 'logs', host: 'foo', source: 'bar', message: 'foo \\'},
      {type: 'logs', host: 'foo', source: 'bar', message: 'bar \\'},
      {type: 'logs', host: 'foo', source: 'bar', message: 'baz'}
    ])
    .pipe(coalesce({
      pattern: '\\\\$',
      what: 'next'
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: 'foo \\\nbar \\\nbaz'
        }
      ]);

      done();
    });
  });

  it('handles multiple event streams', function(done) {
    _([
      {seq: 'a1', type: 'logs', host: 'foo', source: 'bar', message: 'a one'},
      {seq: 'a2', type: 'logs', host: 'foo', source: 'bar', message: '  a two'},
      {seq: 'b1', type: 'logs', host: 'foo', source: 'baz', message: 'b one'},
      {seq: 'a3', type: 'logs', host: 'foo', source: 'bar', message: '  a three'},
      {seq: 'b2', type: 'logs', host: 'foo', source: 'baz', message: '  b two'},
      {seq: 'b3', type: 'logs', host: 'foo', source: 'baz', message: '  b three'},
      {seq: 'a4', type: 'logs', host: 'foo', source: 'bar', message: 'a four'},
      {seq: 'b4', type: 'logs', host: 'foo', source: 'baz', message: 'b four'}
    ])
    .pipe(coalesce({
      pattern: '^\\s+'
    }))
    .toArray(function(events) {
      expect(events).to.eql([
        {
          seq: 'a1',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: 'a one\n  a two\n  a three'
        },
        {
          seq: 'b1',
          type: 'logs',
          host: 'foo',
          source: 'baz',
          message: 'b one\n  b two\n  b three'
        },
        {
          seq: 'a4',
          type: 'logs',
          host: 'foo',
          source: 'bar',
          message: 'a four'
        },
        {
          seq: 'b4',
          type: 'logs',
          host: 'foo',
          source: 'baz',
          message: 'b four'
        }
      ]);

      done();
    });
  });
});
