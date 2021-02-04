import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import OrderItem from '../../components/shop/OrderItem'

import Colors from '../../constants/Colors'

import {fetchOrders} from '../../store/slice/orderSlice'

const OrdersScreen = (props) => {
   const [isLoading, setIsLoading] =React.useState(false)

   const reduxDispatch = useDispatch();
   const orders = useSelector(state => state.orders.orders)

   React.useEffect(()=>{
      setIsLoading(true)
      reduxDispatch(fetchOrders()).then(()=> {
         setIsLoading(false)
      })
   },[reduxDispatch])

   if(isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
         </View>
      )
   }

   
   if(orders.length === 0) {
      return (
         <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Text>No products found, maybe start ordering some products?</Text>
         </View>
      )
   }


   return (
      <FlatList 
         data={orders}
         keyExtractor={item => item.id}
         renderItem={itemData => 
            <OrderItem 
               amount={itemData.item.totalAmount}
               date={itemData.item.readableDate}
               items={itemData.item.items}
            />
         }
      />
   )
}

export default OrdersScreen

const styles = StyleSheet.create({
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   }
})
