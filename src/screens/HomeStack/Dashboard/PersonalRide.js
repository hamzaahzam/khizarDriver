import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import GradientButton from '../../../common/GradientButton'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import { requestLocationPermission } from '../../common/Permissions'
import Geolocation from '@react-native-community/geolocation'
const { width, height } = Dimensions.get('window')
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Images from '../../../../assets/images';
import { useIsFocused } from '@react-navigation/native';
import WorkRideListItem from '../../../component/WorkRideCard';
import { getPersonalRideList, acceptOfferApi, rejectOfferApi } from '../../../service/Api';
import Loader from '../../../service/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const initialPositionRegion = {
  latitude: 33.738045, longitude: 73.084488,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}
const coordinatesArr = [
  {
    latitude: 33.724377,
    longitude: 73.089558,
  },
  {
    latitude: 33.6961,
    longitude: 73.0491,
  },
  {
    latitude: 33.729943,
    longitude: 73.076314,
  },
]
const PersonalRide = ({ navigation }) => {
  const [data, setData] = useState();

  const [rideList, setRideList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getList();
    }
  }, [isFocused]);

  const getList = () => {
    setLoading(true);
    getPersonalRideList()
      .then(response => {
        setLoading(false);
        if (response.status === 1) {

          let tempArray = response.data;
          console.log('Status is 1', JSON.stringify(tempArray));
          let updatedArray = [];
          tempArray.map(item => {
            if (item.rideStatus != 'end' && item.picklat) {
              updatedArray.push(item);
            }
          });
          setRideList([...updatedArray]);
        } else {
          alert(response.status);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };

  

  

  const renderItem = ({ item, index }) => {

    const { _id, passenger } = item

    return (
      <WorkRideListItem
        rideDetails={item.rideShare ? item.shareList[0] : item}
        action={() => navigation.navigate('MapDetail', { rideDetails:item})}
        button={true}
      />
    );
  }



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
            justifyContent: "space-between"
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
                <Text style={{ fontSize: 20, color: 'white' }}>
                  Currently No Ride sdsd
                </Text>
              </View>
            ) : (
              <FlatList
                data={rideList}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1 }}
                ListFooterComponent={() => {
                  return (
                    <View style={{ width: "100%", height: 180 }}></View>
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
  )
}


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   flexDirection: 'column'
  // },
  // map: {
  //   ...StyleSheet.absoluteFillObject,
  // },

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
export default PersonalRide;