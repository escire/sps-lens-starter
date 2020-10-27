"use strict";

var Document = require('lens/substance/document');

// TdNode
// -----------------
//

var TdNode = function (node, document) {
    Document.Composite.call(this, node, document);
};

// Type definition
// -----------------
//

TdNode.type = {
    "id": "td",
    "parent": "tr",
    "properties": {
        "source_id": "string",
        "description": "paragraph",
    }
};


// This is used for the auto-generated docs
// -----------------
//

TdNode.description = {
    "name": "TdNode",
    "remarks": [
        "Can either be expressed in MathML format or using an image url"
    ],
    "properties": {
        "description": "description of the row"
    }
};

// Example Formula
// -----------------
//

TdNode.example = {
    "type": "tr",
    "id": "tr_eqn1",
    "label": "(1)",
    "description": "...",
    "format": "mathml"
};

TdNode.Prototype = function () {
    this.getDescription = function(){
        if(this.properties.description) return this.document.get(this.properties.description)
    }
};

TdNode.Prototype.prototype = Document.Node.prototype;
TdNode.prototype = new TdNode.Prototype();
TdNode.prototype.constuctor = TdNode;

Document.Node.defineProperties(TdNode);

module.exports = TdNode;