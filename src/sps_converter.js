"use strict";

//var Config = require("./config");
var GetLocale = require("./get_locale.js");
var Locale = new GetLocale();

var LensConverter = require('lens/converter');

var _ = require("underscore");
var util = require("lens/substance/util");

var LensArticle = require("lens/article");
var SPSNodeTypes = require("./nodes");

var SPSConverter = function(options) {
    LensConverter.call(this, options);
};

SPSConverter.Prototype = function() {
    
    this.test = function(xmlDoc) {
        var article = xmlDoc.querySelector("article");
        var articleSPS = article.getAttribute("specific-use");
        if(typeof articleSPS === "string"){
            var spsInfo = articleSPS.split("-", 2);
            // if first array element equals to "sps" then use this converter
            if(spsInfo[0] == "sps"){
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
    this.createDocument = function() {
        var doc = new LensArticle({
            nodeTypes: SPSNodeTypes
        });
        return doc;
    };
    
    // Resolve figure urls
    // --------
    // 
    
    this.enhanceFigure = function(state, node, element) {
        var graphic = element.querySelector("graphic");
        var url = graphic.getAttribute("xlink:href");
        node.url = this.resolveURL(state, url);
    };
    
    this.resolveURL = function(state, url) {
        // Use absolute URL
        if (url.match(/http:\/\//)) return url;
        
        // Look up base url
        var baseURL = this.getBaseURL(state);
        
        if (baseURL) {
            return [baseURL, url].join('');
        } else {
            // Use special URL resolving for production articles
            return [
                //state.doc.id,
                "/data/",
                url,
            ].join('');
        }
    };

    // avoid the use of this
    this.citationTypes = {
        "mixed-citation": true,
        "element-citation": false
    };

    this.ref = function(state, ref) {
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
    this.citation = function(state, ref, citation, publication_type) {
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
};

SPSConverter.Prototype.prototype = LensConverter.prototype;
SPSConverter.prototype = new SPSConverter.Prototype();
SPSConverter.prototype.constructor = SPSConverter;

module.exports = SPSConverter;
