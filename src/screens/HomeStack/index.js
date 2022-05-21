import React from 'react';
import { Dimensions } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Test from './Test';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../HomeStack/Dashboard/Dashboard';
import Wallet from '../bottomTabScreens/Wallet';
import History from '../bottomTabScreens/History';
import WorkRide from './Dashboard/WorkRide';
import CustomAlert from '../../common/CustomAlert';
import MapDetails from './MapDetails';
import CollectCash from './CollectCash';
import MultiRideCollectCash from './MultiRideCollectCash'
import Profile from './Profile';
import PersonalRide from './Dashboard/PersonalRide';
import {createDrawerNavigator} from '@react-navigation/drawer';
//Components
import DrawerComponent from '../../component/DrawerComponent';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const bottomTabStack = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const bottomStackScreen = props => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerStyle={{
        backgroundColor: '#c6cbef',
        width: windowWidth -80,
      }}
      initialRouteName="Dashboard"
      drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="History" component={History} />
      <Drawer.Screen name="Wallet" component={Wallet} />
      <Drawer.Screen name="CustomAlert" component={CustomAlert} />
      <Drawer.Screen name="MapDetail" component={MapDetails} />
      <Drawer.Screen name="CollectCash" component={CollectCash} />
      <Drawer.Screen name="MultiRideCash" component={MultiRideCollectCash} />
      <Drawer.Screen name="WorkRide" component={WorkRide} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="PersonalRide" component={PersonalRide} />
    </Drawer.Navigator>
  );
};
export default HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={bottomStackScreen} />
  </Stack.Navigator>
);
