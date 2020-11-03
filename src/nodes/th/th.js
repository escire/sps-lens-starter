"use strict";

var Document = require('lens/substance/document');

// ThNode
// -----------------
//

var ThNode = function (node, document) {
    Document.Composite.call(this, node, document);
};

// Type definition
// -----------------
//

ThNode.type = {
    "id": "th",
    "parent": "tr",
    "properties": {
        "source_id": "string",
        "description": "paragraph",
    }
};


// This is used for the auto-generated docs
// -----------------
//

ThNode.description = {
    "name": "ThNode",
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

ThNode.example = {
    "type": "tr",
    "id": "tr_eqn1",
    "label": "(1)",
    "description": "...",
    "format": "mathml"
};

ThNode.Prototype = function () {
    this.getDescription = function(){
        if(this.properties.description) return this.document.get(this.properties.description)
    }
};

ThNode.Prototype.prototype = Document.Node.prototype;
ThNode.prototype = new ThNode.Prototype();
ThNode.prototype.constuctor = ThNode;

Document.Node.defineProperties(ThNode);

module.exports = ThNode;