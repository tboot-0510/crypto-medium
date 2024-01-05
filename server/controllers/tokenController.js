import { errorWithStatusCode } from "../middelware/error_handler.js";
import { coinmarketcapService } from "../services/coinmarketcap.js";

const getTokenPrice = () => {
  try {
    const price = coinmarketcapService.getNativeTokenPrice();
    return { price };
  } catch (err) {
    console.log("[ERROR]", err);

    throw errorWithStatusCode(500, Error({ message: err.message }));
  }
};

export { getTokenPrice };
