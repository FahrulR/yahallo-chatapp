import React, { Component } from 'react';
 
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'
import { withNavigation } from 'react-navigation';
 
class ActionBarImage extends Component {

  render() {
    return (
    	<TouchableOpacity onPress={ () => {this.props.navigation.navigate('Profile') }} activeOpacity={0.8}>
        <Icon type="FontAwesome5" name="users-cog" style={{marginRight:20, fontSize:20, color:'white'}}/>
        </TouchableOpacity>
    );
  }
}

export default withNavigation(ActionBarImage)