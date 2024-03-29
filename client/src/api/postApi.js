import axios from "../lib/axios";

const makePostApiHandler = (postData) => {
  return axios.post("post/write", {
    post: postData,
  });
};

const editPostApiHandler = ({ postData }) => {
  axios.post("post/edit", {
    post: postData,
  });
};

const getPostsApiHandler = () => {
  return axios.get("post", { params: { page: 1, limit: 10 } });
};

const getPostIdApiHandler = (postId) => {
  return axios.get(`/post/${postId}`);
};

const getPostVoteApiHandler = (postId) => {
  return axios.get(`/post/${postId}/votes`);
};

const getTrendingPostsApiHandler = () => {
  return axios.get("/post/trending");
};

export {
  makePostApiHandler,
  editPostApiHandler,
  getPostIdApiHandler,
  getPostsApiHandler,
  getPostVoteApiHandler,
  getTrendingPostsApiHandler,
};
