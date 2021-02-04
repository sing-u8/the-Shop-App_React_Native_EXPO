import React from 'react';
import { Button} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import {Platform} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import {Ionicons} from '@expo/vector-icons'

import ProductsOverViewScreen from '../screens/shop/ProductsOverViewScreen';
import ProductDetailScreen  from '../screens/shop/ProductDetailScreen'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import EditProductScreen from '../screens/user/EditProductScreen'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/user/StartupScreen'

import HeaderButton from '../components/UI/HeaderButton'
import Colors from '../constants/Colors'

import {useDispatch} from 'react-redux'
import {logOut} from '../store/slice/authSlice'

const defaultScreenOptions = {
    headerStyle:{
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    }
}

const ProductsStack = createStackNavigator();
function ProductsNavigator() {
    return (
        <ProductsStack.Navigator
            screenOptions={
                defaultScreenOptions               
            }
        >
            <ProductsStack.Screen 
                name="productsOverView" 
                component={ProductsOverViewScreen} 
                options={
                    ({route,navigation})=> {
                        return {
                            headerTitle: 'All Products',
                            headerLeft: () => (
                                <HeaderButtons 
                                    HeaderButtonComponent={HeaderButton}
                                >
                                    <Item 
                                        title='Menu' 
                                        iconName={Platform.OS === 'android' 
                                            ? 'md-menu' 
                                            : 'ios-menu'
                                        }
                                        onPress={()=>{
                                            navigation.toggleDrawer()
                                        }}
                                    />
                                </HeaderButtons>
                            ),
                            headerRight: () => (
                                <HeaderButtons 
                                    HeaderButtonComponent={HeaderButton}
                                >
                                    <Item 
                                        title='Cart' 
                                        iconName={Platform.OS === 'android' 
                                            ? 'md-cart' 
                                            : 'ios-cart'
                                        }
                                        onPress={()=>{
                                            navigation.navigate({
                                                name:'Cart'
                                            })
                                        }}
                                    />
                                </HeaderButtons>
                            ),
                        }
                    }
                }
            />
            <ProductsStack.Screen 
                name="productDetail"
                component={ProductDetailScreen}
                options ={({route})=>{
                    return {
                        headerTitle: route.params.productTitle
                    }
                }}
            />
            <ProductsStack.Screen 
                name="Cart"
                component={CartScreen}
                options ={({route, navigation})=>{
                    return {
                        headerTitle: "Your Cart"
                    }
                }}
            />
        </ProductsStack.Navigator>     
    );
}

const OrdersStack = createStackNavigator();
function OrdersNavigator() {
    return (

        <OrdersStack.Navigator
            screenOptions={
                defaultScreenOptions        
            }
        > 
            <OrdersStack.Screen 
                name="orders"
                component={OrdersScreen}
                options ={({route, navigation})=>{
                    return {
                        headerTitle: "Your Orders",
                        headerLeft: () => (
                            <HeaderButtons 
                                HeaderButtonComponent={HeaderButton}
                            >
                                <Item 
                                    title='Menu' 
                                    iconName={Platform.OS === 'android' 
                                        ? 'md-menu' 
                                        : 'ios-menu'
                                    }
                                    onPress={()=>{
                                        navigation.toggleDrawer()
                                    }}
                                />
                            </HeaderButtons>
                        ),
                    }
                }}
            />
        </OrdersStack.Navigator>

    )
}

