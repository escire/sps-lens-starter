"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

/**
 * ============
 * 
 * ============
 */

var AttribView = function (node, viewFactory) {
  CompositeView.call(this, node, viewFactory);
};

AttribView.Prototype = function () {

  /**
   * ============
   * 
   * ============
   */

  this.render = function () {

    this.content = $$('div.content');


    // Add title paragraph
    var descriptionNode = this.node.getDescription();

    if (descriptionNode) {
      var descriptionView = this.createChildView(this.node.description);
      var descriptionElement = descriptionView.render().el;
      descriptionElement.classList.add('attrib-title');
      descriptionElement.classList.add('.figure-attribution');
      this.content.appendChild(descriptionElement);
    }

    this.renderChildren();

    this.el.appendChild(this.content);
    return this;
  };

};

AttribView.Prototype.prototype = CompositeView.prototype;
AttribView.prototype = new AttribView.Prototype();

module.exports = AttribView;
