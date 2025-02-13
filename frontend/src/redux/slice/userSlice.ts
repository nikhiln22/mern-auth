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
    updateUserDetails: (
      state,
      action: PayloadAction<{ name?: string; email?: string; phone?: string }>
    ) => {
      if (state.user) {
        const { name, email, phone } = action.payload;
        if (name !== undefined) state.user.name = name;
        if (email !== undefined) state.user.email = email;
        if (phone !== undefined) state.user.phone = phone;
      }
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});


export const {
  loginSuccess,
  logoutSuccess,
  updateImagePath,
  updateUserDetails,
} = userSlice.actions;

export default userSlice.reducer;
