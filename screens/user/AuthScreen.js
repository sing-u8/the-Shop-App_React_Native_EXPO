import React from 'react'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Button, Platform, ActivityIndicator,Alert } from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {useDispatch} from 'react-redux'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'

import {signUp, signIn} from '../../store/slice/authSlice'

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

const AuthScreen = (props) => {

  const reduxDispatch = useDispatch();
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState();
  const [formState, dispatchFormState] = React.useReducer( formReducer,
    {
      inputValues: {
       email: '',
       password: '',
      }, 
      inputValidities: {
       email: false,
       password: false,
      }, 
      formIsValid: false
    }
 )  

 React.useEffect(()=>{
  if(error){
    Alert.alert("An Error Occurred!", error, [{text: 'Okay'}])
  }
 },[error])

  const authHandler =  async () => {
    const signUpObj = {
      email:formState.inputValues.email, 
      password: formState.inputValues.password
    }
    setError(null)
    setIsLoading(true)
    try{
      if(isSignUp) {
        await reduxDispatch(signUp(signUpObj))
        props.navigation.navigate('ShopNavigator')
      } else {
        await reduxDispatch(signIn(signUpObj))
        props.navigation.navigate('ShopNavigator')
      }
    } catch(err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const inputChangeHandler =  React.useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
       type: reducerActions.FORM_INPUT_UPDATE, 
       value: inputValue, 
       isValid: inputValidity,
       input: inputIdentifier
    })
 },[dispatchFormState])
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? "height" : "padding" }
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient
        colors={['#ffedff', '#ffe3ff']}
        style={styles.gradient}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input 
              id='email' 
              label="E-mail"
              keyboardType='email-address'
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input 
              id='password' 
              label="password"
              keyboardType='default'
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading 
                ?<ActivityIndicator size="small" color={Colors.primary}/> 
                : <Button 
                  title={isSignUp ? 'signUp':"LogIn"} 
                  color={Colors.primary} 
                  onPress={authHandler}/>
              }
            </View>
            <View style={styles.buttonContainer}>
              <Button 
                title={`Switch to ${isSignUp ? 'logIn':"signUp"}` }
                color={Colors.accent} 
                onPress={()=>{
                  setIsSignUp(prevState => !prevState)
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
})
