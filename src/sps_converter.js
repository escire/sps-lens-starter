"use strict";

//var Config = require("./config");
var GetLocale = require("./get_locale.js");
var Locale = new GetLocale();

var LensConverter = require('lens/converter');

var _ = require("underscore");
var util = require("lens/substance/util");

var LensArticle = require("lens/article");
var SPSNodeTypes = require("./nodes");

var SPSConverter = function (options) {
    LensConverter.call(this, options);
};

SPSConverter.Prototype = function () {

    this.test = function (xmlDoc) {
        var article = xmlDoc.querySelector("article");
        var articleSPS = article.getAttribute("specific-use");
        if (typeof articleSPS === "string") {
            var spsInfo = articleSPS.split("-", 2);
            // if first array element equals to "sps" then use this converter
            if (spsInfo[0] == "sps") {
                //console.log("SPS converter");
                return true;
            }
        }
        return false;
    };

    // Localization
    this._contribTypeMapping = Locale._contribTypeMapping;

    // Override document factory so we can create a customized Lens article,
    // including overridden node types
    this.createDocument = function () {
        var doc = new LensArticle({
            nodeTypes: SPSNodeTypes
        });
        return doc;
    };

    // Resolve figure urls
    // --------
    // 

    // this.enhanceFigure = function(state, node, element) {
    //     var graphic = element.querySelector("graphic");
    //     var url = graphic.getAttribute("xlink:href");
    //     node.url = this.resolveURL(state, url);
    // };

    this.resolveURL = function (state, url) {
        // Just return absolute urls
        if (url.match(/http:/)) return url;
        return [
            state.options.baseURL,
            //ojs_gal_url,
            url
        ].join('');
    };

    // avoid the use of this
    this.citationTypes = {
        "mixed-citation": true,
        "element-citation": false
    };

    this.ref = function (state, ref) {
        var children = util.dom.getChildren(ref);

        // first we need to get publication-type attribute from children element-citation
        for (var i = 0; i < children.length; i++) {
            if (util.dom.getNodeType(children[i]) !== "element-citation") continue;
            var publication_type = children[i].getAttribute("publication-type");
        }

        // then we show mixed-citation sending publication type
        for (var i = 0; i < children.length; i++) {
            if (util.dom.getNodeType(children[i]) !== "mixed-citation") continue;
            this.citation(state, ref, children[i], publication_type);
        }
    };

    // References fix
    this.citation = function (state, ref, citation, publication_type) {
        var doc = state.doc;
        var citationNode;

        var id = state.nextId("article_citation");

        citationNode = {
            "id": id,
            "source_id": ref.getAttribute("id"),
            "type": "citation",
            //"citation_urls": [],
            "citation_text": citation.textContent,
            "publication_type": publication_type
        };

        doc.create(citationNode);
        doc.show("citations", id);

        return citationNode;
    };

    this.appGroup = function (state, appGroup) {
        var apps = appGroup.querySelectorAll('app');
        // SPS Fix: if there aren't appendices, don't show title
        if (apps.length === 0) return;

        var doc = state.doc;
        var title = appGroup.querySelector('title');
        if (!title) {
            console.error("FIXME: every app should have a title", this.toHtml(title));
        }

        var headingId = state.nextId("heading");
        // Insert top level element for Appendix
        var heading = doc.create({
            "type": "heading",
            "id": headingId,
            "level": 1,
            "content": "Appendices"
        });

        this.show(state, [heading]);
        _.each(apps, function (app) {
            state.sectionLevel = 2;
            this.app(state, app);
        }.bind(this));
    };

    // ====
    // attrib
    // ===

    this.attrib = function (state, attrib) {
        var doc = state.doc;

        var attribNode = {
            "id": state.nextId("attrib"),
            "source_id": attrib.getAttribute("id"),
            "type": "attrib",
            "description": "",
            "children": []
        };

        // console.log({
        //     attribNode
        // })

        // Titles can be annotated, thus delegate to paragraph
        var description = attrib;
        // var description = attrib.querySelector("description");
        if (description) {
            // Resolve description by delegating to the paragraph
            var node = this.paragraph(state, description);
            if (node) {
                attribNode.description = node.id;
            }
        }

        var children = [];
        var paragraphs = attrib.querySelectorAll("p");
        _.each(paragraphs, function (p) {
            // Only consider direct children
            if (p.parentNode !== attrib) return;
            var node = this.paragraph(state, p);
            if (node) children.push(node.id);
        }, this);

        attribNode.children = children;
        doc.create(attribNode);

        // console.log({
        //     attribNode
        // })

        return attribNode;
    };

    this.figure = function (state, figure) {
        var doc = state.doc;

        // Top level figure node
        var figureNode = {
            "type": "figure",
            "id": state.nextId("figure"),
            "source_id": figure.getAttribute("id"),
            "label": "Figure",
            "url": "",
            "caption": null,
            "attrib": null,
        };

        var labelEl = figure.querySelector("label");
        if (labelEl) {
            figureNode.label = this.annotatedText(state, labelEl, [figureNode.id, 'label']);
        }

        // Add a caption if available
        var caption = figure.querySelector("caption");


        if (caption) {
            var captionNode = this.caption(state, caption);
            if (captionNode) figureNode.caption = captionNode.id;
        }

        
        /**
         * ----------------------------------
         * If any attrib in the DOM exists
         * link the attrib to the figure node
         * -----------------------------------
         */
        
        var attribs = figure.querySelectorAll("attrib");

        if (attribs.length > 0) {
            figureNode.attrib = []
            attribs.forEach(attrib => {
                var attribNode = this.attrib(state, attrib);
                if (attribNode) figureNode.attrib.push(attribNode.id);
            });
        }


        var position = figure.getAttribute('position');
        if (position) {
            figureNode.position = position || '';
        }

        // Lets the configuration patch the figure node properties
        this.enhanceFigure(state, figureNode, figure);
        doc.create(figureNode);

        //HACK: add this information so that we can implement the catch-all converter for figures et al.
        figure._converted = true;

        return figureNode;
    };

    // Formula Node Type
    // --------

    this._getFormulaData = function (formulaElement) {
        var result = [];
        for (var child = formulaElement.firstElementChild; child; child = child.nextElementSibling) {
            var type = util.dom.getNodeType(child);

            /**
             * ---------------------------------------------------
             * If it has alternative tag it needs to get a subtag.
             * First mml:math, if doesn't exist, then graphic tag
             * ---------------------------------------------------
             */

            if (type == 'alternatives') {
                var element = _.find(child.children, element => element.tagName == 'mml:math')
                if (element) {
                    child = element;
                    type = 'mml:math'
                } else {
                    element = _.find(child.children, element => element.tagName == 'graphic')
                    if (element) {
                        child = element;
                        type = 'graphic'
                    }
                }
            }

            /**
             * ---------------------------------------------------
             * Add format and data attributes depending the 
             * type of the tag.
             * ---------------------------------------------------
             */

            switch (type) {
                case "graphic":
                case "inline-graphic":
                    result.push({
                        format: 'image',
                        data: child.getAttribute('xlink:href')
                    });
                    break;
                case "svg":
                    result.push({
                        format: "svg",
                        data: this.toHtml(child)
                    });
                    break;
                case "mml:math":
                case "math":
                    result.push({
                        format: "mathml",
                        data: this.mmlToHtmlString(child)
                    });
                    break;
                case "tex-math":
                    result.push({
                        format: "latex",
                        data: child.textContent
                    });
                    break;
                case "label":
                    // Skipping - is handled in this.formula()
                    break;
                case "alternatives":
                    console.log("========(4)")
                    console.log(child.children)
                    for (let item of child.children) {
                        console.log(item.tagName)
                        if (item.tagName == "mml:math") {
                            result.push({
                                format: "mathml",
                                data: this.mmlToHtmlString(item)
                            });
                            // break;
                        } else if (item.tagName == "graphic") {
                            result.push({
                                format: 'image',
                                data: item.getAttribute('xlink:href')
                            });
                            // break;
                        }
                        console.log(item.tagName);
                    }
                    console.log("========")
                    break;
                default:
                    console.error('Unsupported formula element of type ' + type);
            }
        }
        return result;
    };
};

SPSConverter.Prototype.prototype = LensConverter.prototype;
SPSConverter.prototype = new SPSConverter.Prototype();
SPSConverter.prototype.constructor = SPSConverter;

module.exports = SPSConverter;
