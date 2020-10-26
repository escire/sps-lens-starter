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
    "description": "string",
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
    return this.properties.children || [];
  };

  this.hasDescription = function() {
    return (!!this.properties.description);
  };

  this.getDescription = function() {
    if (this.properties.description) return this.document.get(this.properties.description);
  };

};

Table.Prototype.prototype = Document.Composite.prototype;
Table.prototype = new Table.Prototype();
Table.prototype.constructor = Table;

Document.Node.defineProperties(Table);

module.exports = Table;
