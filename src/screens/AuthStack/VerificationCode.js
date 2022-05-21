import React, {Component, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import LinearGradient from 'react-native-linear-gradient';
import {verifyOTPCall, verifyResendOTP} from '../../service/Api';
import Loader from '../../service/Loader';
import GradientButton from '../../common/GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveToken} from '../../common/Index';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StackActions, useNavigation} from '@react-navigation/native';
//Images
import Images from '../../../assets/images';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VerificationCode = ({navigation, route}) => {
  const [disableResendBtn, setResendBtnDisable] = useState(true);
  const [timerCount, setTimer] = useState(60);
  const {screenName, phone} = route.params;
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState('');
  const phoneNumber = 'xxxxxx'; //useSelector(state => state.signInReducer.phone)
  useEffect(() => {
    console.log('Phone got from Reducer', phoneNumber, phone);
    timerFunc();
  }, [navigation]);
  const timerFunc = () => {
    setResendBtnDisable(true);
    setTimer(60);
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete

    return () => {
      clearInterval(interval);
    };
  };

  const verifyOTPCode = async (code, type) => {
    setLoading(true);
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken on Verification call', fcmToken);
    if (type == 'resend') {
      timerFunc();
    }
    var data = {};
    if (type == 'verify') {
      var data = {
        phone: phone,
        otp: code,
        deviceToken: fcmToken,
      };
    } else {
      data = {
        phone: phone,
      };
    }

    console.log('service call data', data);
    verifyResendOTP(data, type)
      .then(async response => {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        // console.log("Response",response)
        if (response.status === 1) {
          setLoading(false);
          if (type == 'verify') {
            saveToken(response.data.token);
          }
          if (type == 'verify') {
            if (screenName == 'forget') {
              navigation.navigate('ResetPassword');
            } else {
              saveToken(response.data.token);
              navigation.reset({index: 0, routes: [{name: 'HomeStack'}]});
            }
          }
        } else {
          alert('Invalid OTP');
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        alert('Invalid OTP');
        console.log('error', error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
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
            marginTop: 50,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name={'arrowleft'} size={24} color={'#ffffff'} />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>WELCOME TO</Text>
        </View>
        <Text style={[styles.welcomeText, {marginLeft: 54, color: '#17508E'}]}>
          KHIZAR<Text style={{fontSize: 10, color: '#fff'}}>FLEET</Text>
        </Text>
      </ImageBackground>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginLeft: 20,
            marginRight: 20,
          }}>
          <Text style={{fontSize: 14, marginTop: 35, color: '#303030'}}>
            Phone Verification
          </Text>
          <Text
            style={{
              fontSize: 24,
              color: '#303030',
              fontWeight: 'bold',
              marginTop: 20,
            }}>
            Enter your OTP code
          </Text>
          <Text style={{fontSize: 14, color: '#303030'}}>
            Enter the 4-digit code sent to you at
          </Text>
          <Text style={{fontSize: 14, color: '#303030'}}>
            {phone}{' '}
            <Text style={{color: '#58BE3F'}}>
              did you enter the correct number?
            </Text>
          </Text>
          <OTPInputView
            style={{width: '90%', height: 130}}
            editable={true}
            pinCount={4}
            //  clearInputs={true}
            autoFocusOnLoad
            keyboardType="number-pad"
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlgihtStyle={styles.underlineStyleHighLighted}
            placeholderTextColor="black"
            onCodeFilled={code => {
              // navigation.avigate('ResetPassword')
              // verifyOTPCode(code, 'verify')
              setOTP(code);
              // navigation.navigate('Home')
            }}
          />
          {/* {loading == true ? (
            <ActivityIndicator size="large" color="gray" />
          ) : (
            <TouchableOpacity>

            </TouchableOpacity>
          )} */}
          {loading ? (
            <View style={styles.circleForward}>
            <Loader />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => verifyOTPCode(otp, 'verify')}
              style={styles.circleForward}>
              <AntDesign name={'arrowright'} size={28} color={'#BDBDBD'} />
            </TouchableOpacity>
          )}

          {timerCount > 0 ? (
            <Text style={{fontSize: 15, marginTop: 20}}>
              {`Resend Code in `}
              <Text style={{color: '#58BE3F'}}>{`${timerCount} seconds`}</Text>
            </Text>
          ) : null}
          {timerCount < 0 && (
            <TouchableOpacity
              style={{marginTop: 20}}
              disabled={timerCount < 1 ? false : true}
              onPress={() => verifyOTPCode('', 'verify')}>
              <Text style={{fontSize: 15, color: '#58BE3F'}}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  underlineStyleBase: {
    width: 80,
    height: 60,
    borderWidth: 0,
    // borderBottomWidth: 1,
    color: '#BDBDBD',
    fontSize: 25,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 2,
  },

  underlineStyleHighLighted: {
    borderColor: 'white',
  },
  roundedHeader: {
    width: windowWidth,
    height: 200,
  },
  welcomeText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
    letterSpacing: 10,
  },
  circleForward: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
    right: 40,
    elevation: 5,
  },
});

export default VerificationCode;
