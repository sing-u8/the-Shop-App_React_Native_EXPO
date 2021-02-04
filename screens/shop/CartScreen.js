import React from 'react'
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator } from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'

import {removeFromCart} from '../../store/slice/cartSlice'
import {asyncAddOrder} from '../../store/slice/orderSlice'
import {clearCart} from '../../store/slice/cartSlice'

import Card from "../../components/UI/Card"

// *** 리덕스를 셀렉터를 여러 개를 쓸 떄 갯수만큼 랜더링이 중복되는 거 같음 ...
const CartScreen = (props) => {
   const [isLoading, setIsLoading] =React.useState(false)

   const reduxDispatch = useDispatch();
   const cartTotalAmount = useSelector(state => state.cart.totalAmount)
   const cartItems = useSelector(state =>{
      const transformedCartItems = []
      for (const key in state.cart.items ) {
         transformedCartItems.push({
            productId: key,
            productTitle: state.cart.items[key].productTitle,
            productPrice: state.cart.items[key].productPrice,
            quantity: state.cart.items[key].quantity,
            sum: state.cart.items[key].sum
         })
      }
      return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1)
   })
   const sendOrderHandler = async ()=> {
      setIsLoading(true)
      await reduxDispatch(asyncAddOrder({
         cartItems: cartItems, 
         cartTotalAmount: cartTotalAmount
      }))
      await reduxDispatch(clearCart())
      setIsLoading(false)
   }

   return (
      <View style={styles.screen}>
         <Card style={styles.summary}>
            <Text style={styles.summaryText}>
               Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
            </Text>
            {isLoading 
               ? (<ActivityIndicator 
                  size="small"
                  color={Colors.primary}
               />)
               :  (
                  <Button 
                  color={Colors.accent}
                  title="Order Now" 
                  disabled={cartItems.length === 0}
                  onPress={sendOrderHandler}
                  />
               ) 
            }
         </Card>
         <FlatList 
            data={cartItems} 
            keyExtractor={item => item.productId}
            renderItem={itemData => {
               return (
                  <CartItem 
                     quantity={itemData.item.quantity}
                     title={itemData.item.productTitle}
                     amount={itemData.item.sum}
                     deletable
                     onRemove={()=>{
                        reduxDispatch(removeFromCart(itemData.item.productId))
                     }}
                  />
               )
            }}   
         />
      </View>
   )
}

export default CartScreen

const styles = StyleSheet.create({
   screen:{
      margin: 20
   },
   summary:{      
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      padding: 10
   },
   summaryText:{
      fontFamily: 'open-sans-bold',
      fontSize: 18,
   },
   amount:{
     color: Colors.primary, 
   },
})
