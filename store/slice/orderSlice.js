import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import Order from '../../models/order'

export const asyncAddOrder = createAsyncThunk('orders/asyncAddOrder', 
   async (orderObj, thunkApi) => {
      const {cartItems, cartTotalAmount} = orderObj
      console.log("cartTotalAmount: ", cartTotalAmount)
      const token = thunkApi.getState().auth.token
      const userId = thunkApi.getState().auth.userId
      const date = new Date().toISOString()
      const res = await fetch(`https://rn-complete-guide-d4351.firebaseio.com/orders/${userId}.json?auth=${token}`,{
         method: "POST",
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            cartItems, 
            cartTotalAmount,
            date: date,
         })
      })
      if(!res.ok) {
        throw new Error('error in asyncAddOrder!')
      }
      const resData = await res.json()
      thunkApi.dispatch(addOrder(resData.name, cartItems, cartTotalAmount, date))
   }
)


export const fetchOrders = createAsyncThunk('orders/fetchOrders',
   async (obj,{getState})=> {
      try{
         const userId = getState().auth.userId
         const res = await fetch(`https://rn-complete-guide-d4351.firebaseio.com/orders/${userId}.json`)
         if( !res.ok) {
            throw new Error('Something went wrong!')
         }
         const resData = await res.json()
         console.log("fetch resData: ", resData)
         let loadedOrders = []
          
         for (const key in resData){
            loadedOrders.push(
               new Order(
                  key, 
                  resData[key].cartItems, 
                  +resData[key].cartTotalAmount,
                  resData[key].date,
               )
            )
         }
         return loadedOrders
      }catch(err) {
         console.log("ERR: ", err)
         throw err
      }
   }      
)

const initialState = {
   orders: []
}

const slice = createSlice({
   name : 'orders',
   initialState,
   reducers: {
      addOrder : {
         reducer: (state, action) => {
            const {id, items, amount, date} = action.payload 
            const newOrder = Order(
               id,
               items,
               +amount,
               date
            )     
            state.orders.push(newOrder)
         },
         prepare(id ,cartItems, totalAmount, date) {
            return {
               payload: {
                  id: id,
                  items: cartItems, 
                  amount : totalAmount,
                  date: date
               }
            }
         }
      }
   },
   extraReducers: {
      [asyncAddOrder.rejected] : (state, action) => {
         console.log("asyncAddorder err")
         throw action.error
      },
      [fetchOrders.rejected] : (state, action) => {
         throw action.error
      },
      [fetchOrders.fulfilled] : (state, action) => {
         state.orders = action.payload
      }
   }
})

export const {addOrder} = slice.actions

export default slice.reducer