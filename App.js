import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {AppLoading} from 'expo'
import * as Font from 'expo-font'


import {Provider} from 'react-redux';
import reduxStore from './store/rdStore.index';

import NavigatorContainer from './navigation/NavigatorContainer'
// import { MainNavigator} from './navigation/ShopNavigator';


const fetchFonts = () => {
    return Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    })
}

export default function App() {

    const [fontLoaded, setFontLoaded] = React.useState(false);

    if( !fontLoaded ) {
        return (
            <AppLoading 
                startAsync={fetchFonts} 
                onFinish={() => setFontLoaded(true)} 
            />
        )
    }

    return (
        <Provider store={reduxStore}>
            <NavigatorContainer />
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
