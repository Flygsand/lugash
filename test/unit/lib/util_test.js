'use strict';

var expect = require('chai').expect
  , util = require('../../../lib/util')
  , interpolate = util.interpolate;

describe('lib/util', function() {
  describe('interpolate', function() {
    it('interpolates variables', function() {
      expect(interpolate('foo %{vbar} baz', {vbar: 'bar'})).to.eql('foo bar baz');
      expect(interpolate('foo %{vbar} %{vbaz}', {vbar: 'bar', vbaz: 'baz'})).to.eql('foo bar baz');
      expect(interpolate('foo %{vbar} baz', {})).to.eql('foo %{vbar} baz');
      expect(interpolate('foo %%{vbar} %{vbaz}', {vbar: 'bar', vbaz: 'baz'})).to.eql('foo %{vbar} baz');
    });
  });
});
