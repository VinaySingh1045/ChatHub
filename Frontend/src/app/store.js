// import { authSlice } from '../features/authSlice.js'
import authReducer from '../features/authSlice.js'
import contactsReducer from '../features/contactSlice.js'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contacts: contactsReducer
    },
});

export default store