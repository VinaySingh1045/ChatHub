// import { authSlice } from '../features/authSlice.js'
import authReducer from '../features/authSlice.js'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store