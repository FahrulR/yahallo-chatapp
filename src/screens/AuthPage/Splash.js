/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { View, Text, Image, Dimensions, PixelRatio } from 'react-native'

class SplashScreen extends Component {
    performTimeConsumingTask = async() => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                2000
            )
        )
    }

    async componentDidMount() {
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
            this.props.navigation.navigate('AuthLoading');
        }
    }

    render() {
        return (
        <View style={styles.viewStyles}>
            <Image source={require('../../assets/yahallo.png')} style={{ width: 150, height: 150}} />
            <Text style={{color: '#FFFDE4', fontSize: 25, fontWeight: 'bold'}}>Yahallo~</Text>
        </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFB88C'
    },
    textStyles: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
}

export default SplashScreen;