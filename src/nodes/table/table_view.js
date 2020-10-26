"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var TableView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

TableView.Prototype = function () {

    /**
     * ============
     * 
     * ============
     */

    this.render = function () {

        this.content = $$('.table-wrapper',{
            html: this.node.properties.description
        });

        this.el.appendChild(this.content);
        return this;
    };

};

TableView.Prototype.prototype = CompositeView.prototype;
TableView.prototype = new TableView.Prototype();

module.exports = TableView;
