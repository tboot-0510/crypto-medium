import axios from "../lib/axios";

const fetchTokenPrice = () => axios.get("token/price");

export { fetchTokenPrice };
