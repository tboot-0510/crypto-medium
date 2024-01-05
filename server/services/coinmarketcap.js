import logger from "./logger.js";
import axios from "axios";

const coinmarketcapApiKey = process.env.COINMARKETCAP_API_KEY;

export class CoinMarketCapService {
  priceCache = {};
  token = null;
  currency = null;
  logger = logger;

  constructor(token, currency) {
    this.priceCache[token] = {
      [currency]: "",
    };
    this.token = token;
    this.currency = currency;

    this.checkTokenPriceFees();
  }

  // Call CoinMarketCap API to get token price
  // 333 calls/day - 10,000 calls/month
  // ~13 calls/hour - 1 call/4min30
  checkTokenPriceFees() {
    this.fetchNativeTokenPrice(this.token, this.currency).then((res) => {
      return res;
    });

    // const updateTime = 270000; // 4min30
    const updateTime = 600000; // 10min
    const interval = setInterval(async () => {
      await this.fetchNativeTokenPrice(this.token, this.currency);
    }, updateTime);
    return interval;
  }

  getNativeTokenPrice() {
    return this.priceCache[this.token][this.currency];
  }

  fetchNativeTokenPrice = async () => {
    if (!["MATIC"].includes(this.token)) {
      throw errorWithStatusCode(
        422,
        Error(
          `Requested ${this.token} Price is not supported. Supported : "MATIC"`
        )
      );
    }
    if (!["EUR", "USD"].includes(this.currency)) {
      throw errorWithStatusCode(
        422,
        Error(
          `Requested ${this.token} Price in ${this.currency} is not supported. Supported : "EUR", "USD"`
        )
      );
    }
    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

    try {
      const { data } = await axios({
        method: "get",
        url,
        params: {
          symbol: this.token,
          convert: this.currency,
        },
        headers: {
          "X-CMC_PRO_API_KEY": coinmarketcapApiKey,
        },
      });
      this.priceCache[this.token][this.currency] =
        data.data[this.token]?.quote[this.currency].price;

      this.logger.info(
        `[${new Date().toISOString()}]${this.token} Price in ${this.currency}:${
          data.data[this.token]?.quote[this.currency].price
        }`
      );
    } catch (e) {
      this.logger.warn(`Error fetching ${this.currency} Price ${url} : ${e}`);
    }
  };
}

export const coinmarketcapService = new CoinMarketCapService("MATIC", "USD");
