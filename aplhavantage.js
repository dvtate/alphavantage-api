'use strict';

/*
I've made this file as the library on NPM (https://github.com/zackurben/alphavantage)
is poorly designed and poorly maintained
*/


const request = require('request-promise-native');

/**
 * Time stamp regex that AlphaVantage uses.
 */
const timestamp = /[0-9]{4}-[0-9]{2}-[0-9]{2}( [0-9]{2}:[0-9]{2}:[0-9]{2})?/g;

/**
 * Price regex for target markets in target currency.
 */
const cryptoMarketPrice = /1a\. price \(.*\)/g;

/**
 * Price open regex for target markets in target currency.
 */
const cryptoMarketOpen = /1a\. open \(.*\)/g;

/**
 * Price high regex for target markets in target currency.
 */
const cryptoMarketHigh = /2a\. high \(.*\)/g;

/**
 * Price low regex for target markets in target currency.
 */
const cryptoMarketLow = /3a\. low \(.*\)/g;

/**
 * Price close regex for target markets in target currency.
 */
const cryptoMarketClose = /4a\. close \(.*\)/g;

/**
 * The data keys to replace from the AlphaVantage API.
 */
const keys = {
  'Aroon Down': 'down',
  'Aroon Up': 'up',
  'Meta Data': 'meta',
  'Realtime Currency Exchange Rate': 'rate',
  'Rank A: Real-Time Performance': 'real',
  'Rank B: 1 Day Performance': '1day',
  'Rank C: 5 Day Performance': '5day',
  'Rank D: 1 Month Performance': '1month',
  'Rank E: 3 Month Performance': '3month',
  'Rank F: Year-to-Date (YTD) Performance': 'ytd',
  'Rank G: 1 Year Performance': '1year',
  'Rank H: 3 Year Performance': '3year',
  'Rank I: 5 Year Performance': '5year',
  'Rank J: 10 Year Performance': '10year',
  Information: 'information',
  'Last Refreshed': 'updated',
  'Time Series (1min)': 'data',
  'Time Series (Daily)': 'data',
  'Time Series (Digital Currency Intraday)': 'data',
  'Time Series (Digital Currency Daily)': 'data',
  'Time Series (Digital Currency Weekly)': 'data',
  'Time Series (Digital Currency Monthly)': 'data',
  'Time Series FX (Daily)': 'data',
  'Weekly Time Series': 'data',
  'Weekly Adjusted Time Series': 'data',
  'Monthly Adjusted Time Series': 'data',
  'Monthly Time Series': 'data',
  'Stock Quotes': 'data',
  'Global Quote': 'data',
  'Technical Analysis: SMA': 'data',
  'Technical Analysis: EMA': 'data',
  'Technical Analysis: WMA': 'data',
  'Technical Analysis: DEMA': 'data',
  'Technical Analysis: TEMA': 'data',
  'Technical Analysis: TRIMA': 'data',
  'Technical Analysis: KAMA': 'data',
  'Technical Analysis: MAMA': 'data',
  'Technical Analysis: T3': 'data',
  'Technical Analysis: MACD': 'data',
  'Technical Analysis: MACDEXT': 'data',
  'Technical Analysis: STOCH': 'data',
  'Technical Analysis: STOCHF': 'data',
  'Technical Analysis: RSI': 'data',
  'Technical Analysis: STOCHRSI': 'data',
  'Technical Analysis: WILLR': 'data',
  'Technical Analysis: ADX': 'data',
  'Technical Analysis: ADXR': 'data',
  'Technical Analysis: APO': 'data',
  'Technical Analysis: PPO': 'data',
  'Technical Analysis: MOM': 'data',
  'Technical Analysis: BOP': 'data',
  'Technical Analysis: CCI': 'data',
  'Technical Analysis: CMO': 'data',
  'Technical Analysis: ROC': 'data',
  'Technical Analysis: ROCR': 'data',
  'Technical Analysis: AROON': 'data',
  'Technical Analysis: AROONOSC': 'data',
  'Technical Analysis: MFI': 'data',
  'Technical Analysis: TRIX': 'data',
  'Technical Analysis: ULTOSC': 'data',
  'Technical Analysis: DX': 'data',
  'Technical Analysis: MINUS_DI': 'data',
  'Technical Analysis: PLUS_DI': 'data',
  'Technical Analysis: MINUS_DM': 'data',
  'Technical Analysis: PLUS_DM': 'data',
  'Technical Analysis: BBANDS': 'data',
  'Technical Analysis: MIDPOINT': 'data',
  'Technical Analysis: MIDPRICE': 'data',
  'Technical Analysis: SAR': 'data',
  'Technical Analysis: TRANGE': 'data',
  'Technical Analysis: ATR': 'data',
  'Technical Analysis: NATR': 'data',
  'Technical Analysis: Chaikin A/D': 'data',
  'Technical Analysis: ADOSC': 'data',
  'Technical Analysis: OBV': 'data',
  'Technical Analysis: HT_TRENDLINE': 'data',
  'Technical Analysis: HT_SINE': 'data',
  'Technical Analysis: HT_TRENDMODE': 'data',
  'Technical Analysis: HT_DCPERIOD': 'data',
  'Technical Analysis: HT_DCPHASE': 'data',
  'Technical Analysis: HT_PHASOR': 'data',
  '01. symbol': 'symbol',
  '02. open': 'open',
  '03. high': 'high',
  '04. low': 'low',
  '05. price': 'price',
  '06. volume': 'volume',
  '07. latest trading day': 'latest_trading_day',
  '08. previous close': 'prev_close',
  '09. change': 'change',
  '10. change percent': 'change_percent',
  '1. Information': 'information',
  '1. From_Currency Code': 'from_currency',
  '1: Symbol': 'symbol',
  '1. open': 'open',
  '1b. price (USD)': 'usd',
  '1b. open (USD)': 'usd_open',
  '2. price': 'price',
  '2. high': 'high',
  '2. From_Currency Name': 'from_currency_name',
  '2. Symbol': 'symbol',
  '2. volume': 'volume',
  '2: Indicator': 'indicator',
  '2. Digital Currency Code': 'coin',
  '2b. high (USD)': 'usd_high',
  '3. low': 'low',
  '3. To_Currency Code': 'to_currency',
  '3. Last Refreshed': 'updated',
  '3. Digital Currency Name': 'coin_name',
  '3. market cap (USD)': 'cap',
  '3. volume': 'volume',
  '3b. low (USD)': 'usd_low',
  '4. Output Size': 'size',
  '4. To_Currency Name': 'to_currency_name',
  '4. close': 'close',
  '4. Interval': 'interval',
  '4. Market Code': 'market',
  '4. Time Zone': 'zone',
  '4. timestamp': 'updated',
  '4b. close (USD)': 'usd_close',
  '5. adjusted close': 'adjusted',
  '5. Exchange Rate': 'value',
  '5. Market Name': 'market_name',
  '5: Time Period': 'period',
  '5. Output Size': 'size',
  '5. Time Zone': 'zone',
  '5. volume': 'volume',
  '5: Series Type': 'series',
  '5.1: Fast Limit': 'fastlimit',
  '5.1: Fast Period': 'fastperiod',
  '5.1: FastK Period': 'fastkperiod',
  '5.1: Acceleration': 'acceleration',
  '5.1: Time Period 1': 'timeperiod1',
  '5.2: Slow Limit': 'slowlimit',
  '5.2: Slow Period': 'slowperiod',
  '5.2: SlowK Period': 'slowkperiod',
  '5.2: FastD Period': 'fastdperiod',
  '5.2: SlowK Period': 'slowkperiod',
  '5.2: Maximum': 'maximum',
  '5.2: Time Period 2': 'timeperiod2',
  '5.3: Signal Period': 'signalperiod',
  '5.3: SlowK MA Type': 'slowkmatype',
  '5.3: FastD MA Type': 'fastdmatype',
  '5.3: MA Type': 'matype',
  '5.3: Time Period 3': 'timeperiod3',
  '5.4: Fast MA Type': 'fastmatype',
  '5.4: SlowD Period': 'slowdperiod',
  '5.5: Slow MA Type': 'slowmatype',
  '5.5: SlowD MA Type': 'slowdmatype',
  '5.6: Signal MA Type': 'signalmatype',
  '6. volume': 'volume',
  '6. Time Zone': 'zone',
  '6. market cap (USD)': 'cap',
  '6. Last Refreshed': 'updated',
  '6: Volume Factor (vFactor)': 'volume',
  '6: Series Type': 'series',
  '6. Interval': 'interval',
  '6.1: FastK Period': 'fastkperiod',
  '6.1: Deviation multiplier for upper band': 'nbdevup',
  '6.2: FastD Period': 'fastdperiod',
  '6.2: Deviation multiplier for lower band': 'nbdevdn',
  '6.3: FastD MA Type': 'fastdmatype',
  '6.3: MA Type': 'matype',
  '7: Series Type': 'series',
  '7. Time Zone': 'zone',
  '7. Last Refreshed': 'updated',
  '7. dividend amount': 'dividend',
  '8. Time Zone': 'zone',
  '8. split coefficient': 'split',
  '1. symbol': 'symbol',
  '2. name': 'name',
  '3. type': 'type',
  '4. region': 'region',
  '5. marketOpen': 'market_open',
  '6. marketClose': 'market_close',
  '7. timezone': 'zone',
  '8. currency': 'currency',
  '9. matchScore': 'match_score'
};

