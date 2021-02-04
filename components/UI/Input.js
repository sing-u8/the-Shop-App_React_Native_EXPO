import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

const reducerActions = {
   INPUT_CHANGE:"INPUT_CHANGE",
   INPUT_BLUR:"INPUT_BLUR"
}
const inputReducer = (state, action) => {
   switch ( action.type ) {
      case reducerActions.INPUT_CHANGE : 
         return { 
            ...state,
            value: action.value,
            isValid: action.isValid
         }
      case reducerActions.INPUT_BLUR: 
         return {
            ...state,
            touched: true
         }
      default:
         return state;
   }
}

const Input = (props) => {
   const {
      id ,
      label, 
      errorText, 
      initialValue, 
      initiallyValid, 
      onInputChange,
   } = props

   const [inputState, dispatch] = React.useReducer(inputReducer, {
      value: initialValue ? initialValue : '',
      isValid : initiallyValid,
      touched: false
   })

   React.useEffect(()=> {
      if(inputState.touched){
         onInputChange(id, inputState.value, inputState.isValid)
      }
   },[inputState, onInputChange, id])

   const textChangeHandler = text => {
      // 필요시에 validator를 써서 valdation 하기 
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isValid = true;
      if (props.email && !emailRegex.test(text.toLowerCase())) {
         isValid = false;
      }
      if (props.required && text.trim().length === 0) {
        isValid = false;
      }
      if (props.min != null && +text < props.min) {
        isValid = false;
      }
      if (props.max != null && +text > props.max) {
        isValid = false;
      }
      if (props.minLength != null && text.length < props.minLength) {
        isValid = false;
      }
      dispatch({ type:reducerActions.INPUT_CHANGE, value: text, isValid: isValid})
   }

   const lostFoucusHandler = () => {
      dispatch({type: reducerActions.INPUT_BLUR})
   }

   return (
      <View style={styles.formControl}>
         <Text style={styles.label}>{label}</Text>
         <TextInput 
            {...props}
            style={styles.input}
            value={inputState.value}
            onChangeText={textChangeHandler}
            onBlur={lostFoucusHandler}
         /> 
         {!inputState.isValid && inputState.touched && (
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>{errorText}</Text>
            </View>
         )}
      </View>
   )
}

/* 



*/

export default Input

const styles = StyleSheet.create({
   formControl: {
      width: '100%'
   },
   label: {
      fontFamily: 'open-sans-bold',
      marginVertical: 8
   },
   input: {
      paddingHorizontal: 2,
      paddingVertical: 5,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
   },
   errorContainer: {
      marginVertical:5
   },
   errorText: {
      fontFamily: 'open-sans',
      color: 'red',
      fontSize: 13,
   }
})
