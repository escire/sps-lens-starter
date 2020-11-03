"use strict";

var Document = require('lens/substance/document');

// TrNode
// -----------------
//

var TrNode = function (node, document) {
    Document.Composite.call(this, node, document);
};

// Type definition
// -----------------
//

TrNode.type = {
    "id": "tr",
    "parent": "tbody",
    "properties": {
        "source_id": "string",
        "td": ["string", "td"],
        "th": ["string", "th"],
    }
};


// This is used for the auto-generated docs
// -----------------
//

TrNode.description = {
    "name": "TrNode",
    "remarks": [
        "Can either be expressed in MathML format or using an image url"
    ],
    "properties": {
        "content": "content of the row"
    }
};

// Example Formula
// -----------------
//

TrNode.example = {
    "type": "tr",
    "id": "tr_eqn1",
    "label": "(1)",
    "content": "<mml:mrow>...</mml:mrow>",
    "format": "mathml"
};

TrNode.Prototype = function () {

    this.getChildrenIds = function () {
        var nodes = [];
        if (this.properties.td.length > 0) {
            nodes.push(...this.properties.td);
        }else if(this.properties.th.length > 0){
            nodes.push(...this.properties.th);
        }
        return nodes;
    };

};

TrNode.Prototype.prototype = Document.Node.prototype;
TrNode.prototype = new TrNode.Prototype();
TrNode.prototype.constuctor = TrNode;

Document.Node.defineProperties(TrNode);

module.exports = TrNode;