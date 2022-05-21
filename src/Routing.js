import React, {useEffect, useState} from 'react';
const navigator = React.createRef();
import {View, Text, Alert, LogBox, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './screens/AuthStack';
import Splash from './screens/splash';
import OnBoarding from './screens/onBoarding';
import OnBoardingLogin from './screens/onBoardingLogin';
import HomeStack from './screens/HomeStack';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import PersonalRideMap from './screens/HomeStack/PersonalRideMap';
import WorkRide from './screens/HomeStack/Dashboard/WorkRide';
import {getRideDetail, acceptOfferApi, rejectOfferApi} from './service/Api';
import Geolocation from '@react-native-community/geolocation';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomizedAlert from './component/CustomAlert';
import Preference from 'react-native-preference';
const Stack = createStackNavigator();

const GOOGLE_MAPS_APIKEY = 'AIzaSyAG8XBFKHqkH3iKweO_y3iC6kYvcwdsKxY';
LogBox.ignoreAllLogs(true);
const App = ({navigation}) => {
  const [rideDetail, setRideDetail] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState('');
  const [rideID, setRideId] = useState();
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distanceDuration, setDistanceDuration] = useState(0);
  const [rejectData, setRejectData] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => {
    console.log('App Js called');
    SplashScreen.hide();
    requestUserPermission();
    createNotificationListeners();

    messaging().onMessage(async remoteMessage => {
      // const { notification, data } = remoteMessage;
      // const { title, body, } = notification
      // showAlert(title, body);
    });
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // const { notification, data } = remoteMessage;
      // const { title, body, } = notification
      // showAlert(title, body);
    });
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
      console.log('Authorization status:', authStatus);
    }
  }
  async function createNotificationListeners() {
    messaging().onMessage(async remoteMessage => {
      console.log(
        'createNotificationListenersLatest',
        'notificationListener-remoteMessage',
        JSON.stringify(remoteMessage),
      );
      const {notification, data} = remoteMessage;
      const {title, body} = notification;
      // showAlert(title, body);
      setModalShow(true);
      setModalData(body);
      setRideId(data.rideId);
      if (data.notificationType == 'personal') {
        setShowBtn(true);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'createNotificationListenersLatest',
        'notificationOpenedListener-remoteMessage',
        JSON.stringify(remoteMessage),
      );
      const {notification, data} = remoteMessage;
      const {title, body} = notification;
      // showAlert(title, body);
      setModalShow(true);
      setModalData(body);
      setRideId(data.rideId);
      if (data.notificationType == 'personal') {
        setShowBtn(true);
      }
    });
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('Yes');
        if (remoteMessage) {
          const {notification, data} = remoteMessage;
          const {title, body} = notification;
          // showAlert(title, body);
          if (data.notificationType == 'personal') {
            setModalShow(true);
            setModalData(body);
            setRideId(data.rideId);
            setShowBtn(true);
          } else {
            setTimeout(() => {
              navigator.current.navigate('WorkRide');
            }, 3000);
          }
        }
      });
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        const {notification, data} = remoteMessage;
        const {title, body} = notification;
        // navigation.navigate('MapDetail')
        // showAlert(title, body);
        setModalShow(true);
        setModalData(body);
        setRideId(data.rideId);
        if (data.notificationType == 'personal') {
          setShowBtn(true);
        }
      }
    });
  }
  async function getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let apiToken = await AsyncStorage.getItem('token');
    console.log('Token from Storage', fcmToken);
    console.log('APIToken from Storage', apiToken);

    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log('Token from Message', fcmToken);

      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  const acceptRideOffer = async (info, address) => {
    const data = {
      tripId: rideID,
      accept_lat: info.coords.latitude,
      accept_lng: info.coords.longitude,
      accept_address: address,
    };
    console.log('Sending Accept Data', data);
    acceptOfferApi(data)
      .then(response => {
        if (response.status === 1) {
          // console.log('AcceptOffer from Api', JSON.stringify(response))
          RideDetail();
        } else {
          console.log('AcceptOffer', response.status);
        }
      })
      .catch(error => {
        console.log('AcceptOffer', error);
      });
  };

  const rejectRideOffer = async (info, address) => {
    const data = {
      tripId: rideID,
      start_lat: info.coords.latitude,
      start_lng: info.coords.longitude,
      reject_address: address,
    };
    rejectOfferApi(data)
      .then(response => {
        if (response.status === 1) {
          console.log('RejectOffer from Api', JSON.stringify(response));
          setRejectData(response);
          setModalShow(false);
        } else {
          console.log('RejectOffer', response.status);
        }
      })
      .catch(error => {
        console.log('RejectOffer', error);
      });
  };

  const RideDetail = () => {
    getRideDetail(rideID)
      .then(response => {
        if (response.status === 1) {
          console.log('Status:***', JSON.stringify(response.data));
          navigator.current.navigate('PersonalRideMap', {
            rideDetails: response.data,
          });
          setModalShow(false);
        }
      })
      .catch(error => {
        alert(error);
      });
  };
  const getEstimatedTimeOfArrival = async (info, acceptBit) => {
    console.log('Lat & Long', info);
    // const lat = '32.092569'
    // const long = '74.186454'
    // prepare final API call
    let ApiURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
    let params = `origins=${info.coords.latitude},${info.coords.longitude}&destinations=${info.coords.latitude},${info.coords.longitude}&key=${GOOGLE_MAPS_APIKEY}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;
    try {
      let response = await fetch(finalApiURL);
      let responseJson = await response.json();
      console.log(responseJson.destination_addresses[0]);
      if (acceptBit == 'accept') {
        // Preference.get('rideStarted') ? ToastAndroid.show("One Ride is already in progress!", ToastAndroid.SHORT) :
        acceptRideOffer(info, responseJson.destination_addresses[0]);
      } else {
        rejectRideOffer(info, responseJson.destination_addresses[0]);
      }

      // console.log(responseJson.rows[0].elements[0].duration.text);
    } catch (error) {
      console.error(error);
    }
  };
  const getCurrentPosition = accepBit => {
    Geolocation.getCurrentPosition(info =>
      getEstimatedTimeOfArrival(info, accepBit),
    );
  };
  function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }

    return <App />;
  }
  return (
    <NavigationContainer ref={navigator}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="OnBoardingLogin" component={OnBoardingLogin} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeStack" component={HomeStack} />
        <Stack.Screen name="PersonalRideMap" component={PersonalRideMap} />
        <Stack.Screen name="WorkRide" component={WorkRide} />
      </Stack.Navigator>
      <CustomizedAlert
        btnVisibility={showBtn}
        visible={modalShow}
        onPressClose={() => setModalShow(false)}
        modalData={modalData}
        rejectOffer={() => getCurrentPosition('reject')}
        acceptOffer={() => {
          getCurrentPosition('accept');
        }}
      />
    </NavigationContainer>
  );
};

export default App;
