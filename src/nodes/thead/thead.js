"use strict";

var Document = require('lens/substance/document');

var Thead = function (node, document) {
  Document.Composite.call(this, node, document);
};

/**
 * =============
 * 
 * =============
 */

Thead.type = {
  "id": "thead",
  "parent": "table",
  "properties": {
    "source_id": "string",
    "tr": ["string", "tr"]
  }
};

/**
 * =============
 * 
 * =============
 */

Thead.description = {
  "name": "Thead",
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

Thead.example = {
  "id": "attrib_1",
  "content": "<thead>...</thead>",
};

/**
 * =============
 * 
 * =============
 */

Thead.Prototype = function () {

  this.getChildrenIds = function () {
    var nodes = [];
    if (this.properties.tr) {
      nodes = this.properties.tr;
    }
    return nodes;
  };


};

Thead.Prototype.prototype = Document.Composite.prototype;
Thead.prototype = new Thead.Prototype();
Thead.prototype.constructor = Thead;

Document.Node.defineProperties(Thead);

module.exports = Thead;
