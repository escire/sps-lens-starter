"use strict";

var CompositeView = require("../composite").View;
var _ = require('underscore');
// var LensNodes = require('lens/article/nodes');
// var NodeView = LensNodes["node"].View;
var NodeView = require('../node').View
var LensArticle = require('lens/article');
var ResourceView = LensArticle.ResourceView;

var $$ = require('lens/substance/application').$$;

// TrView
// ===========

var TrView = function (node, viewFactory, options) {
    CompositeView.call(this, node, viewFactory)
    options = options || {};
    options.elementType = 'tr';
    NodeView.call(this, node, viewFactory, options);

    // Mix-in
    ResourceView.call(this, options);

    // this.content = document.createElement("tr");
    // this.$el.addClass('inline');

    // this.$content = $(this.content);
    // this.$content.addClass("content");

    // this.$el.append(this.$content);
};

TrView.Prototype = function () {

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

        this.content = $$('tr');

        this.renderChildren();

        this.el.appendChild(this.content);
        return this;
    };

    this.renderChildren = function () {
        var children = this.node.getChildrenIds();

        // ----------------------------
        //  for each child of table-wrap,
        // create its view and append it
        // ----------------------------


        for (var i = 0; i < children.length; i++) {
            var childView = this.createChildView(children[i]);
            var childViewEl = childView.render().el;
            this.content.appendChild(childViewEl.childNodes[0]);
        }
    };

    this.createChildView = function (nodeId) {


        console.log({
            trViewNodeId: nodeId
        })

        var view = this.createView(nodeId);
        this.childrenViews.push(view);
        return view;
    };

};

TrView.Prototype.prototype = NodeView.prototype;
TrView.prototype = new TrView.Prototype();

module.exports = TrView;
