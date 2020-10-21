"use strict";

var Document = require('lens/substance/document');

var Attrib = function(node, document) {
  Document.Composite.call(this, node, document);
};

Attrib.type = {
  "id": "attrib",
  "parent": "content",
  "properties": {
    "source_id": "string",
    "description": "paragraph",
    "children": ["array", "paragraph"]
  }
};

// This is used for the auto-generated docs
// -----------------
//

Attrib.description = {
  "name": "Attrib",
  "remarks": [
    "...",
    "..."
  ],
  "properties": {
    "title": "Attrib title (optional)",
    "children": "0..n Paragraph nodes",
  }
};


// Example File
// -----------------
//

Attrib.example = {
  "id": "attrib_1",
  "children": [
    "paragraph_1",
    "paragraph_2"
  ]
};

Attrib.Prototype = function() {

  this.getChildrenIds = function() {
    return this.properties.children || [];
  };

  this.hasDescription = function() {
    return (!!this.properties.description);
  };

  this.getDescription = function() {

    // console.log({
    //     propertieDescription: this.properties.description
    // });

    if (this.properties.description) return this.document.get(this.properties.description);
  };

};

Attrib.Prototype.prototype = Document.Composite.prototype;
Attrib.prototype = new Attrib.Prototype();
Attrib.prototype.constructor = Attrib;

Document.Node.defineProperties(Attrib);

module.exports = Attrib;
