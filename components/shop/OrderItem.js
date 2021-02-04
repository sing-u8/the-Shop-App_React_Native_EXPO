import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

import Colors from '../../constants/Colors'
import CartItem from './CartItem'
import Card from '../UI/Card'

const OrderItem = (props) => {

   const { amount, date, items } = props
   const [showDetails, setShowDetails] = React.useState(false)

   return (
      <Card style={styles.orderItem}>
         <View style={styles.summary}>
            <Text style={styles.totalAmount}>${amount.toFixed(2)}</Text>
            <Text style={styles.date}>{date}</Text>
         </View>
         <Button 
            color={Colors.primary} 
            title={showDetails ? "Hide details" : "Show details"} 
            onPress={()=> {
               setShowDetails(prevState=> !prevState)
            }}
         />
         {showDetails && (
            <View style={styles.detailItems}>
               {items.map(cartItem => <CartItem 
                  key={cartItem.productId}
                  quantity={cartItem.quantity}
                  amount ={cartItem.sum}
                  title={cartItem.productTitle}
               />)}
            </View>
         )}
      </Card>
   )
}

export default OrderItem

const styles = StyleSheet.create({
   orderItem: {
      margin: 20,
      padding: 10,
      alignItems: 'center',
   },
   summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15,
   },
   totalAmount: {
      fontFamily: 'open-sans-bold',
      fontSize: 16
   }, 
   date: {
      fontFamily: 'open-sans',
      fontSize: 16,
      color: '#888'
   },
   detailItems: {
      width:'100%'
   }

})
