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

    this._annotationTypes = {
        "bold": "strong",
        "italic": "emphasis",
        "monospace": "code",
        "sub": "subscript",
        "sup": "superscript",
        "sc": "custom_annotation",
        "roman": "custom_annotation",
        "sans-serif": "custom_annotation",
        "styled-content": "custom_annotation",
        "underline": "underline",
        "ext-link": "link",
        "xref": "",
        "email": "link",
        "named-content": "",
        "inline-formula": "inline-formula",
        "uri": "link"
    };

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

    this.paragraph = function (state, children) {
        var doc = state.doc;

        // Reset whitespace handling at the beginning of a paragraph.
        // I.e., whitespaces at the beginning will be removed rigorously.
        state.skipWS = true;

        var node = {
            id: state.nextId("paragraph"),
            type: "paragraph",
            children: null
        };
        var nodes = [];

        var iterator = new util.dom.ChildNodeIterator(children);
        while (iterator.hasNext()) {
            var child = iterator.next();
            var type = util.dom.getNodeType(child);

            // annotated text node
            if (type === "text" || this.isAnnotation(type) || this.isInlineNode(type)) {
                var textNode = {
                    id: state.nextId("text"),
                    type: "text",
                    content: null
                };
                // pushing information to the stack so that annotations can be created appropriately
                state.stack.push({
                    path: [textNode.id, "content"]
                });
                // Note: this will consume as many textish elements (text and annotations)
                // but will return when hitting the first un-textish element.
                // In that case, the iterator will still have more elements
                // and the loop is continued
                // Before descending, we reset the iterator to provide the current element again.
                // TODO: We have disabled the described behavior as it seems
                // worse to break automatically on unknown inline tags,
                // than to render plain text, as it results in data loss.
                // If you find a situation where you want to flatten structure
                // found within a paragraph, use this.acceptedParagraphElements instead
                // which is used in a preparation step before converting paragraphs.
                var annotatedText = this._annotatedText(state, iterator.back(), { offset: 0, breakOnUnknown: false });

                // Ignore empty paragraphs
                if (annotatedText.length > 0) {
                    textNode.content = annotatedText;
                    doc.create(textNode);
                    nodes.push(textNode);
                }

                // popping the stack
                state.stack.pop();
            }
            // inline image node
            else if (type === "inline-graphic") {
                var url = child.getAttribute("xlink:href");
                var img = {
                    id: state.nextId("image"),
                    type: "image",
                    url: this.resolveURL(state, url)
                };
                doc.create(img);
                nodes.push(img);
            }
            else if (type === "inline-formula") {
                var formula = this.formula(state, child, "inline");
                if (formula) {
                    nodes.push(formula);
                }
            }
        }

        // return if there is no content
        if (nodes.length === 0) return null;

        // FIXME: ATM we can not unwrap single nodes, as there is code relying
        // on getting a paragraph with children
        // // if there is only a single node, do not create a paragraph around it
        // if (nodes.length === 1) {
        //   return nodes[0];
        // } else {
        //   node.children = _.map(nodes, function(n) { return n.id; } );
        //   doc.create(node);
        //   return node;
        // }

        node.children = _.map(nodes, function (n) { return n.id; });
        doc.create(node);
        return node;
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

    this.titleGroup = function (state, titleGroup) {
        var doc = state.doc;
        var articleTitle = titleGroup.querySelector("article-title");
        if (articleTitle) {
            doc.title = this.annotatedText(state, articleTitle, ['document', 'title']);
        }
        // Not yet supported:
        // <subtitle> Document Subtitle, zero or one
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

        return attribNode;
    };

    this.table = function (state, table) {
        var doc = state.doc;

        var tableNode = {
            "id": state.nextId("table"),
            "source_id": table.getAttribute("id"),
            "type": "table",
            "colgroup": null,
            "thead": null,
            "tbody": null,
        };

        var colgroup = table.querySelector('colgroup');

        if (colgroup) {
            var colgroupNode = this.colgroup(state, colgroup);
            if (colgroupNode) tableNode.colgroup = colgroupNode.id;
        }

        var thead = table.querySelector('thead');

        if (thead) {
            var theadNode = this.thead(state, thead);
            if (theadNode) tableNode.thead = theadNode.id;
        }

        var tbody = table.querySelector('tbody');

        if (tbody) {
            var tbodyNode = this.tbody(state, tbody);
            if (tbodyNode) tableNode.tbody = tbodyNode.id;
        }

        doc.create(tableNode);
        return tableNode;
    }

    this.colgroup = function (state, colgroup) {
        var doc = state.doc;

        var colgroupNode = {
            "id": state.nextId("colgroup"),
            "source_id": colgroup.getAttribute("id"),
            "type": "colgroup",
            "content": "",
        };

        colgroupNode.content = this.toHtml(colgroup);

        doc.create(colgroupNode);
        return colgroupNode;
    }

    this.thead = function (state, thead) {
        var doc = state.doc;

        var theadNode = {
            "id": state.nextId("thead"),
            "source_id": thead.getAttribute("id"),
            "type": "thead",
            "tr": [],
        };

        theadNode.content = this.toHtml(thead);

        var tableRows = thead.querySelectorAll('tr');

        if (tableRows.length > 0) {
            tableRows.forEach(tr => {
                var trNode = this.tr(state, tr);
                if (trNode) theadNode.tr.push(trNode.id)
            });
        }

        doc.create(theadNode);
        return theadNode;
    }

    this.th = function (state, th) {
        var doc = state.doc

        var thNode = {
            "id": state.nextId("th"),
            "source_id": th.getAttribute("id"),
            "type": "th",
            "description": ""
        }

        if (th) {
            var node = this.paragraph(state, th)
            if (node) thNode.description = node.id
        }

        doc.create(thNode);
        return thNode;
    }

    this.td = function (state, td) {
        var doc = state.doc

        var tdNode = {
            "id": state.nextId("td"),
            "source_id": td.getAttribute("id"),
            "type": "td",
            "description": ""
        }

        if (td) {
            // console.log({td})
            var node = this.paragraph(state, td)
            if (node) tdNode.description = node.id
        }

        doc.create(tdNode);
        return tdNode;
    }

    this.tr = function (state, tr) {
        var doc = state.doc

        var trNode = {
            "id": state.nextId("tr"),
            "source_id": tr.getAttribute("id"),
            "type": "tr",
            "td": [],
            "th": [],
        }

        var tableData = tr.querySelectorAll('td');

        if (tableData.length > 0) {
            tableData.forEach(td => {
                var tdNode = this.td(state, td);
                if (tdNode) trNode.td.push(tdNode.id)
            });
        }

        var tableHeader = tr.querySelectorAll('th');

        if (tableHeader.length > 0) {
            tableHeader.forEach(th => {
                var thNode = this.th(state, th);
                if (thNode) trNode.th.push(thNode.id)
            });
        }

        doc.create(trNode);
        return trNode;
    }

    this.tbody = function (state, tbody) {
        var doc = state.doc;

        var tbodyNode = {
            "id": state.nextId("tbody"),
            "source_id": tbody.getAttribute("id"),
            "type": "tbody",
            "tr": [],
        };

        var tableRows = tbody.querySelectorAll('tr');

        if (tableRows.length > 0) {
            tableRows.forEach(tr => {
                var trNode = this.tr(state, tr);
                if (trNode) tbodyNode.tr.push(trNode.id)
            });
        }

        doc.create(tbodyNode);
        return tbodyNode;
    }

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

        var label = figure.querySelector("label");
        if (label) {
            figureNode.label = this.annotatedText(state, label, [figureNode.id, 'label']);
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

    // Internal function for parsing annotated text
    // --------------------------------------------
    // As annotations are nested this is a bit more involved and meant for
    // internal use only.
    //
    this._annotatedText = function (state, iterator, options) {
        var plainText = "";

        var charPos = (options.offset === undefined) ? 0 : options.offset;
        var nested = !!options.nested;
        var breakOnUnknown = !!options.breakOnUnknown;

        while (iterator.hasNext()) {
            var el = iterator.next();
            // Plain text nodes...
            if (el.nodeType === Node.TEXT_NODE) {
                var text = state.acceptText(el.textContent);
                plainText += text;
                charPos += text.length;
            }
            // Annotations...
            else {
                var annotatedText;
                var type = util.dom.getNodeType(el);
                if (this.isAnnotation(type)) {
                    if (state.top().ignore.indexOf(type) < 0) {
                        var start = charPos;
                        if (this._annotationTextHandler[type]) {
                            annotatedText = this._annotationTextHandler[type].call(this, state, el, type, charPos);
                        } else {
                            annotatedText = this._getAnnotationText(state, el, type, charPos);
                        }
                        plainText += annotatedText;
                        charPos += annotatedText.length;
                        if (!state.ignoreAnnotations) {
                            this.createAnnotation(state, el, start, charPos);
                        }
                    }
                }
                else if (this.isInlineNode(type)) {
                    plainText += " ";
                    this.createInlineNode(state, el, charPos);
                }
                // Unsupported...
                else if (!breakOnUnknown) {
                    if (state.top().ignore.indexOf(type) < 0) {
                        annotatedText = this._getAnnotationText(state, el, type, charPos);
                        plainText += annotatedText;
                        charPos += annotatedText.length;
                    }
                } else {
                    if (nested) {
                        console.error("Node not supported in annoted text: " + type + "\n" + el.outerHTML);
                    }
                    else {
                        // on paragraph level other elements can break a text block
                        // we shift back the position and finish this call
                        iterator.back();
                        break;
                    }
                }
            }
        }

        return plainText;
    };

    // ======== 
    //  TABLE WRAP
    // =========

    this.footnote = function (state, footnoteElement) {

        var doc = state.doc;
        var footnote = {
            type: 'footnote',
            id: state.nextId('fn'),
            source_id: footnoteElement.getAttribute("id"),
            label: '',
            children: []
        };

        var children = footnoteElement.children;
        var i = 0;


        if (children[0].tagName.toLowerCase() === 'label') {
            footnote.label = this.annotatedText(state, children[0], [footnote.id, 'label']);
            i++;
        }

        footnote.children = [];
        for (; i < children.length; i++) {
            var nodes = this.paragraphGroup(state, children[i]);
            Array.prototype.push.apply(footnote.children, _.pluck(nodes, 'id'));
        }
        doc.create(footnote);
        // leave a trace for the catch-all converter
        // to know that this has been converted already
        footnoteElement.__converted__ = true;
        return footnote;
    };

    // ========= 
    //  TABLE WRAP
    // =========

    this.tableWrapFoot = function (state, tableWrapFoot) {
        var doc = state.doc;

        var tableWrapFootNode = {
            "id": state.nextId("table-wrap-foot"),
            "source_id": tableWrapFoot.getAttribute("id"),
            "type": "table_wrap_foot",
            "fn": [],
        };

        // var footnotes = tableWrapFoot.querySelectorAll('fn');

        // if (footnotes.length > 0) {
        //     footnotes.forEach(footnote => {
        //         var node = this.footnote(state, footnote)
        //         if (node) tableWrapFootNode.fn.push(node.id)
        //     });
        // }

        doc.create(tableWrapFootNode);
        return tableWrapFootNode;
    }

    // ========= 
    //  TABLE WRAP
    // ========= 


    this.tableWrap = function (state, tableWrap) {

        var doc = state.doc;
        var label = tableWrap.querySelector("label");

        // console.info({tableWrap});

        var tableNode = {
            "id": state.nextId("html_table"),
            "source_id": tableWrap.getAttribute("id"),
            "type": "html_table",
            "title": "",
            "label": label ? label.textContent : "Table",
            "content": "",
            "caption": null,
            "tables": null,
            "graphics": null,
            // Not supported yet ... need examples
            "footer": null,
            // doi: "" needed?
        };

        var graphicsArray = []

        /**
         * ----------------------------
         * Create table models 
         * and link it to tablewrap
         * ----------------------------
         */

        var tables = tableWrap.querySelectorAll("table");

        if (tables) {
            tableNode.tables = [];
            tables.forEach(table => {
                var node = this.table(state, table);
                if (node) tableNode.tables.push(node.id)
            });
        }

        // Titles can be annotated, thus delegate to paragraph
        var graphics = tableWrap.querySelectorAll("graphic");


        // var description = attrib.querySelector("description");
        if (graphics) {

            graphics.forEach(graphic => {

                // var url = "data/" + graphic.getAttribute("xlink:href");
                // var url = graphic.getAttribute("xlink:href");

                var img = {
                    id: state.nextId("image"),
                    type: "image",
                    url: this.resolveURL(state, url)
                };
                doc.create(img);
                graphicsArray.push(img);

            });

            tableNode.graphics = _.map(graphicsArray, function (n) { return n.id; });

        }

        /**
         * ----------------------------
         * Create table models 
         * and link it to tablewrap
         * ----------------------------
         */

        var tableWrapFoot = tableWrap.querySelector('table-wrap-foot')

        if (tableWrapFoot) {
            var tableWrapFootNode = this.tableWrapFoot(state, tableWrapFoot)
            if (tableWrapFootNode) tableNode.footer = tableWrapFootNode.id
        }

        this.extractTableCaption(state, tableNode, tableWrap);

        this.enhanceTable(state, tableNode, tableWrap);
        doc.create(tableNode);
        return tableNode;
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
                    for (let item of child.children) {
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
                    }
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
