// slices/AuthSlice.js
export const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => {
    console.log("Setting userInfo:", userInfo); // Debug log
    set({ userInfo });
  },
});
