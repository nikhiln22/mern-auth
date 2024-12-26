import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../types";

export interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ userData: IUser }>) => {
      state.user = action.payload.userData;
      state.isAuthenticated = true;
    },
    updateImagePath: (state, action: PayloadAction<{ imagePath: string }>) => {
        if (state.user) {
          state.user.imagePath = action.payload.imagePath;
        }
      },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loginSuccess, logoutSuccess, updateImagePath } = userSlice.actions;

export default userSlice.reducer;
