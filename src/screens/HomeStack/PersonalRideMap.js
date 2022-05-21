import React, {Component, useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';

import _ from 'lodash';

import MapView, {
  PROVIDER_GOOGLE,
  Polyline,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'reanimated-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import RideSummaryAndDetail from '../../component/RideSummaryAndDetail';
import database from '@react-native-firebase/database';
import {
  startRide,
  pickRide,
  dropRide,
  changeRideStatusCall,
} from '../../service/Api';
import SwipeUpDown from 'react-native-swipe-up-down';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GetLocation from 'react-native-get-location';
import GradientButton from '../../common/GradientButton';
import Loader from '../../service/Loader';
import Geolocation from '@react-native-community/geolocation';
//Images
import Images from '../../../assets/images';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 33.738045;
const LONGITUDE = 73.084488;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DataBaseRef = database();
const GOOGLE_MAPS_APIKEY = 'AIzaSyAG8XBFKHqkH3iKweO_y3iC6kYvcwdsKxY';

const MapDetails = ({navigation, route}) => {
  const focused = useIsFocused();
  const singleRideData = route?.params?.rideDetails;
  const [rideDetails, setrideDetails] = useState(singleRideData);
  const [passengerNum, setPassengerNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counter, setCouter] = useState(0);
  const [timer, setTimer] = useState('00:00:00');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distanceDuration, setDistanceDuration] = useState(0);
  const [rideStatus, setRideStatus] = useState(0);
  const [region, setRegion] = useState({
    latitude: 33.7201055,
    longitude: 73.0396641,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [statusBtnText, setStatusBtnText] = useState();
  const [statusBtnType, setStatusBtnType] = useState(0);
  const [rideType, setRideType] = useState('start');
  const [myLatitude, setMyLatitude] = useState(region.latitude);
  const [myLongitude, setMyLongitude] = useState(region.longitude);
  const [bottomSnap, setBottomSnap] = useState(0);
  const [myDirection, setMyDirection] = useState({
    latitude: 33.7201055,
    longitude: 73.0396641,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  });
  const [otherDirection, setOtherDirection] = useState({
    latitude: Number(33.7201055),
    longitude: Number(73.0396641),
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  });
  const sheetRef = useRef(null);
  const MapRef = useRef(null);
  const UserTableRef = DataBaseRef.ref('/Ride_tracking').child(rideDetails._id);

  var watchID;

  const getAddress = async info => {
    console.log('Lat & Long', info);
    // const lat = '32.092569'
    // const long = '74.186454'
    let ApiURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    let params = `origins=${info.coords.latitude},${info.coords.longitude}&destinations=${info.coords.latitude},${info.coords.longitude}&key=${GOOGLE_MAPS_APIKEY}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;
    try {
      let response = await fetch(finalApiURL);
      let responseJson = await response.json();
      console.log(
        'ADDRESS/////////////////',
        responseJson.destination_addresses[0],
      );
      rideStart(info, responseJson.destination_addresses[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const getCurrentPosition = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(info => getAddress(info));
  };

  const rideStart = async (coordinates, address) => {
    console.log('.......................In Ride Start');
    const data = {
      start_lat: coordinates.coords.latitude,
      start_lng: coordinates.coords.longitude,
      start_address: address,
      tripId: rideDetails._id,
    };
    startRide(data)
      .then(response => {
        if (response.status === 1) {
          setLoading(false);
          setStatusBtnType(1);
        } else {
          console.log('RideStart', response.status);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('RideStart', error);
        setLoading(false);
      });
  };

  const ridePick = async () => {
    setLoading(true);
    console.log('.......................In Ride Pick');
    const data = {
      pick_lat: rideDetails.passenger.lat,
      pick_lng: rideDetails.passenger.long,
      pick_address: rideDetails.passenger.location,
      tripId: rideDetails._id,
    };
    pickRide(data)
      .then(response => {
        if (response.status === 1) {
          setStatusBtnType(2);
          setLoading(false);
        } else {
          console.log('RidePicked', response.status);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('RidePicked', error);
        setLoading(false);
      });
  };

  const getDropOffAddress = async () => {
    let ApiURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    let params = `origins=${myDirection.latitude},${myDirection.longitude}&destinations=${myDirection.latitude},${myDirection.longitude}&key=${GOOGLE_MAPS_APIKEY}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;
    try {
      let response = await fetch(finalApiURL);
      let responseJson = await response.json();
      console.log(
        'Your have reached to your destination :)',
        responseJson.destination_addresses[0],
      );
      rideDrop(responseJson.destination_addresses[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const rideDrop = async address => {
    setLoading(true);
    console.log('.......................In Ride Drop');
    const data = {
      drop_lat: myDirection.latitude,
      drop_lng: myDirection.longitude,
      drop_address: address,
      tripId: rideDetails._id,
    };
    dropRide(data)
      .then(response => {
        if (response.status === 1) {
          setLoading(false);
          navigation.navigate('CollectCash', {
            fareAmount: response.data.amount,
            rideDetails: rideDetails,
          });
        } else {
          console.log('RideDropped', response.status);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('RideDropped', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (focused) {
      // console.log('Ride Details on Map View', rideDetails);
      requestLocationPermission();
      // setStatusBtnText(
      //   singleRideData?.rideStatus == 'notStarted'
      //     ? 'Start'
      //     : rideDetails?.rideStatus == 'arrived'
      //       ? 'Picked'
      //       : 'Start',
      // );
      setStatusBtnText(
        statusBtnType == 0 ? 'Start' : statusBtnType == 1 ? 'Picked' : 'Drop',
      );
    }
    sheetRef.current.snapTo(bottomSnap);

    return () => {
      if (!_.isNil(watchID)) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, [focused]);
  useEffect(() => {
    if (focused) {
      if (counter != 0) {
        setTimeout(() => {
          setTimer(getHHMMSSFromSeconds(counter));
          setCouter(counter + 1);
        }, 1000);
      }
    } else {
      setCouter(0);
      setTimer(0);
    }
  }, [counter]);

  const getHHMMSSFromSeconds = totalSeconds => {
    if (!totalSeconds) {
      return '00:00:00';
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hhmmss =
      padTo2(hours) + ':' + padTo2(minutes) + ':' + padTo2(seconds);
    return hhmmss;
  };
  const padTo2 = value => {
    if (!value) {
      return '00';
    }
    return value < 10 ? String(value).padStart(2, '0') : value;
  };

  const updateLocationAgainstAppointment = (lat, lng) => {
    UserTableRef.set({
      folderID: rideDetails._id,
      passengerId: rideDetails?.passenger._id,
      driverLat: parseFloat(lat),
      driverLong: parseFloat(lng),
    }).then(() => {
      console.log('Data set.');
    });
  };

  const buildInAppNavigation = () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'googleMaps://app?daddr=' +
            otherDirection.latitude +
            '+' +
            otherDirection.longitude
        : 'google.navigation:q=' +
            otherDirection.latitude +
            '+' +
            otherDirection.longitude,
    );
  };

  async function getEstimatedTimeOfArrival(lat, lng) {
    console.log('Lat+Lng', lat, lng);
    // prepare final API call
    let ApiURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    let params = `origins=${lat},${lng}&destinations=${otherDirection.latitude},${otherDirection.longitude}&key=${GOOGLE_MAPS_APIKEY}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;

    // console.log('finalApiURL:\n');
    // console.log(finalApiURL);

    // get duration/distance from base to each target
    try {
      let response = await fetch(finalApiURL);
      let responseJson = await response.json();
      // console.log('responseJson To Get Time and Distance:\n',responseJson.rows[0].elements[0].distance.text);
      // console.log(responseJson.rows[0].elements[0].duration.text);
      setEstimatedTime(responseJson.rows[0].elements[0].duration.text);
      setDistanceDuration(
        responseJson.rows[0].elements[0].distance.text.split(' ')[0],
      );
    } catch (error) {
      console.error(error);
    }
  }
  const onLatLongValueChanged = () => {
    if (MapRef.current && MapRef.current.animateCamera) {
      MapRef.current.animateCamera(
        {center: region, pitch: 2, heading: 20, altitude: 200, zoom: 5},
        1000,
      );
    }
    setOtherDirection({
      latitude: Number(region.latitude),
      longitude: Number(region.longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      watchID = Geolocation.watchPosition(
        position => {
          let tempCoords = {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
            latitudeDelta: 0.03358723958820065,
            longitudeDelta: 0.04250270688370961,
          };
          setMyLatitude(Number(position.coords.latitude));
          setMyLongitude(Number(position.coords.longitude));
          setMyDirection(tempCoords);
          updateLocationAgainstAppointment(
            position.coords.latitude,
            position.coords.longitude,
          );
          getEstimatedTimeOfArrival(
            position.coords.latitude,
            position.coords.longitude,
          );
          // getDirectionApi(Number(position.coords.latitude), Number(position.coords.longitude))
          // if (isNotificationSend === false) {
          //     calculatePreciseDistance({ latitude: Number(position.coords.latitude), longitude: Number(position.coords.longitude) })
          // }
        },
        error => {
          console.log(error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          distanceFilter: 1,
          maximumAge: 1000,
        },
      );
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // getOneTimeLocation();
          watchID = Geolocation.watchPosition(
            position => {
              let tempCoords = {
                latitude: Number(position.coords.latitude),
                longitude: Number(position.coords.longitude),
                latitudeDelta: 0.03358723958820065,
                longitudeDelta: 0.04250270688370961,
              };
              console.log('Location', position);
              setMyLatitude(Number(position.coords.latitude));
              setMyLongitude(Number(position.coords.longitude));
              setMyDirection(tempCoords);
              updateLocationAgainstAppointment(
                position.coords.latitude,
                position.coords.longitude,
              );
              getEstimatedTimeOfArrival(
                position.coords.latitude,
                position.coords.longitude,
              );
              // getDirectionApi(Number(position.coords.latitude), Number(position.coords.longitude))
              // if (isNotificationSend === false) {
              //     calculatePreciseDistance({ latitude: Number(position.coords.latitude), longitude: Number(position.coords.longitude) })
              // }
            },
            error => {
              console.log(error.message);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              distanceFilter: 1,
              maximumAge: 1000,
            },
          );
        } else {
          console.log('permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        height: 500,
        marginHorizontal: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }}>
      <TouchableOpacity
        style={{padding: 5}}
        onPress={() => {
          sheetRef.current.snapTo(bottomSnap);
          setBottomSnap(bottomSnap == 0 ? 2 : 0);
        }}>
        <View style={styles.line} />
      </TouchableOpacity>
      <RideSummaryAndDetail
        navigation={navigation}
        distance={distanceDuration}
        rideInfo={rideDetails}
        actionforMap={() => buildInAppNavigation()}
        actionOnArrived={() => changeRideStatusCall()}
        statusBtnText={statusBtnText}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#38ef7d',
      }}>
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
            padding: 5,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            height: 60,
            width: '90%',
            marginTop: 60,
            // backgroundColor: '#ffff',
          }}>
          {/* <View style={{flexDirection:"row"}}>
            <Text style={{color:"#58BE3F"}}>
              Rs
            </Text>
            <Text style={{fontWeight:"bold",fontSize:25}}>
              154.75
            </Text>
            </View>
            <Image style={{height:40,width:40}} source={Images.Avatar}/> */}
          <GradientButton
            height={50}
            title={'Use GoogleMap'}
            width={'45%'}
            style={{alignSelf: 'flex-end'}}
            action={() => buildInAppNavigation()}
          />
          {loading ? (
            <Loader />
          ) : (
            <GradientButton
              height={50}
              title={
                statusBtnType == 0
                  ? 'Start'
                  : statusBtnType == 1
                  ? 'Pick'
                  : 'End'
              }
              width={'45%'}
              style={{alignSelf: 'center'}}
              action={() => {
                if (statusBtnType == 0) {
                  getCurrentPosition();
                } else if (statusBtnType == 1) {
                  ridePick();
                } else {
                  getDropOffAddress();
                }
                // alert('Start')
              }}
            />
          )}
        </View>
        <MapView
          ref={MapRef}
          region={myDirection}
          showsUserLocation={true}
          maxZoomLevel={20}
          style={StyleSheet.absoluteFill}>
          <MapView.Marker
            coordinate={otherDirection}
            title={'title'}
            description={'description'}>
            <Image
              source={Images.pinLocationMarker}
              style={{width: 40, height: 40}}
              title={'Passenger Location'}
              resizeMode="contain"
            />
          </MapView.Marker>
          <MapView.Marker
            coordinate={myDirection}
            title={'title'}
            description={'description'}>
            <Image
              source={require('../../../assets/images/car_top.png')}
              style={{width: 40, height: 40}}
              title={'Islamabad'}
              resizeMode="contain"
            />
          </MapView.Marker>

          <MapViewDirections
            origin={myDirection}
            destination={otherDirection}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="#38ef7d"
            optimizeWaypoints={true}
            timePrecision={'now'}
            onStart={params => {
              // console.log(
              //   `Started routing between "${params.origin}" and "${params.destination}"`,
              // );
            }}
            onReady={result => {
              // console.log('Distance in KM ', result.distance);
              // console.log('Duration in Min', result.duration);
              //{ distance: Number, duration: Number, coordinates: [], fare: Object, waypointOrder: [[]] }	Callback that is called when the routing has succesfully finished. Note: distance returned in kilometers and duration in minutes.
              //   if (distance <= 500) {
              //     sendArriveNotification()
              // }
            }}
            onError={errorMessage => console.log('Error', errorMessage)}
          />
          {/* <MapViewDirections
            strokeWidth={6}
            strokeColor="#38ef7d"
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            optimizeWaypoints={true}
          /> */}
        </MapView>
        {/* <SwipeUpDown
          swipeHeight={60}
          itemMini={
            <View
              style={{
                height: '100%',
                width: 420,
                backgroundColor: '#38ef7d',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons
                style={{marginLeft: 10, marginBottom: 12}}
                name={'keyboard-arrow-up'}
                size={30}
              />
            </View>
          } // Pass props component when collapsed
          itemFull={
            <RideSummaryAndDetail
              navigation={navigation}
              distance={distanceDuration}
              rideInfo={rideDetails}
              actionforMap={() => buildInAppNavigation()}
              actionOnArrived={() => changeRideStatusCall()}
              statusBtnText={statusBtnText}
            />
          } // Pass props component when show full
          disablePressToShow={false} // Press item mini to show full
          style={{
            backgroundColor: 'background:rgba(255,255,255, 0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }} // style for swipe
          animation="easeInEaseOut"
        /> */}
        <BottomSheet
          ref={sheetRef}
          snapPoints={[300, 215, 50]}
          borderRadius={10}
          renderContent={renderContent}
          initialSnap={2}
          enabledInnerScrolling={false}
        />
        {counter != 0 && (
          <View style={styles.timerView}>
            <Text style={{color: '#38ef7d'}}>{timer}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  line: {
    width: '50%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C3CDD6',
    alignSelf: 'center',
    marginTop: 10,
  },
  timerView: {
    position: 'absolute',
    top: 120,
    left: 30,
    height: 40,
    width: '30%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapDetails;
