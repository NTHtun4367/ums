import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/type";

interface AuthState {
  // Use the central User type to ensure consistency across the app
  userInfo: User | null;
}

const getInitialUserInfo = (): User | null => {
  try {
    const saved = localStorage.getItem("userInfo");
    if (!saved) return null;
    return JSON.parse(saved) as User;
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
    setUserInfo: (state, action: PayloadAction<User>) => {
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