/**
   * Recursively walk the data tree and replace weird keys with a normalized set.
   *
   * @param {Object|String|Number} data
   *   The data to normalize.
   *
   * @returns {Object|String|Number}
   *   Normalized data.
   */
function polish(data) {
    // If this is not an object, dont recurse.
    if (!data || typeof data !== 'object')
        return data;


    // If the data is a complex object, walk all subtrees to normalize all branches.
    let clean = {};
    for (key in data) {
        key = key.toString();

        // If the key is a date time string, convert it to an iso timestamp.
        if (timestamp.test(key)) {
            clean[new Date(key).toISOString()] = polish(data[key]);
            return;
        }

        // Rekey the crypto market open currency.
        if (cryptoMarketOpen.test(key)) {
            clean['market_open'] = polish(data[key]);
            return;
        }

        // Rekey the crypto market high currency.
        if (cryptoMarketHigh.test(key)) {
            clean['market_high'] = polish(data[key]);
            return;
        }

        // Rekey the crypto market low currency.
        if (cryptoMarketLow.test(key)) {
            clean['market_low'] = polish(data[key]);
            return;
        }

        // Rekey the crypto market close currency.
        if (cryptoMarketClose.test(key)) {
            clean['market_close'] = polish(data[key]);
            return;
        }

        clean[keys[key] || key] = polish(data[key]);
    });

    return clean;
};


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
