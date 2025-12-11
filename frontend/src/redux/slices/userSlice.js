import { createSlice } from "@reduxjs/toolkit";
import { saveUserInfo, clearUserInfo, getUserInfo } from "../../utils/auth";

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
            const { user } = action.payload;

            state.user = user;
            state.token = user.token;
            state.loading = false;
            state.error = null;

            saveUserInfo(user);
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
