import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: null,
    token: null
}

const forgotPasswordSlice = createSlice({
  name: "forgot-pasword",
  initialState,
  reducers: {
    SET_EMAIL: (state, action) => {
        state.email = action.payload.email
        state.token = action.payload.token 
    },
    CLEAR_EMAIL: (state) => {
        state.email = null
        state.token = null;
    }
  }
});

export const {SET_EMAIL,CLEAR_EMAIL} = forgotPasswordSlice.actions

export default forgotPasswordSlice