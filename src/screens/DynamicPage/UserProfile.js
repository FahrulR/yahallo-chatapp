/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { Icon } from 'native-base'
import Geocoder from 'react-native-geocoder'
import { ScrollView } from 'react-native-gesture-handler';

class UserProfileScreen extends Component {
    constructor(props){
        super(props)
        this.state= {
            friendProfile : props.navigation.getParam('item'),
            userAddress: ''
        }
    }

    componentDidMount = () => {
        Geocoder.geocodePosition({
            lat: this.state.friendProfile.position.latitude,
            lng: this.state.friendProfile.position.longitude
        })
        .then(res => {
            this.setState({
                userAddress: res[0].formattedAddress
            })
        })
        .catch(err => console.log(err))
    }

    render() {
        console.log(this.state.friendProfile)
        let user = this.state.friendProfile
        return (
            <ScrollView style={{
        backgroundColor: '#FFFDE4'}}>
                <View style={styles.container}>
                    <View style={styles.header}>
                    <ImageBackground source={{ uri: user.header }} style={{ height: 230, width: '100%'}} >
                        <Image style={styles.avatar} source={{uri: user.photo }}></Image>
                        <Text style={styles.profileLabel}>{user.fullname}</Text>
                    </ImageBackground>
                    </View>
                    <View style={styles.body}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={ () => this.props.navigation.navigate('Profile') } activeOpacity={0.8}>
                                <Icon type="MaterialIcons" name="settings-applications" style={{fontSize:28 , color: 'black'}} />
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}> Profile </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10}}>
                            <Text style={{paddingLeft: 9, fontWeight: 'bold'}}>Email</Text>
                            <Text style={{paddingLeft: 9}}>{user.email}</Text>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10}}>
                            <Text style={{paddingLeft: 9, fontWeight: 'bold'}}>Location</Text>
                            <Text style={{paddingLeft: 9}}>{this.state.userAddress}</Text>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10}}>
                            <Text style={{paddingLeft: 9, fontWeight: 'bold'}}>Last seen</Text>
                            <Text style={{paddingLeft: 9}}>{ new Date(user.lastSeen).getHours() + ':'+new Date(user.lastSeen).getMinutes() + ' '+ new Date(user.lastSeen).toDateString() }</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    profileLabel:{
        fontSize:20,
        fontWeight: 'bold',
        color: "white",
        marginTop: 165,
        textAlign: 'center'
    },
    container: {
        // backgroundColor: '#FFFDE4'
    },
    header: {
        // backgroundColor: "#353839",
        height: 230,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 63,
        alignSelf:'center',
        position: 'absolute',
        marginTop: 58
    },
    body:{
        // marginTop:40,
        width: '100%',
        height: '100%',
    },
})

export default UserProfileScreen;