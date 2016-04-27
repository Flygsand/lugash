'use strict';

var util = require('util')
  , _ = require('highland');

function FilterError(filter, message, event) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'FilterError';
  this.filter = filter;
  this.message = message;
  this.event = event;
}

util.inherits(FilterError, Error);

module.exports = {
  FilterError: FilterError
};
