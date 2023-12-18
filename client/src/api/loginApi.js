import axios from "../lib/axios";

const loginApiHandler = () =>
  axios.post("auth/login", {
    user: { name: "hello" },
  });

const signUpApiHandler = (userInfo) =>
  axios.post("auth/signup", {
    user: userInfo,
  });

export { loginApiHandler, signUpApiHandler };
