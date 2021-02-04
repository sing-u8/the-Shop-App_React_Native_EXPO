import {createSlice, createEntityAdapter} from '@reduxjs/toolkit'
import CartItem from '../../models/cart-item'

const initialState = {
   items: {},
   totalAmount: 0
}

const slice = createSlice({
   name: "cart",
   initialState,
   reducers:{
      addToCart:{
         reducer: (state, action) => {
            const {price, title, id} = action.payload //payload = product class data
            
            if(state.items[id]){
               state.items[id].quantity += 1
               state.items[id].sum += price
               state.totalAmount += price
            } else {
               const newCartItem =  CartItem(1,price,title,price)
               state.items = { ...state.items, [id]: newCartItem }
               state.totalAmount += price
            }
         },
      },
      removeFromCart:{
         reducer: (state, action) => {
            const productId = action.payload // shoud be productId of Product
            const selectedProduct = state.items[productId]
            const currentQuantity = selectedProduct.quantity
            if( currentQuantity > 1) {
               state.items[productId].quantity -= 1
               state.items[productId].sum -= state.items[productId].productPrice
            } else {
               delete state.items[productId]
            }
            state.totalAmount -= selectedProduct.productPrice
         }
      },
      clearCart:{
         reducer:(state,action)=> {
            state.items = {}
            state.totalAmount = 0
         }
      },
      deleteProduct:{
         reducer:(state, action)=> {
            const {pid} = action.payload
            if(state.items[pid]){
               state.totalAmount -= state.items[pid].sum
               delete state.items[pid]
            } 
         },
         prepare(productId) {
            return { payload: { pid: productId } } }
     }
   }
})

export const {addToCart, removeFromCart, clearCart, deleteProduct} =slice.actions

export default slice.reducer