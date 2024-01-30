import axios from "../lib/axios";

const getTagsApiHandler = () => {
  return axios.get("tags", { params: { page: 1, limit: 10 } });
};

const submitTagsApiHandler = (userId, tagsInfo) =>
  axios.post(`tags/${userId}/submit`, {
    tags: tagsInfo,
  });

export { getTagsApiHandler, submitTagsApiHandler };
