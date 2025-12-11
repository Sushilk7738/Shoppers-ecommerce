export const getUserInfo = () => {
try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
} catch {
    return null;
}
};

export const getAuthToken = () => {
return getUserInfo()?.token || null;
};

export const saveUserInfo = (data) => {
if (!data) return;
localStorage.setItem("userInfo", JSON.stringify(data));
};

export const clearUserInfo = () => {
localStorage.removeItem("userInfo");
};
