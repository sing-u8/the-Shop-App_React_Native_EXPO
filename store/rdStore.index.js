import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import productsReducer from './slice/productsSlice'
import cartReducer from './slice/cartSlice'
import orderReducer from './slice/orderSlice'
import authReducer from './slice/authSlice'


const reduxStore = configureStore({
    reducer:{
        products: productsReducer,
        cart: cartReducer, 
        orders: orderReducer,
        auth: authReducer,
    },

});

export default reduxStore;

    // middleware: [logger]