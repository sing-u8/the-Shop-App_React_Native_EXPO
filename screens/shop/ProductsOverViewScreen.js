import React from 'react';
import { StyleSheet, Button, Text, View, FlatList, ActivityIndicator } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import ProductItem from '../../components/shop/ProductItem'

import {addToCart} from '../../store/slice/cartSlice'

import Colors from '../../constants/Colors'

import {fetchProducts} from '../../store/slice/productsSlice' 


const ProductsOverViewScreen = (props) => {
    const [isLoading, setIsLoading] =React.useState(false)
    const [ isRefreshing, setIsRefreshing ] = React.useState(false)
    const [error, setError] = React.useState(null)
    const products = useSelector(state=> {
        return state.products.availableProducts;
    });
    const reduxDispatch = useDispatch();

    const loadProducts = React.useCallback( async ()=> {
        setError(null)
        setIsRefreshing(true)
        try{
            await reduxDispatch(fetchProducts())
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false)
    },[reduxDispatch, setIsLoading, setError] )

    React.useEffect(() => {
        
        const unsubscribe = props.navigation.addListener('focus', ()=>{

            loadProducts()
        })
        return unsubscribe;
    }, [props.navigation])

    // 처음에 불러올 떄 필요하다는 데...? 
    // 코드 수정하고 리프레쉬할 떄만 문제있고 폰에서 사용할 땐 별 문제 없는데?
    React.useEffect(()=>{ 
        setIsLoading(true)
        loadProducts().then(()=>{
            setIsLoading(false)
        })
    },[reduxDispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate({
            name:'productDetail',
            params: {
                productId:id,
                productTitle: title,
            }
        })
    } 
    
    if(error){
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button title="try again" onPress={loadProducts}  color={Colors.primary}/>
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList 
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={(item)=> item.id}
            renderItem={ itemData=> ( 
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={()=>{
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}
                >
                    <Button 
                        color={Colors.primary} 
                        title="View Details" 
                        onPress={()=>{
                            selectItemHandler(itemData.item.id, itemData.item.title)
                        }} 
                    />
                    <Button 
                        color={Colors.primary} 
                        title="To Cart" 
                        onPress={()=>{
                            reduxDispatch(addToCart(itemData.item))
                        }}
                    />
                </ProductItem> 
            )}
        />
    );
};

export default ProductsOverViewScreen;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
