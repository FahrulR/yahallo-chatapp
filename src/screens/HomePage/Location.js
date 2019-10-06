/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'

class LocationScreen extends Component {
    constructor(props){
        super(props)
        this.state= {
            users: [],
            userPosition: false,
            userUid: null
        }
    }

    componentDidMount = async () => {
        //Get current user position
        await AsyncStorage.getItem('uid').then(
            async (uid) => {
                await firebase.database().ref('users/' + uid + '/position').once('value').then(
                    (value) => {
                        this.setState( {userPosition: value.val()} )
                    }
                )
                this.setState({userUid: uid})
            }
        )

        //Get all user in firebase to add marker in maps
        let dbRef = firebase.database().ref('users')
        await dbRef.on('child_added', ( value ) => {
            let person = value.val()
            person.uid = value.key
            this.setState(( prevState ) => {
                return {
                    users: [...prevState.users, person]
                }
            })
        })
    }

    render() {
        const userList = this.state.users

        return (
        <View style={styles.viewStyles}>
            <MapView
                style={{width: '100%', height: '100%'}}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: this.state.userPosition.latitude || 0,
                    longitude: this.state.userPosition.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                zoomControlEnabled={true}
                showsUserLocation={true}
                followUserLocation={true}
            >
            {userList.map( (user) => (
                user.uid == this.state.userUid ?
                    <Marker
                        title={user.fullname || null}
                        description={user.status || null}
                        key={this.state.userPosition}
                        coordinate={{ 
                            latitude: this.state.userPosition.latitude,
                            longitude: this.state.userPosition.longitude
                        }}
                    >
                        <View>
                            <Image
                                title={user.fullname || null}
                                description={user.status || null}
                                source={{ uri: user.photo}}
                                style={{ height: 45, width: 45, borderRadius: 50, borderColor: '#ffcc00', borderWidth: 3}}
                            />
                        </View>
                    </Marker>
                : user.status == 'online' ?
                    <Marker
                        title={user.fullname || null}
                        description={user.status || null}
                        key={user.position.latitude + user.position.longitude}
                        coordinate={{ 
                            latitude: user.position.latitude,
                            longitude: user.position.longitude
                        }}
                        onCalloutPress={ () => this.props.navigation.navigate('Chat', {item: user}) }
                    >
                        <View>
                            <Image 
                                source={{ uri: user.photo}}
                                style={{ height: 45, width: 45, borderRadius: 50, borderColor: '#64a338', borderWidth: 3}}
                            />
                        </View>
                    </Marker>
                :   <Marker
                        title={user.fullname || null}
                        description={'Last Seen: ' + new Date(user.lastSeen) || null}
                        key={user.position.latitude + user.position.longitude}
                        coordinate={{ 
                            latitude: user.position.latitude,
                            longitude: user.position.longitude
                        }}
                        onCalloutPress={ () => this.props.navigation.navigate('Chat', {item: user}) }
                >
                    <View>
                        <Image 
                            source={{ uri: user.photo}}
                            style={{ height: 45, width: 45, borderRadius: 50, borderColor: '#87a2c7', borderWidth: 3}}
                        />
                    </View>
                </Marker>
            ))}
            </MapView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyles: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b444b'
    },
    textStyles: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
})

export default LocationScreen;