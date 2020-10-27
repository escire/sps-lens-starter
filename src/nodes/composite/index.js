"use strict";

// var Document = require('../../../substance/document');
var Document = require('lens/substance/document');

module.exports = {
  Model: Document.Composite,
  View: require("./composite_view")
};
