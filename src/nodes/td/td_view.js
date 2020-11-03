"use strict";

var CompositeView = require("../composite").View;
var _ = require('underscore');
// var LensNodes = require('lens/article/nodes');
// var NodeView = LensNodes["node"].View;
var NodeView = require('../node').View
var LensArticle = require('lens/article');
var ResourceView = LensArticle.ResourceView;

var $$ = require('lens/substance/application').$$;

// TdView
// ===========

var TdView = function (node, viewFactory, options) {
    CompositeView.call(this, node, viewFactory)
    options = options || {};
    options.elementType = 'td';
    NodeView.call(this, node, viewFactory, options);

    // Mix-in
    ResourceView.call(this, options);

};

TdView.Prototype = function () {

    // Mix-in
    _.extend(this, ResourceView.prototype);

    // var _types = {
    //     "latex": "math/tex",
    //     "mathml": "math/mml"
    // };

    // var _precedence = {
    //     "svg": 0,
    //     "image": 1,
    //     "mathml": 2,
    //     "latex": 3
    // };

    // Render the formula
    // --------

    this.render = function () {

        this.content = $$('td.table-td');

        var description = this.node.getDescription()

        if (description) {
            var descriptionView = this.createChildView(this.node.description);
            var descriptionElement = descriptionView.render().el;
            this.content.appendChild(descriptionElement);
        }

        this.el.appendChild(this.content);
        return this;
    };

    this.createChildView = function (nodeId) {
        var view = this.createView(nodeId);
        this.childrenViews.push(view);
        return view;
    };
};

TdView.Prototype.prototype = NodeView.prototype;
TdView.prototype = new TdView.Prototype();

module.exports = TdView;
