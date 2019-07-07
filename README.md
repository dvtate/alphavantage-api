# alphavantage-api
KISS API wrapper for alphavanatage.co. Not sure why people make things so complicated. Also includes a `.polish` method stolen from [here](https://github.com/zackurben/alphavantage). <!--their package works, however it's poorly structured (spaghetti) and doesn't appear to be well maintained (likely because it's structure makes it unmaintainable) -->


## Usage

```js
// not on npm yet
const AlphaVantage = require("alphavantage-api"); // alphavantage.js
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
