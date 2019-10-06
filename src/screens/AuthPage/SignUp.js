/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { View, Text,TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native'
import { Button, Toast } from 'native-base'
import firebase from 'firebase'
import LinearGradient from 'react-native-linear-gradient'

const yahallo = require('./assets/yahallo.png');


class SignUpScreen extends Component{
    constructor(props) {
        super(props)
        this.state = {
            SignUpForm: {
                photo: 'https://i.stack.imgur.com/l60Hf.png',
                header: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhBoGyNFbPKNjjQeQWcgzpub32JpFdN45OcnCpNuxGV6BqcKARXg',
                position: {
                    latitude: -6.6174489,
                    longitude: 106.8183907
                },
                status: 'offline',
                lastSeen: Date.now()
            },
            errorMessage: null,
            emailInUseError: false,
            emailInputError: false,
            passwordInputError: false,
            isLoading: false,
        }
    }

    handleChange = (name, value) => {
        let newFormData = {...this.state.SignUpForm}
        newFormData[name] = value
        this.setState({
            SignUpForm: newFormData,
            emailInUseError: false,
            emailInputError: false,
            passwordInputError: false,
        })
    }

    emailRegex = (email) => {
        //One or more after '@' and minimum domain 2 character
        let emailRegex = /^[\d\w\._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }
    passwordRegex = (password) => {
        // Combination of Uppercase, Lowercase, and have 8 length
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\W\_]{8,}$/
        return passwordRegex.test(password)
    }

    handleSubmit = async() => {
        this.setState({isLoading: true})
        if ( !this.emailRegex(this.state.SignUpForm.email) ) {
            this.setState({
                emailInputError: true,
                isLoading: false
            })
        }
        if ( !this.passwordRegex(this.state.SignUpForm.password) ) {
            this.setState({
                passwordInputError: true,
                isLoading: false
            })
        } else {
            const data = this.state.SignUpForm
            await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            .then(async (result) => {
                var userPro = firebase.auth().currentUser;
                userPro.updateProfile({ displayName: data.fullname, photoURL: data.photo, position: data.position, status: data.status })
                await firebase.database().ref('users/' + result.user.uid).set(data)
                    .then( () => {
                        this.setState({isLoading: false})
                        Toast.show({
                            text: 'Register Success!',
                            buttonText: 'Okay'
                        })
                        this.props.navigation.navigate('Login')
                    })
            })
            .catch(error => {
                // console.warn(error)
                // this.setState({ errorMessage: JSON.stringify(error) })
                this.setState({isLoading: false})
                if(error.code == 'auth/email-already-in-use'){
                    this.setState({ emailInUseError: true })
                }
            })
        }
    }


    render() {
        return(
            <LinearGradient
            colors={['#EC6F66','#F3A183']} style={styles.Wrapper}>
                <View style={styles.bodyWrapper}>
                    <View style={{marginTop: 70}}> 
                        <Image style={{alignSelf: 'center', marginTop: 65, width: '80%', height: '80%'}} resizeMode="contain" source={yahallo} />
                        <Text style={styles.welcomeText}>Create your Account!</Text>
                    </View>
                    <View>
                        <TextInput 
                            placeholder='Full Name'
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            style={styles.inputField}
                            onChangeText={text => this.handleChange( 'fullname', text )}
                        />
                        <TextInput 
                            placeholder='Username'
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            style={styles.inputField}
                            onChangeText={text => this.handleChange( 'username', text )}
                        />
                        <TextInput
                            placeholder='Email'
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            keyboardType='email-address'
                            style={styles.inputField}
                            onChangeText={text => this.handleChange( 'email', text )}
                        />
                        <TextInput
                            placeholder='Password'
                            underlineColorAndroid='#480048'
                            placeholderTextColor='#e3dac9'
                            secureTextEntry={true}
                            style={styles.inputField}
                            onChangeText={text => this.handleChange( 'password', text )}
                        />
                        {   
                            this.state.emailInputError ? <Text style={styles.error}> Please input valid email </Text> :
                            this.state.emailInUseError ? <Text style={styles.error}>Email is already registered! Try to login.</Text> :
                            this.state.passwordInputError ? <Text style={styles.error}>Password must contain uppercase, lowercase {'\n'} and min 8 character!</Text> : <Text></Text>
                        }
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.handleSubmit()} >
                        {this.state.isLoading?
                            <ActivityIndicator color='white'     />
                        :
                            <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#ff5858','#f857a6']} 
                            style={styles.linearGradientButton}>
                            <Text style={{color:'white'}}>Sign Up</Text>
                            </LinearGradient>
                        }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footerWrapper}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginTop: 200, color: 'black'}}>Already have an account? </Text>
                        <TouchableOpacity style={styles.text} onPress={()=> this.props.navigation.navigate('Login')} activeOpacity={0.85} >
                            <Text style={styles.ul}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        )
    }
    
}

const styles = StyleSheet.create({
    Wrapper : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B3A2A2'
    },
    bodyWrapper: {
        flex: 2,
        justifyContent: 'center',
    },
    footerWrapper: {
        display: 'flex',
        flex: 1,
        // flexDirection: 'row',
    },
    welcomeText: {fontSize: 22,fontWeight: 'bold', color: '#e3dac9', position: 'absolute', bottom: 0, alignSelf: 'center'},
    inputField: {
        width: 280,
        color: 'white',
        marginTop: 5
    },
    SignUpButton: {
        marginTop:5,
        height:40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:30,
        width:100,
        borderRadius:25,
        backgroundColor: "#B66E28",
    },
    text :{
        color: '#e3dac9',
        fontSize: 13,
    },
     ul : {
        color: '#4B2637',
        fontSize: 14,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000"
    },
    text :{
        marginTop: 200
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
});

export default SignUpScreen