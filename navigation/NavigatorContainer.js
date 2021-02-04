import React from 'react'
import {useSelector} from 'react-redux'
import { CommonActions } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';

import { MainNavigator} from './ShopNavigator'

const NavigatorContainer = (props) => {

  const navRef = React.useRef()
  const isAuth = useSelector(state => !!state.auth.token)
  React.useEffect(() => {
    if(!isAuth){
      console.log("in NavigationContainer ")
      navRef.current.dispatch(CommonActions.navigate("AuthNavigator"))
    }
  }, [isAuth])
  return (
    <NavigationContainer ref={navRef}>
      <MainNavigator />
    </NavigationContainer>
  )
}
export default NavigatorContainer

