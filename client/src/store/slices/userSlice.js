import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  informations: {
    id: "",
    name: "",
    email: "",
    username: "",
    loggedIn: false,
  },
  notificationsCount: {
    unread: 0,
    unarchived: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => ({
      ...state,
      informations: {
        loggedIn: true,
        ...action.payload,
        id: action.payload._id,
      },
    }),
    logoutUser: (state) => ({
      ...state,
      informations: { ...initialState.informations, loggedIn: false },
    }),
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
