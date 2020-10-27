"use strict";

var CompositeView = require("../composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var TbodyView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

TbodyView.Prototype = function () {

    /**
     * ============
     * 
     * ============
     */

    this.render = function () {

        this.content = $$('tbody.table-wrapper-tbody');

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

            console.log({
                tBodyTrUnwrapped: this.unwrap(childViewEl)})

            this.content.appendChild(childViewEl.childNodes[0]);
        }
    };

    this.createChildView = function (nodeId) {

        console.log({
            tbodyNodeId: nodeId
        })

        var view = this.createView(nodeId);
        this.childrenViews.push(view);
        return view;
    };

    this.unwrap = function(node) {

        console.log({nodeUnwraped: node})
        console.log({childNodes: node.childNodes[0]})
        console.log({nodeWraped: node.replaceWith(...node.childNodes)})

        return node.replaceWith(...node.childNodes);
    }

};

TbodyView.Prototype.prototype = CompositeView.prototype;
TbodyView.prototype = new TbodyView.Prototype();

module.exports = TbodyView;
