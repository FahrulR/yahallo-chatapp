/* eslint-disable prettier/prettier */
import React from 'react' 
import { Icon } from 'native-base'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'

import ActionBarImage from '../screens/ActionBarImage'

//Splash Screen
import AuthLoadingScreen from '../screens/AuthPage/AuthLoading'
import SplashScreen from '../screens/AuthPage/Splash'

//AuthPage screen
import LoginScreen from '../screens/AuthPage/Login'
import SignUpScreen from '../screens/AuthPage/SignUp'

import HomeScreen from '../screens/HomePage/Home'
//HomePage screen
import FriendScreen from '../screens/HomePage/FriendScreen'
import ProfileScreen from '../screens/HomePage/Profile'
import LocationScreen from '../screens/HomePage/Location'

//Dynamic screen
import ChatScreen from '../screens/DynamicPage/ChatScreen'
import FriendProfile from '../screens/DynamicPage/FriendProfile'
import UserProfile from '../screens/DynamicPage/UserProfile'
import EditScreen from '../screens/DynamicPage/EditScreen'

const HomeTabNavigator = createMaterialTopTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (  
                <Icon type="SimpleLineIcons" name="bubble" style={{alignSelf:'center', fontSize:20 , color:`${tintColor}`}} />
                ),
                title: 'Chats'
            },
        },
        Friend: {
            screen: FriendScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (  
                <Icon type="SimpleLineIcons" name="people" style={{alignSelf:'center', fontSize:20 , color:`${tintColor}`}} />
                ),
                title: 'Friends'
            },
        },
        Location: {
            screen: LocationScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                <Icon type="SimpleLineIcons" name="location-pin" style={{alignSelf:'center', fontSize:20, color:`${tintColor}`}}/>
                ),
                title: 'Location'
            },
        },
    },
    {
        swipeEnabled: true,
        tabBarOptions: { 
            showIcon: true,
            backgroundColor: 'white',
            activeTintColor: 'yellow',
            inactiveTintColor: 'white',
            activeBackgroundColor: '#232b2b',
            inactiveBackgroundColor: '#232b2b',
            borderTopWidth: 0,
            style: {
                paddingVertical: 6,
                backgroundColor: '#ff9966',
                shadowColor: 'transparent',
            },
        },
    },
)

const HomePage = createStackNavigator(
    {
        Home: { screen: HomeTabNavigator },
        Chat: { screen: ChatScreen },
        Profile: { screen: ProfileScreen},
        FriendProfile : { screen: FriendProfile },
        UserProfile: { screen: UserProfile },
        Edit: { screen: EditScreen },
    },{
         defaultNavigationOptions: {

      title: 'Yahallo',
      headerRight: <ActionBarImage />,    
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#ff9966',
        borderBottomWidth: 0,
        elevation: 0,
      },

    },
    }
)

const AppNavigation = createSwitchNavigator(
    {
        AuthLoading: { screen: AuthLoadingScreen },
        Login: { screen: LoginScreen },
        SignUp: { screen: SignUpScreen },
        Tabs: { screen: HomePage },
    }
)

const InitialNavigation = createSwitchNavigator(
    {
        Splash: { screen: SplashScreen },
        App: { screen: AppNavigation }
    }
)

export default createAppContainer( InitialNavigation )