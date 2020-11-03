"use strict";

var Document = require('lens/substance/document');

var TableWrapFoot = function (node, document) {
  Document.Composite.call(this, node, document);
};

/**
 * =============
 * 
 * =============
 */

TableWrapFoot.type = {
  "id": "table-wrap-foot",
  "parent": "html_table",
  "properties": {
    "source_id": "string",
    "fn": ["array", "fn"]
  }
};

/**
 * =============
 * 
 * =============
 */

TableWrapFoot.description = {
  "name": "TableWrapFoot",
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

TableWrapFoot.example = {
  "id": "attrib_1",
  "content": "<TableWrapFoot>...</TableWrapFoot>",
};

/**
 * =============
 * 
 * =============
 */

TableWrapFoot.Prototype = function () {

  this.getChildrenIds = function () {
    var nodes = [];
    if (this.properties.fn) {
      nodes = this.properties.fn;
    }
    return nodes;
  };

};

TableWrapFoot.Prototype.prototype = Document.Composite.prototype;
TableWrapFoot.prototype = new TableWrapFoot.Prototype();
TableWrapFoot.prototype.constructor = TableWrapFoot;

Document.Node.defineProperties(TableWrapFoot);

module.exports = TableWrapFoot;
