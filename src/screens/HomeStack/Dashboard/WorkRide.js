import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Platform,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../../../../assets/images';
import {useIsFocused} from '@react-navigation/native';
import WorkRideListItem from '../../../component/WorkRideCard';
import {getScheduledRideList} from '../../../service/Api';
import Loader from '../../../service/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Prefrence from 'react-native-preference';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const rideData=Prefrence.get("rideDetail")
const RideId=rideData?._id
const WorkRide = ({navigation}) => {
  const [rideList, setRideList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getList();
      // console.log("**************************************",RideId)
    }
    
  }, [isFocused]);
  const getList = () => {
    setLoading(true);
    getScheduledRideList()
      .then(response => {
        setLoading(false);
        if (response.status === 1) {

          let tempArray = response.data;
          let updatedArray = [];
          tempArray.map(item => {
            if (item.rideStatus != 'drop' && item.rideStatus != 'end') {
              updatedArray.push(item);
            }
          });
          setRideList([...updatedArray]);
          console.log('Status is 1', JSON.stringify(updatedArray));
        } else {
          alert(response.status);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };
  const renderItem = ({item}) => (
    <WorkRideListItem
      rideDetails={item.rideShare?item.shareList[0]:item}
      action={() => navigation.navigate('MapDetail', {rideDetails: item})}
      button={false}
      rideDetailObject={item}
      rideID={RideId}
    />
  );

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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 50,
            justifyContent:"space-between"
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name={'arrowleft'} size={24} color={'#ffffff'} />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Ride List</Text>
          <Text style={styles.welcomeText}>   </Text>
        </View>
      </ImageBackground>
      {!!loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
              marginTop: Platform.OS === 'ios' ? 20 : 20,
              marginBottom: 20,
              // alignItems: 'center',
              // justifyContent: 'center',
            }}>
            {rideList.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  Currently No Ride sdsd
                </Text>
              </View>
            ) : (
              <FlatList
                data={rideList}
                renderItem={renderItem}
                contentContainerStyle={{flexGrow:1}}
                ListFooterComponent={()=>{
                  return(
                    <View style={{width:"100%",height:180}}></View>
                  )
                }}
                keyExtractor={item => item._id}
              />
            )}
          </View>
        </View>
      )}
      <Image
        style={{
          width: width,
          height: height / 2,
          position: 'absolute',
          bottom: 0,
          zIndex: -9999,
          resizeMode: 'stretch',
        }}
        source={Images.splashBuildings}
      />
    </SafeAreaView>
  );
};

export default WorkRide;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
  },
  roundedHeader: {
    width: width,
    height: 200,
  },
  welcomeText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
    letterSpacing: 1,
  },
});
