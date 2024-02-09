import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  informations: {
    id: "",
    name: "",
    email: "",
    username: "",
    loggedIn: false,
    externalWalletAccount: "",
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
        externalWalletAccount: action.payload.walletAccount?.externalAccountId,
      },
    }),
    logoutUser: (state) => ({
      ...state,
      informations: { ...initialState.informations, loggedIn: false },
    }),
    updateExternalWalletAddress: (state, action) => ({
      ...state,
      informations: {
        ...state.informations,
        externalWalletAccount: action.payload.account,
      },
    }),
    updateUserId: (state, action) => ({
      ...state,
      informations: {
        ...state.informations,
        id: action.payload._id,
      },
    }),
    updatePendingTransaction: (state, action) => ({
      ...state,
      informations: {
        ...state.informations,
        pendingTransactionId: action.payload.transaction_id,
        pendingTransactionPostId: action.payload.post_id,
      },
    }),
  },
});

export const {
  loginUser,
  logoutUser,
  updateUserId,
  updateExternalWalletAddress,
  updatePendingTransaction,
} = userSlice.actions;

export default userSlice.reducer;
