"use strict";

var CompositeView = require("../composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var TableWrapFootView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

TableWrapFootView.Prototype = function () {

    /**
     * ============
     * 
     * ============
     */

    this.render = function () {

        this.content = $$('div.table-wrap-foot');

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

            this.content.appendChild(childViewEl);
        }
    };

    this.createChildView = function (nodeId) {
        var view = this.createView(nodeId);
        this.childrenViews.push(view);
        return view;
    };

};

TableWrapFootView.Prototype.prototype = CompositeView.prototype;
TableWrapFootView.prototype = new TableWrapFootView.Prototype();

module.exports = TableWrapFootView;
