import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string;
  name?: string;
  email?: string;
}

interface AuthState {
  userInfo: UserInfo | null;
}

const getInitialUserInfo = (): UserInfo | null => {
  try {
    const saved = localStorage.getItem("userInfo");
    if (!saved) return null;
    return JSON.parse(saved) as UserInfo;
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    return null;
  }
};

const initialState: AuthState = {
  userInfo: getInitialUserInfo(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
