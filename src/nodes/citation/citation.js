var _ = require('underscore');
var Document = require('lens/substance/document');

var GetLocale = require("../../get_locale.js");
var Locale = new GetLocale();

// Lens.Citation
// -----------------
//

var Citation = function(node, doc) {
  Document.Node.call(this, node, doc);
};

// Type definition
// -----------------
//

Citation.type = {
  "id": "article_citation", // type name
  "parent": "content",
  "properties": {
    "publication_type": "string",
    "source_id": "string",
    "citation_text": "string",
  }
};


// This is used for the auto-generated docs
// -----------------
//

Citation.description = {
  "name": "Citation",
  "remarks": [
    "A journal citation.",
    "This element can be used to describe all kinds of citations."
  ],
  "properties": {
    "publication_type": "The citation type, e.g.: book, journal, etc.",
    "citation_text": "Citation as described in original PDF",
  }
};



// Example Citation
// -----------------
//

Citation.example = {
  "id": "article_nature08160",
  "publication_type": "journal",
  "citation_text": "Green, J.R. y S. Scotchmer. 1995. On the division of profit in sequential innovation, The RAND Journal of Economics, 26(1): 20-33.",
};


Citation.Prototype = function() {

  // Returns the citation URLs if available
  // Falls back to the DOI url
  // Always returns an array;
  // this.urls = function() {
  //   return this.properties.citation_urls.length > 0 ? this.properties.citation_urls
  //                                                   : [this.properties.doi];
  // };

  this.getHeader = function() {
    return _.compact([this.properties.label, Locale._publicationTypes[this.properties.publication_type] || Locale._publicationTypes.reference]).join(' - ');
  };
};

Citation.Prototype.prototype = Document.Node.prototype;
Citation.prototype = new Citation.Prototype();
Citation.prototype.constructor = Citation;

Document.Node.defineProperties(Citation);

module.exports = Citation;
