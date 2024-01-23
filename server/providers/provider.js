import { ethers } from "ethers";
import { networks } from "./networks.js";
import "dotenv/config";

const getAlchemyProvider = (networkId) => {
  const { alchemy_name, provider_api_key } = networks[networkId];
  return new ethers.AlchemyProvider(alchemy_name, provider_api_key);
};

export default getAlchemyProvider;
