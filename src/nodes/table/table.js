"use strict";

var Document = require('lens/substance/document');

var Table = function(node, document) {
  Document.Composite.call(this, node, document);
};

Table.type = {
  "id": "table",
  "parent": "content",
  "properties": {
    "source_id": "string",
    "colgroup": "colgroup",
    "thead": "thead",
    "tbody": "tbody",
    // "children": ["array", "paragraph"]
  }
};

// This is used for the auto-generated docs
// -----------------
//

Table.description = {
  "name": "Table",
  "remarks": [
    "...",
    "..."
  ],
  "properties": {
    "title": "Attrib title (optional)",
  }
};


// Example File
// -----------------
//

Table.example = {
  "id": "attrib_1",
};

Table.Prototype = function() {

  this.getChildrenIds = function() {
    // return this.properties.children || [];
    var nodes = [];
    if (this.properties.colgroup) {
      nodes.push(this.properties.colgroup);
    }
    if (this.properties.thead) {
      nodes.push(this.properties.thead);
    }
    if (this.properties.tbody) {
      nodes.push(this.properties.tbody);
    }
    return nodes;
  };

};

Table.Prototype.prototype = Document.Composite.prototype;
Table.prototype = new Table.Prototype();
Table.prototype.constructor = Table;

Document.Node.defineProperties(Table);

module.exports = Table;
