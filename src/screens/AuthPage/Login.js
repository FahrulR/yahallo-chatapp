/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { View, Image,ImageBackground, Text,TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import { Button, Toast } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'

const yahallo = require('./assets/yahallo.png');

class LoginScreen extends Component{
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            invalidEmailError: false,
            userNotFoundError: false,
            wrongPasswordError: false,
            isLoading: false,
        }
    }

    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    handleSubmit = async () => {
        this.setState({isLoading: true})
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then( async (result) =>{
                await firebase.database().ref('users/' + result.user.uid).update({ status: 'online' })
                AsyncStorage.setItem('uid', result.user.uid)
                AsyncStorage.setItem('name', result.user.displayName)
                AsyncStorage.setItem('image', result.user.image)
                this.setState({isLoading: false})
                this.props.navigation.navigate('Tabs')
            })
            .catch(error => {
                this.setState({isLoading: false})
                console.log(error)
                // this.setState({ errorMessage: JSON.stringify(error) })
                if(error.code == 'auth/invalid-email'){
                    this.setState({ invalidEmailError: true })
                } else if(error.code == 'auth/user-not-found'){
                    this.setState({ userNotFoundError: true })
                } else if(error.code == 'auth/wrong-password'){
                    this.setState({ wrongPasswordError: true })
                }
            })
    }

    render() {
        return(
            <LinearGradient
            colors={['#EC6F66','#F3A183']} behavior="padding" style={styles.Wrapper}>
                <View style={styles.bodyWrapper}>
                    <View >
                        {/*<ImageBackground source={require('./assets/93407.jpg')} style={styles.backgroundImage} />*/}
                        <Image style={{marginTop: 65, width: '100%', height: '100%'}} resizeMode="contain" source={yahallo} />
                        <Text style={styles.welcomeText}>Welcome to Yahallo!</Text>
                    </View>
                    <View>
                        <TextInput
                            placeholder='Email'
                            keyboardType='email-address'
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            value={this.state.email}
                            style={styles.inputField}
                            onChangeText={(text) => this.handleChange( 'email', text )}
                        />
                        <TextInput
                            placeholder='Password'
                            secureTextEntry={true}
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            value={this.state.name}
                            style={{color: 'white'}}
                            onChangeText={(text) => this.handleChange( 'password', text )}
                        />
                        {
                            this.state.invalidEmailError ? <Text style={styles.error}>Please input valid email!</Text> :
                            this.state.wrongPasswordError ? <Text style={styles.error}>Email or Password is wrong!</Text> :
                            this.state.userNotFoundError ? <Text style={styles.error}>User doesn't exist! please register first!</Text> : <Text></Text>
                        }
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.handleSubmit()} >
                        {this.state.isLoading?
                            <ActivityIndicator color='white' />
                        :
                            <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#ff5858','#f857a6']} 
                            style={styles.linearGradientButton}>
                            <Text style={{color:'white'}}>Login</Text>
                            </LinearGradient>
                        }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footerWrapper}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginTop: 120, color: 'black'}} >Don't have an account? </Text>
                        <TouchableOpacity style={styles.text} onPress={()=> this.props.navigation.navigate('SignUp')} activeOpacity={0.85} >
                            <Text style={styles.ul}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    
            </LinearGradient>
        )
    }
    
}

const styles = StyleSheet.create({
    Wrapper : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B3A2A2'
    },
    welcomeText: {fontSize: 22, color: '#e3dac9', position: 'absolute', bottom: 0, alignSelf: 'center'},
    bodyWrapper: {
        flex: 2,
        justifyContent: 'center',
    },
    footerWrapper: {
        display: 'flex',
        flex: 1,
        // flexDirection: 'row',
    },
    inputField: {
        width: 280,
        color: 'white',
        marginBottom: 5
    },
    text :{
        marginTop: 120
    },
    ul : {
        color: '#4B2637',
        fontSize: 14,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000"
    },
    error: {
        color: 'red',
        alignSelf: 'center'
    },
    linearGradientButton: {
        marginTop:5,
        height:40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:30,
        width:120,
        borderRadius:25,
    },
})

export default LoginScreen