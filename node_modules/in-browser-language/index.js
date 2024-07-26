"use strict";

var list = function list () {
    var navigator = window.navigator || window.clientInformation || {};

    var languages = [].concat(
        navigator.languages,
        navigator.language,
        navigator.userLanguage,
        navigator.browserLanguage,
        navigator.systemLanguage
    );

    var results = [],
        language,
        i;

    for(i = 0; i < languages.length; i++) {
        language = languages[i];

        if (
            language && 
            (language = language.replace(/-.*/,'').toLowerCase()) && 
            results.indexOf(language) === -1
        ) {
            results.push(language);
        }
    }

    return results;
};

var first = function first () {
    var languages = list();

    return languages.length ? languages[0] : null;
};

var pick = function pick (proposedLanguages, defaultLanguage) {
    var languages = list(),
        result = null,
        i;

    defaultLanguage = defaultLanguage || null;

    for (i = 0; i < languages.length && result === null; i++) {
        if (proposedLanguages.indexOf(languages[i]) !== -1) {
            result = languages[i];
        }
    }

    if(result === null) {
        result = defaultLanguage;
    }

    return result;
};

module.exports = {
    first : first,
    list : list,
    pick : pick
};
