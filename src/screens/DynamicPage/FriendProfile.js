/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { Icon } from 'native-base'
import Geocoder from 'react-native-geocoder'
import { ScrollView } from 'react-native-gesture-handler';

class ProfileScreen extends Component {
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
            <ScrollView style={{backgroundColor: '#FFFDE4'}}>
                <View style={styles.container}>
                    <View style={styles.header}>
                    <ImageBackground source={{ uri: user.header}} style={{height: 230, width: '100%'}} >
                        <Image style={styles.avatar} source={{uri: user.photo }}></Image>
                        <Text style={styles.profileLabel}>{user.fullname}</Text>
                    </ImageBackground>
                    </View>
                    <View style={styles.body}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}> Profile </Text>
                        </View>
                        <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center'}}>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Chat', {item: user}) } activeOpacity={0.8}>
                                    <Icon type="SimpleLineIcons" name="bubble" style={{fontSize:35 , color: 'grey'}} />
                                </TouchableOpacity>
                                <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold'}}>Chat</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Location', {item: user}) } activeOpacity={0.8}>
                                    <Icon type="SimpleLineIcons" name="location-pin" style={{fontSize:35, color: 'grey'}}/>
                                </TouchableOpacity>
                                <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold'}}>Location</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10}}>
                            {/* <Icon type='MaterialCommunityIcons' name='gmail' style={{fontSize: 37, color: '#353839'}}/> */}
                            <Text style={{paddingLeft: 9, fontWeight: 'bold'}}>Email</Text>
                            <Text style={{paddingLeft: 9}}>{user.email}</Text>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10}}>
                            {/* <Icon type='Entypo' name='location-pin' style={{fontSize: 37, color: '#353839'}}/>
                            <Text style={{alignSelf: 'center', paddingLeft: 7}}>{this.state.userAddress}</Text> */}
                            <Text style={{paddingLeft: 9, fontWeight: 'bold'}}>Location</Text>
                            <Text style={{paddingLeft: 9}}>{this.state.userAddress}</Text>
                        </View>
                        <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 10}}>
                            {/* <Icon type='Entypo' name='eye' style={{fontSize: 33, color: '#353839'}}/> */}
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
        height: '100%'
    },
})

export default ProfileScreen;