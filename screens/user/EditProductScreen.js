import React, {  useCallback, useLayoutEffect, useReducer} from 'react'
import { CommonActions } from '@react-navigation/native';
import { StyleSheet,KeyboardAvoidingView, View, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'

import {productActions, asyncCreateProduct, asyncUpdateProduct} from '../../store/slice/productsSlice'

import Colors from '../../constants/Colors'

import Input from '../../components/UI/Input'

const reducerActions = {
   FORM_INPUT_UPDATE: "FORM_INPUT_UPDATE",

}

const formReducer = (state, action) => {
   if(action.type === reducerActions.FORM_INPUT_UPDATE){
      const updatedValues = {
         ...state.inputValues,
         [action.input]: action.value
      }
      const updatedValities = {
         ...state.inputValidities,
         [action.input] : action.isValid
      }
      let updatedFormIsValid = true;
      for ( const key in updatedValities) {
         updatedFormIsValid = updatedFormIsValid && updatedValities[key]
      }
      return {
         formIsValid: updatedFormIsValid,
         inputValues: updatedValues,
         inputValidities: updatedValities
      };
   }
   return state;
}

const EditProductScreen = (props) => {

   const [isLoading, setIsLoading] =React.useState(false)
   const [error, setError] = React.useState()   
   const reduxDispatch = useDispatch();

   const prodId = props.route.params?.productId
   const editedProduct = useSelector(  state => 
      state.products.userProducts.find(prod => prod.id === prodId)
   )   

   const [formState, dispatchFormState] = useReducer( formReducer,
      {
         inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: '',
         }, 
         inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
         }, 
         formIsValid: editedProduct ? true : false
      }
   )

   const subminHandler = useCallback( async () => {
      if(!formState.formIsValid){
         Alert.alert('Wrong input!', 'Please check the errors in the form.', [{text:"Okay"}])
         return
      }
      setError(null)
      setIsLoading(true)
      try {
         if(prodId){
            const updatedData={
               id:prodId,
               title: formState.inputValues.title, 
               description: formState.inputValues.description,
               imageUrl: formState.inputValues.imageUrl,
            };
            await reduxDispatch(asyncUpdateProduct(updatedData))
         } else {
            const obj= {
               title: formState.inputValues.title, 
               description: formState.inputValues.description, 
               imageUrl: formState.inputValues.imageUrl, 
               price: +formState.inputValues.price 
            }
            await reduxDispatch(asyncCreateProduct(obj))
         }
         props.navigation.goBack()
      } catch (err) {
         setError(err.message)
      } 
      setIsLoading(false)
   },[reduxDispatch, prodId,formState, setError, setIsLoading]);

   // useEffect(()=> {
   //    props.navigation.dispatch(CommonActions.setParams({submit: subminHandler}))
   // }, [subminHandler])

   React.useEffect(()=>{
      if(error){
         Alert.alert('An error occurred! in EditProduct', error, [{text:'Okay'}])
      }
   },[error])

   useLayoutEffect(()=> {
      props.navigation.setOptions({
         headerRight: () => (
            <HeaderButtons
               HeaderButtonComponent={HeaderButton}
            >
               <Item 
                  title="save"
                  iconName={Platform.OS === 'android' 
                  ? 'md-checkmark' 
                  : 'ios-checkmark'
               }
                  onPress={subminHandler}
               />      
            </HeaderButtons>
         )
      })
      // caution!!!! 
   }, [props.navigation, prodId, formState, subminHandler])

   const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
         type: reducerActions.FORM_INPUT_UPDATE, 
         value: inputValue, 
         isValid: inputValidity,
         input: inputIdentifier
      })
   },[dispatchFormState])

   if ( isLoading ) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
         </View>
      )
   }


   return (
      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === 'android' ? "height" : "padding" }
         keyboardVerticalOffset={100}
      >
         <ScrollView>
            <View style={styles.form}>
               <Input 
                  id='title'
                  label="Title"
                  errorText="please enter valid title!"
                  onInputChange={inputChangeHandler}
                  initialValue={ editedProduct ? editedProduct.title : ''}
                  initiallyValid={!!editedProduct}
                  required
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect
                  returnKeyType='next'               
               />

               <Input 
                  id='imageUrl'
                  label="Image URL"
                  errorText="please enter valid image url!"
                  onInputChange={inputChangeHandler}
                  initialValue={ editedProduct ? editedProduct.imageUrl : ''}
                  initiallyValid={!!editedProduct}        
                  required       
                  keyboardType='default'
                  returnKeyType='next'               
               />
               {editedProduct? null : (
                  <Input 
                     id='price'
                     label="Price"
                     errorText="please enter valid price!"
                     onInputChange={inputChangeHandler}     
                     required
                     min={0.1}           
                     keyboardType='decimal-pad'
                     returnKeyType='next'               
                  />               
               )}
               <Input 
                  id='description'
                  label="Description"
                  errorText="please enter valid description!"
                  onInputChange={inputChangeHandler}
                  initialValue={ editedProduct ? editedProduct.description : ''}
                  initiallyValid={!!editedProduct}     
                  required
                  minLength={5}               
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect
                  multiline
                  numberOfLines={3}
               /> 
            </View>   
         </ScrollView>
      </KeyboardAvoidingView>
   )
}

/*
KeyboardAvoidingView
*/
export default EditProductScreen

const styles = StyleSheet.create({
   form: {
      margin: 20
   },
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  }
})
