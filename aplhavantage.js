'use strict';

/*
I've made this file as the library on NPM (https://github.com/zackurben/alphavantage)
is poorly designed and poorly maintained
*/

const request = require("request-promise-native");

const polish = require("./polish");

class AlphaVantage {
    constructor(key) {
        this.key = key;
    }

    static polish(data){
        return polish(data);
    }

    async query(options) {
        let url = "https://www.alphavantage.co/query?";
        let needAmp = false;
        for (opt in options) {
            if (needAmp)
                url += '&';
            else
                needAmp = true;
            url += `${opt}=${options[opt]}`;
        }
        url += "&apikey=" + this.key;
        let r = request(url);
        return JSON.parse(r);
    }
};

module.exports = AlphaVantage;
//module.exports.polish = polish;
