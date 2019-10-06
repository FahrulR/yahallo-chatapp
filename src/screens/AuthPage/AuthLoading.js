/* eslint-disable prettier/prettier */
import React from 'react';
import { ActivityIndicator, StatusBar, View, Text } from 'react-native'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'

import firebaseConfig from '../../config/firebase'

export default class AuthLoadingScreen extends React.Component {

    componentDidMount = async () => {
        await AsyncStorage.getItem('uid').then(
            (result) => this.props.navigation.navigate(result ? 'Tabs' : 'Login')
        )
    }

    render() {
        return (
            <View>
                <ActivityIndicator size="large" color={"white"} />
                <Text style={{ color: 'white' }}>Loading...</Text>
                <StatusBar barStyle="default" />
            </View>
        )
    }
}