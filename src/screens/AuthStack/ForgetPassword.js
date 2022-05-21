import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import GradientButton from '../../common/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import {sendOTPCall} from '../../service/Api';
import {
  forgetError,
  forgetResponse,
  forgetRequest,
} from '../redux/actions/forgetActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StackActions, useNavigation} from '@react-navigation/native';

//Images
import Images from '../../../assets/images';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const ForgetPassword = ({navigation}) => {
  const [phoneNumErrorMsg, setPhoneNumErrorMsg] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneRegix, setPhoneRegix] = useState('');

  const validatePhoneNum = () => {
    if (phoneNumber == '') {
      alert('Please enter your phone number!');
    } else if (phoneNumber.length < 10) {
      alert('Phone number incomplete!');
    } else {
      sendOTPServiceCall();
    }
  };
  const sendOTPServiceCall = () => {
    let countryCode = '+92'; //"+92"+phoneNumber
    const data = {
      phone: countryCode + phoneNumber,
    };
    sendOTPCall(data)
      .then(response => {
        if (response.status === 1) {
          console.log('response', response.data);
          navigation.navigate('Verification', {screenName: 'forget'});
        } else {
          console.log('response error', response.status);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
    // }
    // else{
    //     alert("Please Enter Phone Number")
    // }
    //   }
  };
  mobileNumberValidate = text => {
    const reg = /^[0-9]{10}$/; ////^0|08[0-9]{9,}$/;///^[0]?[789]\d{9}$/;
    setPhoneRegix(reg);
    if (reg.test(text) === false) {
      setPhoneNumErrorMsg('Invalid phone number');
      setPhoneNumber(text);
    } else {
      setPhoneNumErrorMsg('');
      setPhoneNumber(text);
    }
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
      <Text
        style={{
          marginTop: 110,
          color: '#303030',
          fontSize: 14,
          marginLeft: 20,
        }}>
        You have a problem?!
      </Text>
      <Text
        style={{
          marginTop: 10,
          color: '#303030',
          fontSize: 24,
          marginLeft: 20,
          fontWeight: 'bold',
        }}>
        Don’t worry!
      </Text>
      {/* <Text
          style={{
            color: 'white',
            fontSize: 15,
            width: '90%',
            textAlign: 'center',
          }}>
          You will receive a code to create a new password via sms.
        </Text> */}

      <View style={styles.container}>
        <View style={styles.textFieldCont}>
          {/* <Text
              style={{
                marginBottom: 5,
                fontWeight: 'bold',
                color: 'white',
                fontSize: 20,
              }}>
              Phone Number
            </Text> */}
          <View style={styles.passwordContainer}>
            <Text>+92</Text>
            <TextInput
              style={[styles.input, {width: '88%'}]}
              value={phoneNumber}
              keyboardType="numeric"
              onChangeText={text => mobileNumberValidate(text)}
              placeholderTextColor={"#424242"}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text
              style={{
                marginVertical: 40,
                color: '#303030',
                fontSize: 14,
              }}>
              No problem?<Text style={{fontWeight: 'bold'}}>Sign In</Text>
            </Text>
          </TouchableOpacity>
          {phoneNumErrorMsg != '' && (
            <Text style={{color: 'red', fontSize: 16, textAlign: 'right'}}>
              {phoneNumErrorMsg}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => validatePhoneNum()}
          style={styles.presseableView}>
          <Text style={styles.presseableText}>Continue</Text>
          <AntDesign name={'arrowright'} size={24} color={'#ffffff'} />
        </TouchableOpacity>
      </View>
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

const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    flex: 1,
  },
  bottomView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute', //Here is the trick
    top: height - 140, //Here is the trick
  },
  textFieldCont: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  inputStyle: {
    flex: 1,
  },
  input: {
    // flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    width: '100%',
    borderRadius: 15,
    height: 50,
  },
  button: {
    backgroundColor: '#38ef7d',
    borderRadius: 10,
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: '#424242',
    width: '100%',
    borderRadius: 15,
    flexDirection: 'row',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderColor: '#000',
    backgroundColor: 'white',
    borderRadius: 15,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 5,
    paddingHorizontal: 20,
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
    letterSpacing: 10,
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
export default ForgetPassword;
