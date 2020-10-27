"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var TheadView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

TheadView.Prototype = function () {

    /**
     * ============
     * 
     * ============
     */

    this.render = function () {

        this.content = $$('thead.table-wrapper-thead',{
            html: this.node.properties.content
        });

        this.el.appendChild(this.content);
        return this;
    };

};

TheadView.Prototype.prototype = CompositeView.prototype;
TheadView.prototype = new TheadView.Prototype();

module.exports = TheadView;
