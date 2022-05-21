import React, { Component, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  // FlatList,
  TextInput,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  Linking,
  Alert,
  ToastAndroid,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';

import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler'
import MapView, {
  PROVIDER_GOOGLE,
  Polyline,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'reanimated-bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import { Rating } from 'react-native-ratings';
import RideSummaryAndDetail from '../../component/RideSummaryAndDetail';
import database from '@react-native-firebase/database';
import { getScheduleRideDetails, saveAmountInKhizarWallet, changeRideStatusCall, startRide, arriveRide, pickRide, dropRide } from '../../service/Api';
import GradientButton from '../../common/GradientButton';
import Loader from '../../service/Loader';
import Geolocation from '@react-native-community/geolocation';
//Images
import Images from '../../../assets/images';
import Prefrence from 'react-native-preference';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 33.738045;
const LONGITUDE = 73.084488;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DataBaseRef = database();
const GOOGLE_MAPS_APIKEY = 'AIzaSyAG8XBFKHqkH3iKweO_y3iC6kYvcwdsKxY';

const MapDetails = ({ navigation, route }) => {
  const focused = useIsFocused();
  let rideMainData = route.params.rideDetails;
  let singleRideData = route?.params?.rideDetails?.rideShare
    ? route.params.rideDetails.shareList[0]
    : route.params.rideDetails;
  const [collectedAmount, setCollectedAmount] = useState('0');
  const [walletAmount, setWalletAmount] = useState('0');
  const [showMainBtn, setShowMainBtn] = useState(false)
  const [rideDetails, setrideDetails] = useState(null);
  const [passengerNum, setPassengerNum] = useState(0);
  const [driverAddress, setDriversAddress] = useState('');
  const [bottomSnap, setBottomSnap] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState('00:00:00');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distanceDuration, setDistanceDuration] = useState(0);
  const [showBtn, setShowBtn] = useState(true);
  const [modalVisibility, setModalVisibility] = useState(false)
  const [fareAmount, setFareAmount] = useState()
  const [region, setRegion] = useState({
    latitude: 33.7201055,
    longitude: 73.0396641,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [statusBtnText, setStatusBtnText] = useState('');
  const [myLatitude, setMyLatitude] = useState(region.latitude);
  const [myLongitude, setMyLongitude] = useState(region.longitude);
  const [myDirection, setMyDirection] = useState({
    latitude: 33.7201055,
    longitude: 73.0396641,
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  });
  const [otherDirection, setOtherDirection] = useState({
    latitude: Number(singleRideData.passenger.lat),
    longitude: Number(singleRideData.passenger.long),
    latitudeDelta: 0.03358723958820065,
    longitudeDelta: 0.04250270688370961,
  });
  const sheetRef = useRef(null);
  const MapRef = useRef(null);
  const UserTableRef = DataBaseRef.ref('/Ride_tracking').child(singleRideData._id);

  var watchID;

  useEffect(() => {

    if (focused) {
      setrideDetails(singleRideData)
      console.log('Ride Details on Map View', singleRideData.rideStatus);
      requestLocationPermission();
      if (rideMainData?.shareList) {
        setStatusBtnText('Start')
      } else {
        if (singleRideData?.rideStatus == 'create' || singleRideData?.rideStatus == 'accept') {
          setStatusBtnText("Start")
        } else if (singleRideData?.rideStatus == 'start') {
          setStatusBtnText("Arrived")
        } else if (singleRideData?.rideStatus == 'arrive') {
          setStatusBtnText("Pick")
        } else if (singleRideData?.rideStatus == 'pick') {
          setStatusBtnText("Drop")
        }
        // setStatusBtnText(
        //   rideDetails?.rideStatus == 'create'
        //     ? 'Start'
        //     : rideDetails?.rideStatus == 'start'
        //       ? 'Arrived' :
        //       rideDetails?.rideStatus == 'arrive' ?
        //         'Pick' :
        //         rideDetails?.rideStatus == 'pick' ?
        //           'Drop'
        //           : rideDetails?.rideStatus == 'drop' ? 'Drop':""
        // );
      }
      if (rideMainData?.shareList && rideMainData._id == Prefrence.get("rideDetail")?._id) {
        setShowBtn(false)
      }
      sheetRef.current.snapTo(bottomSnap);
    } else {
      setStatusBtnText('');
      setShowBtn(true)
    }
    // if(rideMainData?.rideShare)
    // {
    //   setShowBtn(false)
    // }
    // else{
    //   setStatusBtnText(rideDetails.rideStatus == 'create' ? 'Start' : rideDetails.rideStatus == 'start' ? 'Arrived' : rideDetails.rideStatus == 'arrived' ? 'Pick' : rideDetails.rideStatus == 'pick' ? 'Drop' : rideDetails.rideStatus == 'drop' && 'End')
    // }
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
          setCounter(counter + 1);
        }, 1000);
      }
    } else {
      setCounter(0);
      setTimer(0)
    }
  }, [counter]);

  const saveFareAmount = () => {
    setLoading(true);
    const folderID = rideDetails?._id;
    const data = {
      passengerId: rideDetails?.passenger._id,
      fareAmount: fareAmount,
      collectAmount: collectedAmount,
      walletAmount: walletAmount,
    };
    console.log("*********************: ", data.passengerId)
    saveAmountInKhizarWallet(folderID, data)
      .then(response => {
        console.log("O yaaaaaaaaaaarrrrrrrrrrrrrr", response.data)
        setLoading(false);
        if (response.status === 1) {
          setModalVisibility(false);
        } else {
          alert(response.status);
        }
      })
      .catch(error => {
        alert(error);
      });
  };

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
      folderID: singleRideData._id,
      passengerId: singleRideData?.passenger._id,
      driverLat: parseFloat(lat),
      driverLong: parseFloat(lng),
    }).then(() => {
      console.log('Data set.');
    });
  };

  const callRideStatus = async () => {
    setLoading(true);
    if (statusBtnText.toLowerCase() == 'arrived') {
      setOtherDirection({
        latitude: Number(rideDetails.droplat),
        longitude: Number(rideDetails.droplong),
        latitudeDelta: 0.03358723958820065,
        longitudeDelta: 0.04250270688370961,
      });
    }
    if (statusBtnText.toLowerCase() == 'start') {
      setShowBtn(false)
      Prefrence.setWhiteList([]);
      Prefrence.set("rideDetail", rideMainData)
      Prefrence.set("rideStarted", true)
    } else if (statusBtnText.toLowerCase() == 'end') {
      Prefrence.setWhiteList([]);
      Prefrence.set("rideDetail", null)
      Prefrence.set("rideStarted", false)
    }
    const folderID = rideDetails._id;
    var data = {
      status: statusBtnText.toLowerCase(),
      passengerId: rideDetails?.passenger._id,
      pickLocation: rideDetails?.passenger.location,
      dropLocation: rideDetails?.passenger.location,
      droplat: rideDetails?.droplat,
      droplong: rideDetails?.droplong,
      picklat: rideDetails?.picklat,
      picklong: rideDetails?.picklong,
      distanceDuration: distanceDuration,
    };
    console.log("??????????", data)
    changeRideStatusCall(folderID, data)
      .then(response => {
        console.log('LatestCheck', response.data);

        if (response.status === 1) {
          setLoading(false);
          if (statusBtnText.toLowerCase() == 'end') {
            if (!rideMainData.rideShare) {
              navigation.navigate('CollectCash', {
                fareAmount: response.data.fareAmount,
                rideDetails: rideDetails,
              });

            } else {
              navigation.navigate('CollectCash', {
                fareAmount: response.data.fareAmount,
                rideDetails: rideDetails,
              });
            }
          } else {
            if (statusBtnText.toLowerCase() == 'start') {
              setStatusBtnText('Arrived');
            } else if (statusBtnText.toLowerCase() == 'arrived') {
              setStatusBtnText('Picked');
            } else if (statusBtnText.toLowerCase() == 'Picked') {
              setCounter(counter + 1)

              setStatusBtnText("End")
            }
          }
        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };


  const RideStart = (data, index, status) => {
    console.log("In RideStart")
    setLoading(true);
    var data = {
      start_lat: myDirection.latitude,
      start_lng: myDirection.longitude,
      start_address: driverAddress,
      tripId: data._id,

    };
    console.log("RideStart Data:", data)
    startRide(data)
      .then(response => {
        setLoading(false);
        Prefrence.setWhiteList([]);
        Prefrence.set("rideStarted", true)
        console.log('Start Ride: ', response.data)
        ToastAndroid.show("Ride has started now", ToastAndroid.SHORT)
        if (response.status === 1) {
          if (rideMainData.rideShare) {
            let temporarayArr = [...rideMainData.shareList];
            temporarayArr[index].rideStatus = 'arrived'
            rideMainData.shareList = [...temporarayArr]
            Prefrence.set("rideDetail", rideMainData)
          }
          else {
            let SingleData = singleRideData;
            SingleData.rideStatus = 'start';
            setStatusBtnText('Arrived')
            Prefrence.set("rideDetail", SingleData)
          }

        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  const RideArrived = (data, index) => {
    console.log("In Arrived")
    setLoading(true);
    var data = {
      arrive_lat: myDirection.latitude,
      arrive_lng: myDirection.longitude,
      arrive_address: driverAddress,
      tripId: data._id,
    };

    console.log("RideArrived Data:", data)
    arriveRide(data)
      .then(response => {
        console.log('Arrived Ride: ', response.data)
        setLoading(false);
        Prefrence.setWhiteList([]);
        Prefrence.set("rideStarted", true)
        ToastAndroid.show("Driver is arrived", ToastAndroid.SHORT)
        if (response.status === 1) {
          if (rideMainData.rideShare) {
            let temporarayArr = [...rideMainData.shareList];
            temporarayArr[index].rideStatus = 'drop'
            rideMainData.shareList = [...temporarayArr]
            Prefrence.set("rideDetail", rideMainData)
          }
          else {
            let SingleData = singleRideData;
            SingleData.rideStatus = 'arrive';
            setStatusBtnText('Pick')
            Prefrence.set("rideDetail", SingleData)
          }
        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  const RidePick = (data, index) => {
    console.log("In RidePick")
    setLoading(true);
    var data = {
      pick_lat: myDirection.latitude,
      pick_lng: myDirection.longitude,
      pick_address: driverAddress,
      tripId: data._id,
    };

    console.log("RidePick Data: ", data)
    pickRide(data)
      .then(response => {

        console.log('Pick Ride: ', response.data)
        setLoading(false);
        ToastAndroid.show("Passenger is Picked", ToastAndroid.SHORT)
        if (response.status === 1) {
          if (rideMainData.rideShare) {
            let temporarayArr = [...rideMainData.shareList];
            if (index < temporarayArr.length - 1) {
              setOtherDirection({
                latitude: Number(temporarayArr[index + 1].passenger.lat),
                longitude: Number(temporarayArr[index + 1].passenger.long),
                latitudeDelta: 0.03358723958820065,
                longitudeDelta: 0.04250270688370961,
              });
            } else {
              setOtherDirection({
                latitude: Number(temporarayArr[0].droplat),
                longitude: Number(temporarayArr[0].droplong),
                latitudeDelta: 0.03358723958820065,
                longitudeDelta: 0.04250270688370961,
              });
            }
            temporarayArr[index].rideStatus = 'pick'
            rideMainData.shareList = [...temporarayArr]
          }
          else {
            let SingleData = singleRideData;
            SingleData.rideStatus = 'pick';
            setStatusBtnText('Drop')
            Prefrence.set("rideDetail", SingleData)
            console.log("setotherDirection",rideDetails)
            setOtherDirection({
              latitude: Number(rideDetails.droplat),
              longitude: Number(rideDetails.droplong),
              latitudeDelta: 0.03358723958820065,
              longitudeDelta: 0.04250270688370961,
            });
          }
        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const RideDrop = (data, index) => {
    console.log("In RideDrop")
    setLoading(true);
    var data = {
      drop_lat: myDirection.latitude,
      drop_lng: myDirection.longitude,
      drop_address: driverAddress,
      tripId: data._id,
      rideShare: 0
    };

    console.log("RideDrop Data: ", data)

    dropRide(data)
      .then(response => {
        ToastAndroid.show("Ride is ended", ToastAndroid.SHORT)
        console.log('Drop Ride: ', response.data)
        setLoading(false);
        Prefrence.setWhiteList([]);
        Prefrence.set("rideDetail", null)
        Prefrence.set("rideStarted", false)
        if (response.status === 1) {
          if (rideMainData?.rideShare) {
            setModalVisibility(true)
            setShowBtn(false)
            console.log("RideShare************", rideMainData.rideShare)
            let temporarayArr = [...rideMainData.shareList];
            if (temporarayArr.length == 1) {
              setModalVisibility(false)
              navigation.navigate('CollectCash', {
                fareAmount: response.data.amount,
                rideDetails: data,
              });
            }
            temporarayArr.splice(index, 1)
            rideMainData.shareList = [...temporarayArr]
            setFareAmount(response.data.amount)

          }
          else {
            setrideDetails(null)
            singleRideData = null
            navigation.navigate('CollectCash', {
              fareAmount: response.data.amount,
              rideDetails: rideDetails,
            });
            setModalVisibility(false)
            setShowBtn(false)

          }
        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const MultiRideStatus = (data, index) => {
    // console.log("RideStatus/n", data.rideStatus)
    if (rideMainData.rideShare) {
      data.rideStatus == 'create' ? RideStart(data, index) : data.rideStatus == 'start' ? RideArrived(data, index) : data.rideStatus == 'arrived' ? RidePick(data, index) : data.rideStatus == 'pick' ? RideDrop(data, index) : data.rideStatus == 'drop' && RideDrop(data, index)
    } else {
      statusBtnText == 'Start' ? RideStart(data, index) : statusBtnText == 'Arrived' ? RideArrived(data, index) : statusBtnText == 'Pick' ? RidePick(data, index) : statusBtnText == 'Drop' ? RideDrop(data, index) : statusBtnText == 'End' && RideDrop(data, index)
    }
  };


  const buildInAppNavigation = (lat, lng) => {
    console.log("LAT**********************************", lat)
    console.log("LONG**********************************", lng)
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'googleMaps://app?daddr=' +
        lat +
        '+' +
        lng
        : 'google.navigation:q=' +
        lat +
        '+' +
        lng,
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
      setDriversAddress(responseJson.destination_addresses[0])
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
        { center: region, pitch: 2, heading: 20, altitude: 200, zoom: 5 },
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

  // const seeOnMap = () => {
  //   const locationStart = `${Number(73.0396641)},${Number(73.0396641)}`;
  //   const scheme = Platform.select({
  //     ios: `maps:${locationStart}?q=`,
  //     android: `geo:${locationStart}?q=`,
  //   });
  //   const latLng = `${Number(73.0396641)},${Number(73.0396641)}`;
  //   const label = 'G11 Markaz';
  //   const url = Platform.select({
  //     ios: `${scheme}${label}&ll=${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });
  //   Linking.openURL(url);
  // };

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
  const renderPassengerList = ({ item, index }) => {
    return (
      <RideSummaryAndDetail
        navigation={navigation}
        distance={distanceDuration}
        rideInfo={item}
        rideIndex={index}
        actionforMap={() => { item.rideStatus == 'pick' ? buildInAppNavigation(item.droplat, item.droplong) : buildInAppNavigation(item.picklat, item.picklong) }}
        statusBtnText={statusBtnText}
        MultiRide={() => MultiRideStatus(item, index)}
        rideBtn={showBtn}

      />
    )
  }

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        height: 750,
        marginHorizontal: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }}>
      <TouchableOpacity style={{ padding: 5 }} onPress={() => {
        sheetRef.current.snapTo(bottomSnap)
        setBottomSnap(bottomSnap == 0 ? 2 : 0)
      }}>
        <View style={styles.line} />
      </TouchableOpacity>
      {rideMainData.rideShare ?
        <FlatList
          data={rideMainData?.shareList}
          style={{ flex: 1 }}
          keyExtractor={(item) => item._id}
          renderItem={renderPassengerList}
          ListFooterComponent={() => {
            return (
              <View style={{ width: "100%", height: 180 }}>
              </View>
            )
          }}
        />
        :
        <RideSummaryAndDetail
          navigation={navigation}
          distance={distanceDuration}
          rideInfo={singleRideData}
          actionforMap={() => { item.rideStatus == 'picked' ? buildInAppNavigation(item.droplat, item.droplong) : buildInAppNavigation(item.picklat, item.picklong) }}
          actionOnArrived={() => changeRideStatusCall()}
          statusBtnText={statusBtnText}
          rideBtn={showBtn}
        />}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#38ef7d',
      }}>
      <View style={styles.container}>
        <Modal animationType="slide"
          transparent
          visible={modalVisibility}
          presentationStyle="overFullScreen"
          onRequestClose={() => setModalVisibility(false)}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>

              <Image
                style={{
                  width: width * 0.9,
                  height: height / 2.5,
                  position: 'absolute',
                  bottom: 0,
                  zIndex: -9999,
                  resizeMode: 'stretch',
                }}
                source={Images.splashBuildings}
              />
              <View style={styles.textFieldCont}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 5,
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 26,
                    color: 'black',
                  }}>
                  Total Ride Fare
                </Text>
                <Text
                  style={{ textAlign: 'center', fontSize: 26, color: '#00000090' }}>
                  {fareAmount}
                </Text>
              </View>
              <View style={styles.textFieldCont}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Collected Amount
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: 'white' }]}
                  value={collectedAmount}
                  keyboardType="numeric"
                  placeholderTextColor={"#424242"}
                  onSubmitEditing={() => { }}
                  onChangeText={text => {
                    setCollectedAmount(text)
                  }}
                />
              </View>
              <View style={[styles.textFieldCont, { marginBottom: 20 }]}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Add Amount to Khizar Wallet
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: 'white' }]}
                  value={walletAmount}
                  keyboardType="numeric"
                  // editable={false}
                  placeholderTextColor={"#424242"}
                  onChangeText={setWalletAmount}
                />
              </View>
              {loading ? (
                <Loader />
              ) : (
                <GradientButton
                  height={50}
                  title={'Add'}
                  width={'90%'}
                  style={{ alignSelf: 'center' }}
                  action={() => saveFareAmount()}
                />
              )}
            </View>
          </View>
        </Modal>

        {loading && <Loader />}

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
            style={{ alignSelf: 'flex-end' }}
            action={() => buildInAppNavigation(otherDirection.latitude, otherDirection.longitude)}
          />

          {loading ? <Loader /> : showBtn &&
            <GradientButton
              height={50}
              title={statusBtnText}
              width={'45%'}
              style={{ alignSelf: 'center' }}
              action={() => MultiRideStatus(rideDetails, 0)}
            />
          }
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
              style={{ width: 40, height: 40 }}
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
              style={{ width: 40, height: 40 }}
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
          snapPoints={[600, 415, 50]}
          borderRadius={10}
          renderContent={renderContent}
          initialSnap={2}
          enabledInnerScrolling={true}
          enabledGestureInteraction={false}
          enabledContentTapInteraction={false}
        />
        {counter != 0 && (
          <View style={styles.timerView}>
            <Text style={{ color: "#38ef7d" }}>{timer}</Text>
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
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    paddingHorizontal: 10,
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  roundedHeader: {
    width: width * 0.9,
    height: 200,
  },
  textFieldCont: {
    justifyContent: 'space-between',
    marginTop: 15,
    flexDirection: 'column',
    width: '90%',
    margin: 10,
    borderColor: '#ffff',
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#F2F2F2',
    color: '#424242',
    width: '100%',
    borderRadius: 15,
    fontSize: 18,
  },

});

export default MapDetails;
