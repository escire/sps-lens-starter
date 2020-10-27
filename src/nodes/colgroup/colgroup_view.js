"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var ColgroupView = function (node, viewFactory) {
    CompositeView.call(this, node, viewFactory);
};

ColgroupView.Prototype = function () {

    /**
     * ============
     * 
     * ============
     */

    this.render = function () {

        this.content = $$('colgroup.table-wrapper-colgroup', {
            html: this.node.properties.content
        });

        this.el.appendChild(this.content);
        return this;
    };

};

ColgroupView.Prototype.prototype = CompositeView.prototype;
ColgroupView.prototype = new ColgroupView.Prototype();

module.exports = ColgroupView;
