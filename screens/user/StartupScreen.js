import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch} from 'react-redux'

import Colors from '../../constants/Colors'
import {authActions, setLogoutTimer} from '../../store/slice/authSlice'

const StartupScreen = (props) => {
  const reduxDispatch = useDispatch()
  React.useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData')
      if( !userData) {
        props.navigation.navigate('AuthNavigator')
        return 
      }
      const transformedData = JSON.parse(userData)
      const {token, userId, expirationDate} = transformedData
      const expiration_Date = new Date(expirationDate)

      if(expiration_Date <= new Date() || !token || !userId) {
        props.navigation.navigate('AuthNavigator')
        return
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime()
      reduxDispatch(setLogoutTimer(expirationTime))

      props.navigation.navigate('ShopNavigator')
      reduxDispatch(authActions.authenticate( userId, token ))
    }
    tryLogin();
  },[reduxDispatch])

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  )
}

export default StartupScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
