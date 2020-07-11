# alphavantage-api
KISS API wrapper for alphavanatage.co. Had problems with other NPM packages being excessively complicated and not being maintained so I made this one that more closely mirrors the actual API. Also includes a `polish` function taken from [here](https://github.com/zackurben/alphavantage).


## Usage

```js
const AlphaVantage = require("simple-alphavantage");
const av = new AlphaVantage("your api key here");

av.get({
    function: "FX_INTRADAY",
    from_symbol: "EUR",
    to_symbol: "USD",
    interval: "5min",
    outputsize: "full",
}).then(data => {
    console.log("response:", AlphaVantage.polish(data));
}).catch(console.error);
```
