import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Images from '../../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
const StatusBarHeight = StatusBar.currentHeight;
//Components
import DrawerItem from './DrawerItem';
import AppButton from './AppButton';
import { Drawer } from 'react-native-paper';

const url = '/logout';

export default class CompanyDrawerContent extends Component {


  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      switchEnable: false,

    };
  }

  render() {
    const { navigation } = this.props;
    const logOut = async () => {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      await AsyncStorage.clear();
      await AsyncStorage.setItem('fcmToken', fcmToken);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
      console.log('LogOut');
    };
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.drawerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.header}>
            <Image style={styles.avatar} source={Images.Avatar} />
            <View style={{ marginLeft: 20 }}>
              <Text style={styles.greetingText}>{'Good Morning,'}</Text>
              <Text style={styles.titleText}>{'Driver Name'}</Text>
            </View>
          </TouchableOpacity>
          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            <DrawerItem
              title={'Payment History'}
              containerStyle={{ marginTop: 20, marginLeft: 20 }}
            />
            <DrawerItem
              title={'Ride History'}
              notifications={'2'}
              containerStyle={{ marginLeft: 20 }}
              onPress={() => navigation.navigate('History')}
            />
            <DrawerItem title={'Message'} containerStyle={{ marginLeft: 20 }} />
            <DrawerItem title={'Settings'} containerStyle={{ marginLeft: 20 }} />
            <DrawerItem title={'Support'} containerStyle={{ marginLeft: 20 }} />
            <DrawerItem title={'Personal Ride'} containerStyle={{ marginLeft: 20 }}>


            </DrawerItem>

            <Switch
              trackColor={this.state.switchEnable ? "#58BE3F" : "#767577"}
              thumbColor={this.state.switchEnable ? "#58BE3F" : "#f4f3f4"}
              backgroundColor={'#fffff'}
              style={{ top: -30, right: 15, width: 50, alignSelf: 'flex-end' }}
              onValueChange={() => {
                this.setState({
                  switchEnable: (!this.state.switchEnable)
                })
              }}
              value={this.state.switchEnable}
            />
            <View style={styles.logOutView}>
              <TouchableOpacity onPress={logOut} style={styles.pressableButton}>
                <Text>Log Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 100,
    padding: 20,
    borderBottomWidth: 2,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: '#303030',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#303030',
  },
  logOutView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pressableButton: {
    height: 45,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#58BE3F',
    borderRadius: 25,
    marginTop: 33,
    elevation: 5,
    marginBottom: 40,
  },
});
