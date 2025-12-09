import { createSlice } from "@reduxjs/toolkit";

let parsedUser = null;
try {
const stored = localStorage.getItem("userInfo");
parsedUser = stored ? JSON.parse(stored) : null;
} catch (e) {
console.error("Invalid userInfo detected, clearing...", e);
localStorage.removeItem("userInfo");
}

let parsedToken = null;
try {
parsedToken = localStorage.getItem("token") || null;
} catch {
parsedToken = null;
}

// INITIAL STATE
const initialState = {
userDetails: parsedUser,
token: parsedToken,
loading: false,
error: null,
};

const saveUserToStorage = (user, token) => {
if (user) localStorage.setItem("userInfo", JSON.stringify(user));
if (token) localStorage.setItem("token", token);
};

const clearUserFromStorage = () => {
localStorage.removeItem("userInfo");
localStorage.removeItem("token");
};

// SLICE
const userSlice = createSlice({
name: "user",
initialState,

reducers: {
    //login
    loginStart: (state) => {
    state.loading = true;
    state.error = null;
    },

    loginSuccess: (state, action) => {
    const { user, token } = action.payload;

    state.userDetails = user;
    state.token = token;
    state.loading = false;
    state.error = null;

    saveUserToStorage(user, token);
    },

    loginFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    // logout
    logoutSuccess: (state) => {
    state.userDetails = null;
    state.token = null;
    state.loading = false;
    state.error = null;

    clearUserFromStorage();
    },

    // signup
    signupSuccess: (state, action) => {
    const { user, token } = action.payload;

    state.userDetails = user;
    state.token = token;
    state.loading = false;
    state.error = null;

    saveUserToStorage(user, token);
    },

    signupFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },
},
});

export const {
loginStart,
loginSuccess,
loginFailure,

logoutSuccess,

signupSuccess,
signupFailure,
} = userSlice.actions;

export default userSlice.reducer;
