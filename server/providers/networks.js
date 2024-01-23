import "dotenv/config";

export const networks = {
  80001: {
    name: "mumbai",
    alchemy_name: "maticmum",
    type: 2,
    chain_id: 80001,
    provider_api_key: process.env.ALCHEMY_POLYGON_API_KEY,
    provider_api_url: process.env.ALCHEMY_POLYGON_API_URL_ROOT,
    etherscan_url: "https://api-testnet.polygonscan.com/",
    gas_station_url: "https://gasstation-testnet.polygon.technology/v2",
    blockchain_explorer_url: "https://mumbai.polygonscan.com",
  },
};
