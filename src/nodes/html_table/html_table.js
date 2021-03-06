var _ = require('underscore');
var Document = require('lens/substance/document');

// Lens.HTMLTable
// -----------------
//

var HTMLTable = function (node, doc) {
  Document.Node.call(this, node, doc);
};

// Type definition
// -----------------
//

HTMLTable.type = {
  "id": "html_table",
  "parent": "content",
  "properties": {
    "source_id": "string",
    "label": "string",
    "content": "string",
    "footer": "table-wrap-foot",
    "caption": "caption",
    "graphics": "image"
  }
};

HTMLTable.config = {
  "zoomable": true
};


// This is used for the auto-generated docs
// -----------------
//

HTMLTable.description = {
  "name": "HTMLTable",
  "remarks": [
    "A table figure which is expressed in HTML notation"
  ],
  "properties": {
    "source_id": "string",
    "label": "Label shown in the resource header.",
    "title": "Full table title",
    "content": "HTML data",
    "footers": "HTMLTable footers expressed as an array strings",
    "caption": "References a caption node, that has all the content"
  }
};


// Example HTMLTable
// -----------------
//

HTMLTable.example = {
  "id": "html_table_1",
  "type": "html_table",
  "label": "HTMLTable 1.",
  "title": "Lorem ipsum table",
  "content": "<table>...</table>",
  "footers": [],
  "caption": "caption_1"
};

HTMLTable.Prototype = function () {

  this.getChildrenIds = function () {
    var nodes = []
    if (this.properties.tables.length > 0) nodes.push(...this.properties.tables)
    if (this.properties.footer) nodes.push(this.properties.footer)
    if(this.properties.graphics) nodes.push(...this.properties.graphics)
    return nodes;
  };

  this.getCaption = function () {
    if (this.properties.caption) return this.document.get(this.properties.caption);
  };

  this.getHeader = function () {
    return this.properties.label;
  };
};

HTMLTable.Prototype.prototype = Document.Node.prototype;
HTMLTable.prototype = new HTMLTable.Prototype();
HTMLTable.prototype.constructor = HTMLTable;

Document.Node.defineProperties(HTMLTable);

module.exports = HTMLTable;