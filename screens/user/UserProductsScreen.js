import React from 'react'
import { StyleSheet, Button, FlatList , Alert, View, Text} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import ProductItem from '../../components/shop//ProductItem'

import {deleteProduct} from '../../store/slice/cartSlice'
import {productActions, asyncDeleteProduct} from '../../store/slice/productsSlice'

import Colors from '../../constants/Colors'

const UserProductsScreen = (props) => {
   const userProducts = useSelector(state => state.products.userProducts)
   const reduxDispatch = useDispatch();

   const editProductHandler = (id) => {
      props.navigation.navigate({
         name:"EditProduct",
         params:{
            productId: id,
         } 
      })
   }
   const deleteHander= (id)=> {
      Alert.alert("Are you sure?", "Do you really want to delete this item?", [
         {text:"No", style:'default'},
         {text: 'Yes', style: 'destructive', onPress: ()=> {
            reduxDispatch(deleteProduct(id))
            reduxDispatch(asyncDeleteProduct(id))
            // reduxDispatch(productActions.deleteProduct(id))
         } }
      ])
   }

   if(userProducts.length === 0) {
      return (
         <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Text>No products found, maybe start creating some?</Text>
         </View>
      )
   }

   return (
      <FlatList 
         data={userProducts}
         keyExtractor={item => item.id}
         renderItem={itemData =>(
            <ProductItem
               image={itemData.item.imageUrl}
               title={itemData.item.title}
               price={itemData.item.price}
               onSelect={()=> {
                  editProductHandler(itemData.item.id)
               }}
            >
               <Button 
                  color={Colors.primary} 
                  title="Edit" 
                  onPress={()=>{
                     editProductHandler(itemData.item.id)
                  }} 
               />
              <Button 
                  color={Colors.primary} 
                  title="Delete" 
                  onPress={()=> {deleteHander(itemData.item.id)}}
               />              
            </ProductItem>
         )}
      />
   )
}

export default UserProductsScreen

const styles = StyleSheet.create({})
