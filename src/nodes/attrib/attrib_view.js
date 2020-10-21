"use strict";

var CompositeView = require("lens/article/nodes/composite").View;
var $$ = require("lens/substance/application").$$;

// Lens.Attrib.View
// ==========================================================================

var AttribView = function(node, viewFactory) {
  CompositeView.call(this, node, viewFactory);
};

AttribView.Prototype = function() {

  // Rendering
  // =============================
  //

  this.render = function() {
    this.content = $$('div.content');

    

    // Add title paragraph
    var descriptionNode = this.node.getDescription();

    // console.log({
    //   descriptionNode
    // })

    if (descriptionNode) {
      var descriptionView = this.createChildView(this.node.description);
      var descriptionElement = descriptionView.render().el;

    //   console.log({
    //     descriptionView: descriptionView
    //   })

    // console.log('funciona')

      descriptionElement.classList.add('attrib-title');
      descriptionElement.classList.add('.figure-attribution');
      this.content.appendChild(descriptionElement);
    //   this.content.appendChild($$('.figure-attribution', {text: this.node.attrib}));
    }

    this.renderChildren();

    this.el.appendChild(this.content);
    return this;
  };

};

AttribView.Prototype.prototype = CompositeView.prototype;
AttribView.prototype = new AttribView.Prototype();

module.exports = AttribView;
