"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * =============
 * LENS CAPTION VIEW
 * =============
 */

var CaptionView = function (node, viewFactory) {
  CompositeView.call(this, node, viewFactory);
};

CaptionView.Prototype = function () {

/**
 * =============
 * RENDER FUNCTION
 * =============
 */

  this.render = function () {

    this.content = $$('div.content');

    /**
     * ---------------------------------------------------
     * If the caption has title, it will show in inside the
     * paragraph
     * ---------------------------------------------------
     */

    var titleNode = this.node.getTitle();

    if (titleNode) {
      var titleView = this.createChildView(this.node.title);
      var titleEl = titleView.render().el;
      titleEl.classList.add('caption-title');
      this.content.appendChild(titleEl);
    }

    this.renderChildren();

    this.el.appendChild(this.content);
    return this;
  };

};

CaptionView.Prototype.prototype = CompositeView.prototype;
CaptionView.prototype = new CaptionView.Prototype();

module.exports = CaptionView;
