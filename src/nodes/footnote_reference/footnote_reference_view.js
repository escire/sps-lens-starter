"use strict";

var AnnotationView = require('lens/article/nodes/annotation/annotation_view');
var $$ = require("lens/substance/application").$$;

var _ = require("underscore");

var FootnoteReferenceView = function(node, viewFactory) {
  AnnotationView.call(this, node, viewFactory);
  this.$el.addClass('footnote-reference');
  this._expanded = false;
};

FootnoteReferenceView.Prototype = function() {
  this.proccesedNotes = [];

  this.render = function() {
    var footnote = this._getFootnote();

    if(_.indexOf(this.proccesedNotes, footnote.id) !== -1) return;
    this.proccesedNotes.push(footnote.id);

    // this.el.innerHTML = formulaView.render().el.innerHTML;
    this.el.innerHTML = "";
    this.toggleEl = $$('a', {href: '#', html: footnote.properties.label});

    $(this.toggleEl).on('click', this._onToggle.bind(this));
    this.$el.append(this.toggleEl);
    this.footnoteView = this._createView(footnote).render();
    // HACK: some use xref with ref-type='fn' which will produce a different view class
    this.footnoteView.$el.addClass('footnote');
    if (this.node.properties.generated) {
      this.$el.addClass('sm-generated');
    }
    this.$el.append(this.footnoteView.el);
  };

  this._onToggle = function(e) {
    e.preventDefault();
    this.$el.toggleClass('sm-expanded');
  };

  this._createView = function(node) {
    var view = this.viewFactory.createView(node);
    return view;
  };

  this._getFootnote = function() {
    var node = this.node.document.get(this.node.target);
    return node;
  };
};

FootnoteReferenceView.Prototype.prototype = AnnotationView.prototype;
FootnoteReferenceView.prototype = new FootnoteReferenceView.Prototype();

module.exports = FootnoteReferenceView;
