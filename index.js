const fetch = require('node-fetch')
const express = require('express');
const app = express()
const port = 3000

/*
 * case (1): user exist on our system (userId is valid):
 *   case (1.1): user has non-zero BTC and non-zero ETH
 *   case (1.2): user has non-zero BTC and zero ETH
 *   case (1.3): user has zero BTC and non-zero ETH
 *   case (1.4): user has zero BTC and zero ETH
 * case (2): user does not exist on our system (userId not found)
 */
const userBalances = {
  "1": {
    "BTC": "0.5",
    "ETH": "2"
  },
  "2": {
    "BTC": "0.1",
    "ETH": "0"
  },
  "3": {
    "BTC": "0",
    "ETH": "5",
  },
  "4": {
    "BTC": "0",
    "ETH": "0"
  },
};

// returns the last price of the ${TOKEN}_USD pair
const getTickerPrice = async (currency) => {
  const currencyPair = (currency == "BTC") ? "btcusd" : "ethusd";
  const tickerUrl = `https://www.bitstamp.net/api/v2/ticker/${currencyPair}/`;
  try {
    const resp = await fetch(tickerUrl);
    const respJson = await resp.json();
    return respJson.last
  } catch (error){
    console.log(error)
    console.log(`Error fetching quote for ${currency}. Retrying in 3s...`)
    setTimeout(getTickerPrice, 3000);
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/balance/:id', async (req, res) => {
  const userBalance = userBalances[String(req.params.id)]
  if (typeof userBalance == 'undefined') {
    res.status(404).send('UserId Not Found');
  } else {
    const lastPriceBTC = await getTickerPrice("BTC");
    const lastPriceETH = await getTickerPrice("ETH");
    btcBalanceUSD = userBalance["BTC"] * lastPriceBTC;
    ethBalanceUSD = userBalance["ETH"] * lastPriceETH;
    res.send({
      totalBalanceUSD: btcBalanceUSD + ethBalanceUSD
    });
  };
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

module.exports = {
  server: app
};
