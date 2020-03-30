"use strict";

var _ = require('underscore');
var $$ = require("lens/substance/application").$$;
var NodeView = require("lens/article/nodes/node").View;
var ResourceView = require('lens/article/resource_view');

// Lens.Citation.View
// ==========================================================================


var CitationView = function(node, viewFactory, options) {
  NodeView.apply(this, arguments);

  // Mix-in
  ResourceView.call(this, options);

};


CitationView.Prototype = function() {

  // Mix-in
  _.extend(this, ResourceView.prototype);

  this.renderBody = function() {
    var frag = document.createDocumentFragment();
    var node = this.node;

    frag.appendChild($$('.source', {
      html: node.citation_text
    }));

    // TODO: Add display citations urls
    // -------

    /*
    if (node.citation_urls.length > 0) {
      var citationUrlsEl = $$('.citation-urls');

      _.each(node.citation_urls, function(url) {
        citationUrlsEl.appendChild($$('a.url', {
          href: url.url,
          text: url.name,
          target: "_blank"
        }));
      });

      frag.appendChild(citationUrlsEl);      
    }
    */

    this.content.appendChild(frag);
  };
};

CitationView.Prototype.prototype = NodeView.prototype;
CitationView.prototype = new CitationView.Prototype();
CitationView.prototype.constructor = CitationView;

module.exports = CitationView;
