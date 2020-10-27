"use strict";

var Document = require('lens/substance/document');

var Tbody = function (node, document) {
  Document.Composite.call(this, node, document);
};

/**
 * =============
 * 
 * =============
 */

Tbody.type = {
  "id": "tbody",
  "parent": "table",
  "properties": {
    "source_id": "string",
    "tr": ["array", "tr"]
  }
};

/**
 * =============
 * 
 * =============
 */

Tbody.description = {
  "name": "Tbody",
  "remarks": [
    "...",
    "..."
  ],
  "properties": {
    "title": "Attrib title (optional)",
  }
};

/**
 * =============
 * 
 * =============
 */

Tbody.example = {
  "id": "attrib_1",
  "content": "<tbody>...</tbody>",
};

/**
 * =============
 * 
 * =============
 */

Tbody.Prototype = function () {

  this.getChildrenIds = function () {
    var nodes = [];
    if (this.properties.tr) {
      nodes = this.properties.tr;
    }
    return nodes;
  };

};

Tbody.Prototype.prototype = Document.Composite.prototype;
Tbody.prototype = new Tbody.Prototype();
Tbody.prototype.constructor = Tbody;

Document.Node.defineProperties(Tbody);

module.exports = Tbody;
