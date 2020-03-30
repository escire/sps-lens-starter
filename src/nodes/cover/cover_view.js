var LensNodes = require("lens/article/nodes");
var CoverView = LensNodes["cover"].View;
var $$ = require("lens/substance/application").$$;

var SPSCoverView = function(node, viewFactory) {
  CoverView.call(this, node, viewFactory);
};

SPSCoverView.Prototype = function() {
  this.render = function() {
    CoverView.prototype.render.call(this);

    var refUrl = encodeURIComponent(window.location.href);

    // Add journal name
    var pubInfo = this.node.document.get('publication_info');

    if (pubInfo){
      var introEl = $$('.intro.container', {
        children: [
          $$('.subjects', {
            html: pubInfo.journal
          }),
        ]
      });
    }
    // Prepend
    this.content.insertBefore(introEl, this.content.firstChild);
    
    return this;
  }
};

SPSCoverView.Prototype.prototype = CoverView.prototype;
SPSCoverView.prototype = new SPSCoverView.Prototype();
SPSCoverView.prototype.constructor = SPSCoverView;

module.exports = SPSCoverView;
