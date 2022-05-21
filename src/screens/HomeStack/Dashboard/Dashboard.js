import React, { Component, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import DashboardItem from '../../../component/DashboardItem';
import Images from '../../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
// import * as Animatable from 'react-native-animatable';
import Prefrence from 'react-native-preference';
import { useIsFocused } from '@react-navigation/native';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const Dashboard = props => {
  const focused = useIsFocused();
  const [storageData, setStorageData] = useState()
  const [ride, setRide] = useState()
  // const storageData = Prefrence.get('rideDetail')
  // const ride = Prefrence.get('rideStarted')

  useEffect(() => {

    if (focused) {
      setStorageData( Prefrence.get('rideDetail')),
      setRide(Prefrence.get('rideStarted'))
    }
  }, [focused]);
   
  const { navigation } = props;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ImageBackground
        resizeMode="stretch"
        style={styles.roundedHeader}
        source={Images.roundedHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
          <Feather name={"menu"} color={"white"} size={26} />
        </TouchableOpacity>
        <Image style={styles.dashBoardImage} source={Images.dashBoard} />
      </ImageBackground>
      <View style={styles.container}>
        <View
          style={{
            width: '90%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 100,
          }}>
          <View
            style={{
              height: 150,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
            }}>
            <DashboardItem
              title={'Work Ride'}
              imageName={Images.workRide}
              navigateTo={() => navigation.navigate('WorkRide')}
            />
            <DashboardItem
              title={'Personal Ride'}
              imageName={Images.personalRide}
              navigateTo={() => navigation.navigate('PersonalRide')}
            />
          </View>
          <View
            style={{
              height: 150,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
              marginTop: 22,
            }}>
            <DashboardItem
              title={'History'}
              imageName={Images.history}
              navigateTo={() => navigation.navigate('History')}
            />
            <DashboardItem
              title={'Wallet'}
              imageName={Images.wallet}
              navigateTo={() => {
                // navigation.openDrawer();
                navigation.navigate('Wallet')
              }}
            />
          </View>
          {/* <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={{ bottom: 12, position: 'absolute', right: 100, marginTop: 100 }}> */}
          {ride && <TouchableOpacity
            onPress={() => navigation.navigate('MapDetail', { rideDetails: storageData })}
            style={{ height: 80, position: "relative" }} >
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
              <Icon name="radio-button-on-outline" size={65} color={'#38ef7d'} />
              <Text style={{ color: 'white', fontSize: 12 }}>In Progress</Text>
            </View>
          </TouchableOpacity>}
          {/* </Animatable.View> */}
        </View>
      </View>
      <TouchableOpacity
        // onPress={() => validatePhoneNum()}
        style={styles.presseableView}>
        <Text style={styles.presseableText}>Continue</Text>
        {/* <AntDesign name={'arrowright'} size={24} color={'#ffffff'} /> */}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textStyle: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
  },
  menuContainer: {},
  roundedHeader: {
    width: width,
    height: 200,
  },
  dashBoardImage: {
    position: 'absolute',
    bottom: -110,
    width: width,
    height: height / 3,
  },
  presseableView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#58BE3F',
    alignItems: 'center',
    height: 55,
    borderRadius: 10,
    // position:"absolute",
    // bottom:100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  presseableText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});
export default Dashboard;
