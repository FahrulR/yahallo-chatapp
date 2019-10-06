import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Item, Input } from 'native-base'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'

class EditScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display: props.navigation.getParam('display'),
            item: props.navigation.getParam('item'),
            value: props.navigation.getParam('value'),
            uid: ''
        }
    }

    UNSAFE_componentWillMount = async () => {
        await AsyncStorage.getItem('uid')
        .then( (value) => {
            this.setState( { uid: value} )
        })
    } 

    handleSave = async () => {
        this.state.item == 'fullname' ?
        await firebase.database().ref('users/' + this.state.uid).update({  fullname: this.state.value })
            .then( () => this.props.navigation.navigate('Profile') )
        :
        await firebase.database().ref('users/' + this.state.uid).update({  statusmessage: this.state.value })
            .then( () => this.props.navigation.navigate('Profile') )
    }

    render() {

        return(
            <View style={{ flex: 1, backgroundColor: '#FFFDE4'}}>
                <View style={{height: 52, backgroundColor: '#ff9966', justifyContent: 'center'}}>
                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: 15, fontFamily: 'Roboto', marginLeft: 10}}>{this.state.display}</Text>
                </View>
                <View style={{ justifyContent: 'center', flex: 1, marginTop: 20}}>
                    <Item regular style={{ justifyContent: 'center', borderColor: '#ff9966', width: 330, marginLeft:15, }}>
                        <Input style={{justifyContent: 'center'}} defaultValue={this.state.value} onChangeText={ (value) => this.setState({ value: value })} />
                    </Item>
                    </View>
                    <View style={{flex: 9, justifyContent:'center', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={ () => this.handleSave() } style={{ height: 45, width: 80, justifyContent: 'center', alignItems: 'center', borderRadius:20 , marginTop: 30, marginLeft: 15, backgroundColor: "#ff5858" }} activeOpacity={0.9} >
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.props.navigation.goBack() } style={{ height: 45, width: 80, justifyContent: 'center', alignItems: 'center', borderRadius:20 , marginTop: 30, marginLeft: 15, backgroundColor: "#ff5858" }} activeOpacity={0.9} >
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default EditScreen