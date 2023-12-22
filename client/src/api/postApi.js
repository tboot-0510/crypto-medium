import axios from "../lib/axios";

const makePostApiHandler = ({ postData }) => {
  axios.post("post/write", {
    post: postData,
  });
};

const editPostApiHandler = ({ postData }) => {
  axios.post("post/edit", {
    post: postData,
  });
};

export { makePostApiHandler, editPostApiHandler };