const UsersStack = createStackNavigator();
function AdminNavigator() {
    return (

        <UsersStack.Navigator
            screenOptions={
                defaultScreenOptions        
            }
        > 
            <UsersStack.Screen 
                name="userProduct"
                component={UserProductsScreen}
                options ={({route, navigation})=>{
                    return {
                        headerTitle: "Your Products",
                        headerLeft: () => (
                            <HeaderButtons 
                                HeaderButtonComponent={HeaderButton}
                            >
                                <Item 
                                    title='Menu' 
                                    iconName={Platform.OS === 'android' 
                                        ? 'md-menu' 
                                        : 'ios-menu'
                                    }
                                    onPress={()=>{
                                        navigation.toggleDrawer()
                                    }}
                                />
                            </HeaderButtons>
                        ),
                        headerRight: () => (
                            <HeaderButtons 
                                HeaderButtonComponent={HeaderButton}
                            >
                                <Item 
                                    title='Menu' 
                                    iconName={Platform.OS === 'android' 
                                        ? 'md-create' 
                                        : 'ios-create'
                                    }
                                    onPress={()=>{
                                        navigation.navigate('EditProduct')
                                    }}
                                />
                            </HeaderButtons>
                        ),
                    }
                }}
            />
            <UsersStack.Screen 
                name="EditProduct"
                component={EditProductScreen}
                options ={({route, navigation})=>{
                    const subminFn = route.params?.submit
                    return {
                        headerTitle: route.params?.productId ? "Edit Product" : 'Add Product',
                        headerLeft: () => (
                            <HeaderButtons 
                                HeaderButtonComponent={HeaderButton}
                            >
                                <Item 
                                    title='Menu' 
                                    iconName={Platform.OS === 'android' 
                                        ? 'md-menu' 
                                        : 'ios-menu'
                                    }
                                    onPress={()=>{
                                        navigation.toggleDrawer()
                                    }}
                                />
                            </HeaderButtons>
                        ),
/*                        headerRight: () => (
                            <HeaderButtons 
                                HeaderButtonComponent={HeaderButton}
                            >
                                <Item 
                                    title='Save' 
                                    iconName={Platform.OS === 'android' 
                                        ? 'md-checkmark' 
                                        : 'ios-checkmark'
                                    }
                                    onPress={subminFn}
                                />
                            </HeaderButtons>
                        ),
*/
                    }
                }}
            />
        </UsersStack.Navigator>

    )
}
//-----------------------------------------------------------------------------------------//

const DrawerContent = (props) => {
    const reduxDispatch = useDispatch()
    return (
        <DrawerContentScrollView {...props} style={{paddingTop: 10}}>
            <DrawerItemList {...props}/>
            <Button 
                title="LogOut" 
                color={ Colors.primary } 
                onPress={() => {
                    reduxDispatch(logOut())
                    // props.navigation.navigate('AuthNavigator') // **
                }}
            />
        </DrawerContentScrollView>
    )
}

const ShopDrawer = createDrawerNavigator();
export function ShopNavigator() {
    return (
        <ShopDrawer.Navigator
            drawerContentOptions={{
                activeTintColor: Colors.primary
            }}
            drawerContent={(props) => <DrawerContent {...props}/>}
        >
            <ShopDrawer.Screen 
                name={"Products"}
                component={ProductsNavigator}
                options={({navigation,route})=>{
                    return {
                        title: "Products",
                        drawerIcon: (drawerConfig)=>(
                            <Ionicons 
                                name={Platform.OS === 'android' ? "md-cart" : "ios-cart"}
                                size={23}
                                color={drawerConfig.color}
                            />
                        ),   
                    }
                }}
            />
            <ShopDrawer.Screen 
                name={"Orders"}
                component={OrdersNavigator}
                options={({navigation,route})=>{
                    return {
                        title: "Orders",
                        drawerIcon: (drawerConfig)=>(
                            <Ionicons 
                                name={Platform.OS === 'android' ? "md-list" : "ios-list"}
                                size={23}
                                color={drawerConfig.color}
                            />
                        ),   
                    }
                }}
            />
            <ShopDrawer.Screen
                name={"AdminNavigator"}
                component={AdminNavigator}
                options={({navigation,route})=>{
                    return {
                        title: "Admin",
                        drawerIcon: (drawerConfig)=>(
                            <Ionicons 
                                name={Platform.OS === 'android' ? "md-create" : "ios-create"}
                                size={23}
                                color={drawerConfig.color}
                            />
                        ),   
                    }
                }}
            />
        </ShopDrawer.Navigator>

    )
}
//-----------------------------------------------------------------------------------------------//
const AuthStack = createStackNavigator();
function AuthNavigator() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                ...defaultScreenOptions
            }}
        >
            <AuthStack.Screen 
                name={"AuthScreen"}
                component={AuthScreen} 
                options={{ 
                    headerTitle: "Authenticate"
                }}                 
            />
        </AuthStack.Navigator>
    )
}

const MainStack = createStackNavigator();
export function MainNavigator() {
    return (

        <MainStack.Navigator>
            <MainStack.Screen 
                name={"Startup"}
                component={StartupScreen}
            />
            <MainStack.Screen 
                name={"AuthNavigator"}
                component={AuthNavigator}          
            />
            <MainStack.Screen 
                name={"ShopNavigator"}
                component={ShopNavigator}
                options={{ 
                    headerShown:false
                }}
            />
        </MainStack.Navigator>

    )
}



