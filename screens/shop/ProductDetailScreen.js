import React from 'react'
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native'

import Colors from '../../constants/Colors'
import {useSelector, useDispatch} from 'react-redux'

import {addToCart} from '../../store/slice/cartSlice'

const ProductDetailScreen = (props) => {
   const productId = props.route.params.productId;
   const selectedProduct = useSelector(
      state => state.products.availableProducts.find(prod=> prod.id === productId
   ))
   const reduxDispatch = useDispatch();
   return (
      <ScrollView>
         <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
         <View style={styles.actions}>
            <Button 
               color={Colors.primary} 
               title="Add to Cart" 
               onPress={() =>{
                  reduxDispatch(addToCart(selectedProduct))
               }} 
            />
         </View>
         <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
         <Text style={styles.description}>{selectedProduct.description}</Text>
      </ScrollView>
   )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
   image:{
      width: '100%',
      height: 300,
   },
   actions:{
      marginVertical: 10,
      alignItems: 'center',
   },
   price:{
      fontSize: 20,
      color: '#888',
      textAlign: 'center',
      marginVertical: 20,
      fontFamily: 'open-sans-bold',
   },
   description:{
      fontSize: 14,
      textAlign: 'center',
      marginHorizontal: 20,
      fontFamily: 'open-sans',
   },
})
