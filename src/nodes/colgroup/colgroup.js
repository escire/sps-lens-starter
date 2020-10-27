"use strict";

var Document = require('lens/substance/document');

var Colgroup = function(node, document) {
  Document.Composite.call(this, node, document);
};

/**
 * =============
 * 
 * =============
 */

Colgroup.type = {
  "id": "colgroup",
  "parent": "table",
  "properties": {
    "source_id": "string",
    "content": "string"
  }
};

/**
 * =============
 * 
 * =============
 */

Colgroup.description = {
  "name": "Colgroup",
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

Colgroup.example = {
  "id": "attrib_1",
  "content": "<colgroup>...</colgroup>",
};

/**
 * =============
 * 
 * =============
 */

Colgroup.Prototype = function() {

  this.getContent = function() {
    if (this.properties.content) return this.document.get(this.properties.content);
  };

};

Colgroup.Prototype.prototype = Document.Composite.prototype;
Colgroup.prototype = new Colgroup.Prototype();
Colgroup.prototype.constructor = Colgroup;

Document.Node.defineProperties(Colgroup);

module.exports = Colgroup;
