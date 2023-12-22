import axios from "../lib/axios";

const getTopicData = () => {
  return axios.post("feed/tag", {
    tag: "blockchain",
  });
};

const getSuggestions = ({ userId }) => {
  return axios.get("feed/suggestions", {
    user: userId,
  });
};

const getRecommendations = ({ userId }) => {
  return axios.get("feed/recommendations", {
    user: userId,
  });
};

export { getTopicData, getSuggestions, getRecommendations };
