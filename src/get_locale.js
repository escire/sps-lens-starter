var Config = require("./config");

var GetLocale = function() {
    switch(Config.locale){
        case 'es':
            return require('./locale/es');
        case 'en':
            return require('./locale/en');
        // case 'pt':
        //     return require('./locale/pt');
    }
}

module.exports = GetLocale;