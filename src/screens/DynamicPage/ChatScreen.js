/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import firebase from 'firebase'
import { View, Text } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage'

class ChatScreen extends Component {
    static navigationOptions = {
    header: null,
  }

    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            name: '',
            photo: '',
            idReceiver : props.navigation.getParam('item'),
            textMessage : '',
            messageList: []
        }
    }

    UNSAFE_componentWillMount = async () => {
        const itemReceiver = this.state.idReceiver
            this.setState({
                uid: await AsyncStorage.getItem('uid'),
                name: await AsyncStorage.getItem('name'),
                photo: await AsyncStorage.getItem('photo')
            })
        await firebase.database().ref('messages').child(this.state.uid).child(itemReceiver.uid)
            .on('child_added', (value) => {
                let vall = value.val()
                vall._id = value.key
                this.setState((prevState) => {
                    return {
                        messageList: GiftedChat.append(prevState.messageList, vall)
                    }
                })
            })
    }

    handleSubmit = () => {
        const uidSender = this.state.uid

        let messageId = firebase.database().ref('messages').child(uidSender).child(this.state.idReceiver.uid).push().key
        let updates = {}
        let message = {
            _id: messageId,
            text: this.state.textMessage,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            user: {
                _id: this.state.uid,
                name: this.state.name,
                avatar: this.state.photo,
            },
        }
        updates['messages/' + uidSender + '/' + this.state.idReceiver.uid + '/' + messageId] = message
        updates['messages/' + this.state.idReceiver.uid + '/' + uidSender + '/' + messageId] = message
        firebase.database().ref().update(updates)
        this.setState({ textMessage: '' })
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <View style={{height: 50, backgroundColor: '#ff9966', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontSize: 20, fontFamily: 'Roboto', marginLeft: 10}}>{this.state.idReceiver.fullname}</Text>
                </View>
                <View style={{ backgroundColor: "#FFFDE4", flex: 1 }}>
                <GiftedChat 
                    text={this.state.textMessage}
                    messages={this.state.messageList}
                    onSend={this.handleSubmit}
                    user={{
                        _id: this.state.uid,
                        name: this.state.name,
                        avatar: this.state.photo,
                    }}
                    onInputTextChanged={result => this.setState({textMessage: result})}
                />
                </View>
            </View>
        )
    }
}

export default ChatScreen