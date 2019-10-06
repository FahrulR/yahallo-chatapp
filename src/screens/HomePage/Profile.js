/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, PermissionsAndroid } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'
import { Icon } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient'

class ProfileScreen extends Component {
    constructor(){
        super()
        this.state= {
            userProfile: {},
            uid: ''
        }
    }

    UNSAFE_componentWillMount = async () => {
        await AsyncStorage.getItem('uid')
        .then( async (uid) => {
            firebase.database().ref('users/' + uid)
            .on('value', (value) => {
                this.setState( {userProfile: value.val()} )
            })
            this.setState({uid: uid})
        })
    }

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ])
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.log(err);
            return false
        }
    }
    

    changeImage = async (type) => {
        let upp = type == 'header' ? 'header' : 'photo'
        // console.log(upp)
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob

        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo'
        }

        let cameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA) && PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) && PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        if(!cameraPermission){
            cameraPermission = await this.requestCameraPermission()
        } else {
            ImagePicker.showImagePicker(options, (response)=> {
                let uploadBob = null
                const imageRef = firebase.storage().ref('images/' + this.state.uid).child(upp)
                fs.readFile(response.path, 'base64')
                    .then( (data) => {
                        return Blob.build(data, { type: `${response.mime};BASE64`} )
                    })
                    .then( (blob) => {
                        uploadBob = blob
                        return imageRef.put(blob, { contentType: `${response.mime}`})
                    })
                    .then( () => {
                        uploadBob.close()
                        return imageRef.getDownloadURL()
                    })
                    .then( (url) => {
                        upp == 'header' ?
                        firebase.database().ref('users/' + this.state.uid).update({ header: url})
                        :
                        firebase.database().ref('users/' + this.state.uid).update({ photo: url})
                    })
                    .catch( (err) => console.log(err))
            })
        }
    }

    _logOut = async () => {
        await AsyncStorage.getItem('uid')
            .then( async (uid) => {
                firebase.database().ref('users/' + uid).update({ status: 'offline' })
                await AsyncStorage.clear()
                firebase.auth().signOut()
                Geolocation.stopObserving();
                this.props.navigation.navigate('Login')
            })
            .catch(function(error) {
                console.error(error)
            })
    }

    render() {
        let user = this.state.userProfile

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                <ImageBackground source={{ uri: user.header }} style={{ width: '100%', height: 250, resizeMode: 'cover' }}>
                    <Image style={styles.avatar} source={{uri: user.photo }}></Image>
                    {/* Avatar */}
                    <TouchableOpacity onPress={() => {this.changeImage('photo')} } style={{ height: 30, width: 30, backgroundColor:'#00000030', borderRadius: 50, justifyContent: "center", alignItems: 'center', position: 'absolute', left: 233, top: 166}} activeOpacity={0.9} >
                        <Icon type='Entypo' name='camera' style={{ color: 'white', fontSize: 17}} />
                    </TouchableOpacity>
                    {/* Header */}
                    <TouchableOpacity onPress={() => {this.changeImage('header')} } style={{ height: 30, width: 30, backgroundColor:'#00000030', borderRadius: 50, justifyContent: "center", alignItems: 'center', position: 'absolute', left: 370, top: 210}} activeOpacity={0.9} >
                        <Icon type='Entypo' name='camera' style={{ color: 'white', fontSize: 17}} />
                    </TouchableOpacity>
                </ImageBackground>
                </View>
                <ScrollView style={styles.body}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Edit', {display: 'Display Name', item:'fullname', value: user.fullname})} style={{paddingLeft: 20, paddingTop: 7, paddingBottom: 7, borderBottomWidth: 0.6, borderBottomColor: '#35383930', }} activeOpacity={0.6} >
                        <Text style={{ paddingLeft: 9}}>Full Name</Text>
                        <Text style={{ paddingLeft: 9, color: 'gray'}}>{user.fullname}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Edit', {display: 'Status Message', item:'statusmessage', value: user.statusmessage})} style={{paddingLeft: 20, paddingTop: 7, paddingBottom: 7, borderBottomWidth: 0.6, borderBottomColor: '#35383930', }} activeOpacity={0.6}>
                        <Text style={{ paddingLeft: 9}}>Status message</Text>
                        {user.statusmessage != undefined && user.statusmessage != '' ?
                            <Text style={{ paddingLeft: 9, color: 'gray'}}>{user.statusmessage}</Text>
                            :
                            <Text style={{ paddingLeft: 9, color: 'gray'}}>Not Set</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 20, paddingTop: 7, paddingBottom: 7, borderBottomWidth: 0.6, borderBottomColor: '#35383930',}} activeOpacity={1}>
                        <Text style={{ paddingLeft: 9}}>Username</Text>
                        <Text style={{ paddingLeft: 9, color: 'gray'}}>{user.username}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 20, paddingTop: 7, paddingBottom: 7, borderBottomWidth: 0.6, borderBottomColor: '#35383930',}} activeOpacity={0.6}>
                        
                        <Text style={{ paddingLeft: 9}}>Email</Text>
                        <Text style={{ paddingLeft: 9, color: 'gray'}}>{user.email}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', flexDirection: 'row'}} onPress={ () => this._logOut()} activeOpacity={0.8}>
                    <Icon type="FontAwesome5" name="users-cog" style={{marginTop: 20, alignSelf: 'center', fontSize:30, color:'gray'}}/>
                    <Text style={{fontSize:15, marginTop: 20, color: 'gray', alignSelf: 'center'}}> Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logOutButton: {
        marginTop: 20,
        marginLeft: 120,
        height: 45,
        width: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        borderRadius:2,
        backgroundColor: "#696969",
    },
    profileLabel:{
        fontSize:20,
        fontWeight: 'bold',
        color: "white",
        marginTop: 35,
        textAlign: 'center'
    },
    container: {
         backgroundColor: '#FFFDE4'
    },
    header: {
        backgroundColor: "#353839",
        height:250,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:70
    },
    body:{
        // marginTop:40,
        width: '100%',
        height: '100%'
    },
     linearGradientButton: {
        marginTop:50,
        height:40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom:30,
        width:120,
        borderRadius:25,
    },
})

export default ProfileScreen;