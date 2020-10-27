"use strict";

var _ = require("underscore");
var NodeView = require("../node").View;
var $$ = require("lens/substance/application").$$;
var ResourceView = require('lens/article/resource_view');

// Substance.Paragraph.View
// ==========================================================================

var HTMLTableView = function (node, viewFactory, options) {
	NodeView.call(this, node, viewFactory);
	this.childrenViews = [];

	// Mix-in
	ResourceView.call(this, options);

};

HTMLTableView.Prototype = function () {

	// Mix-in
	_.extend(this, ResourceView.prototype);

	this.isZoomable = true;

	this.renderBody = function () {

		this.renderChildren();

		// ---------------
		// Display footer
		// ---------------

		var footers = $$('.footers', {
			children: _.map(this.node.footers, function (footer) {
				return $$('.footer', { html: "<b>" + footer.label + "</b> " + footer.content });
			})
		});


		// ----------------
		// Display caption
		// -----------------

		if (this.node.caption) {
			var captionView = this.createView(this.node.caption);
			this.content.appendChild(captionView.render().el);
		}

		this.content.appendChild(footers);
	};

	this.renderChildren = function () {
		var children = this.node.getChildrenIds();

		// ----------------------------
		//  for each child of table-wrap,
		// append it
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

HTMLTableView.Prototype.prototype = NodeView.prototype;
HTMLTableView.prototype = new HTMLTableView.Prototype();

module.exports = HTMLTableView;
