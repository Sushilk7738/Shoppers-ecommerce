import { createSlice } from "@reduxjs/toolkit";
import { saveUserInfo, clearUserInfo, getUserInfo } from "../../utils/Auth";

const initialState = {
    user: getUserInfo(),
    token: getUserInfo()?.token || null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },

        loginSuccess(state, action) {
            if (!action.payload) return;

            state.user = action.payload;
            state.token = action.payload.token || null;

            state.loading = false;
            state.error = null;

            saveUserInfo(action.payload);
        },

        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        logout(state) {
            state.user = null;
            state.token = null;
            state.loading = false;
            clearUserInfo();
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout
} = userSlice.actions;

export default userSlice.reducer;
