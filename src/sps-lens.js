"use strict";

var Lens = require("lens/reader");

// All available converters
var LensConverter = require("lens/converter");
var SPSConverter = require("./sps_converter");

var LensApp = function(config) {
    Lens.call(this, config);
};

LensApp.Prototype = function() {
    
    // Custom converters
    // --------------
    // 
    
    this.getConverters = function(converterOptions) {
        return [
            new SPSConverter(converterOptions),
            new LensConverter(converterOptions)
        ]
    };
    
};

LensApp.Prototype.prototype = Lens.prototype;
LensApp.prototype = new LensApp.Prototype();
LensApp.prototype.constructor = LensApp;

module.exports = LensApp;