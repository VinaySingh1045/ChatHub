import authReducer from '../features/authSlice.js'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const reducer = combineReducers({
    auth: authReducer,

})

const persistedReducer = persistReducer(persistConfig, reducer)
export const store = configureStore({
    reducer: persistedReducer,
});

export default store