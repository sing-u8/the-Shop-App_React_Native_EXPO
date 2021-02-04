import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import PRODUCTS from '../../data/dummy-data';
import Product from '../../models/product'


const initialState = {
    availableProducts: [],
    userProducts: [],
};

export const asyncCreateProduct = createAsyncThunk('products/asyncCreateProduct',
    async ( argObj, thunkApi ) => {
        // orgObj should be title, description, imageUrl, price
        const token = thunkApi.getState().auth.token
        const userId = thunkApi.getState().auth.userId
        console.log("token in createProduct: ", token)
        const res = await fetch(`https://rn-complete-guide-d4351.firebaseio.com/products.json?auth=${token}`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...argObj,
                ownerId: userId
            })
        })
        const resData = await res.json();
        thunkApi.dispatch(productActions.createProduct( 
            resData.name,
            argObj.title,
            argObj.description,
            argObj.imageUrl,
            argObj.price,
            userId
        )) 
    }
)
export const fetchProducts = createAsyncThunk('products/fetchProducts',
    async (obj,{getState}) => {
        console.log("start fetchProds!")
        try{
            const userId = getState().auth.userId
            const res = await fetch("https://rn-complete-guide-d4351.firebaseio.com/products.json")
            if( !res.ok) {
                throw new Error('Something went wrong!')
            }

            const resData = await res.json()

            let loadedProducts = []
            
            for (const key in resData){
                loadedProducts.push(
                    new Product(
                        key, 
                        resData[key].ownerId, 
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price 
                    )
                )
            }
            return {loadedProducts : loadedProducts,  userProducts : loadedProducts.filter(prod => prod.ownerId === userId)}
        } catch(err) {
            console.log("ERR: ", err)
            throw err
        }
    }
)
export const asyncUpdateProduct = createAsyncThunk('products/asyncUpdateProduct',
    async ( argObj, thunkApi ) => {
        // orgObj should be id, title, description, imageUrl

            console.log("enter async update")
            const token = thunkApi.getState().auth.token
            console.log("token: ", token)
            const res = await fetch(`https://rn-complete-guide-d4351.firebaseio.com/products/${argObj.id}.json?auth=${token}`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: argObj.title,
                    description: argObj.description, 
                    imageUrl: argObj.imageUrl,
                })
            })
            if(!res.ok) {
                console.log("res.ok: ", res.ok)
                throw new Error('something went wrong!')
            }
            console.log("b4 async update redcer")
            thunkApi.dispatch(productActions.updateProduct(argObj.id,argObj.title, argObj.description, argObj.imageUrl))
            console.log("end update redcer")

    }
)
export const asyncDeleteProduct = createAsyncThunk('products/asyncDeleteProduct',
    async (productId, thunkApi)=> {
        try{
            const token = thunkApi.getState().auth.token
            console.log("token: ", token)
            const res = await fetch(`https://rn-complete-guide-d4351.firebaseio.com/products/${productId}.json?auth=${token}`,{
                method: "DELETE",
            })    
            if(!res.ok) {
                console.log("res.ok: ", res.ok)
                throw new Error('something went wrong!')
            }    
            thunkApi.dispatch(productActions.deleteProduct(productId))
        } catch (err) {
            throw err
        }
    }
)

const slice = createSlice({
    name: 'products',
    initialState,
    reducers:{
        deleteProduct:{
            reducer:(state, action)=> {
                const {pid} = action.payload
                console.log("pid:", pid)
                state.userProducts = state.userProducts.filter(product => product.id !== pid)
                state.availableProducts = state.availableProducts.filter(product => product.id !== pid)
            },
            prepare(productId) {
                return { payload: { pid: productId } } }
        },
        createProduct:{
            reducer:(state,action)=>{
                const {productData} = action.payload
                console.log("createProduct reducer: ", productData)
                const newProduct = Product(
                        productData.id,
                        productData.ownerId,
                        productData.title, 
                        productData.imageUrl, 
                        productData.description, 
                        +productData.price 
                    )
                state.availableProducts.push(newProduct)
                state.userProducts.push(newProduct)
            },
            prepare(id,title, description, imageUrl, price, ownerId){
                return{ payload: {productData:{id, title, description, imageUrl, price, ownerId}}}
            }
        },
        updateProduct:{
            reducer:(state,action)=>{
                console.log("enter update reducer")
                const {pid, productData} = action.payload
                const productIndex = state.userProducts.findIndex(prod => prod.id === pid)
                const availableProductIndex =state.availableProducts.findIndex(prod => prod.id === pid)

                const updatedProduct = Product(
                    pid, 
                    state.userProducts[productIndex].ownerId, 
                    productData.title, 
                    productData.imageUrl,
                    productData.description,
                    state.userProducts[productIndex].price, 
                )
                state.userProducts[productIndex] = updatedProduct
                state.availableProducts[availableProductIndex] = updatedProduct
                console.log("end update")
            },
            prepare(id,title, description, imageUrl) {
                return { payload: { pid:id, productData:{title, description, imageUrl}}}
            }
        }
    },
    extraReducers: {
        [fetchProducts.fulfilled] : (state,action)=> {
            state.availableProducts = action.payload.loadedProducts
            state.userProducts = action.payload.userProducts
        },
        [fetchProducts.rejected]: (state,action)=> {
            throw action.error
        },
        [asyncUpdateProduct.rejected]: (state, action)=> {
            throw action.error
        },
        [asyncDeleteProduct.rejected]: (state,action)=> {
            throw action.error
        }
    }

});

export const productActions = slice.actions

export default slice.reducer;