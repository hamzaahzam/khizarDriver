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
  Platform,
  Dimensions,
  ImageBackground,
} from 'react-native';
import GradientButton from '../../common/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {requestLogin} from '../../service/Api';
import Loader from '../../service/Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Images
import Images from '../../../assets/images';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//changes
const SignIn = ({navigation, route}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumErrorMsg, setPhoneNumErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [phoneRegix, setPhoneRegix] = useState('');
  const screenName = route.params;

  const showHidePassword = () => {
    console.log('Called on Icon Tap');
    setShowPassword(!showPassword);
  };

  const mobileNumberValidate = text => {
    const reg = /^[0-9]{10}$/; ////^0|08[0-9]{9,}$/;///^[0]?[789]\d{9}$/;
    setPhoneRegix(reg);
    if (reg.test(text) === false) {
      setShowCheck(false);
      setPhoneNumErrorMsg('Invalid phone number');
      setPhoneNumber(text);
    } else {
      setPhoneNumErrorMsg('');
      setPhoneNumber(text);
      setShowCheck(true);
    }
  };

  const loginApiCall = () => {
    if (screenName == 'reset') {
      navigation.navigate('Home');
    } else {
      setLoading(true);
      let countryCode = '03349081615';
      const data = {
        phone: `0${phoneNumber}`,
        password: password,
      };
      console.log('API Data', data);

      requestLogin(data)
        .then(response => {
          if (response.status === 1) {
            setLoading(false);
            navigation.navigate('Verification', {screenName: 'SignIn',phone:`0${phoneNumber}`});
          } else {
            setLoading(false);
            alert('Invalid phone number and password');
            console.log('response error', response.status);
          }
        })
        .catch(error => {
          setLoading(false);
          alert('Invalid phone number and password');
          console.log('error', error);
        });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffff',
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%'}}
        contentContainerStyle={{alignItems: 'center'}}>
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
          <Text
            style={[styles.welcomeText, {marginLeft: 54, color: '#17508E'}]}>
            KHIZAR<Text style={{fontSize: 10, color: '#fff'}}>FLEET</Text>
          </Text>
        </ImageBackground>
        <Text
          style={{
            marginTop: 85,
            fontWeight: 'bold',
            color: '#303030',
            fontSize: 25,
            alignSelf: 'flex-start',
            marginLeft: 20,
          }}>
          Welcome back!
        </Text>

        <View style={styles.container}>
          <View style={styles.textFieldCont}>
            <Text
              style={{
                marginBottom: 5,
                color: '#797979',
                fontSize: 12,
              }}>
              Phone Number
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {borderColor: !showCheck ? '#D3DFEF60' : '#58BE3F'},
              ]}>
              <Text
                style={{
                  width: '10%',
                  textAlign: 'center',
                }}>
                +92
              </Text>
              <TextInput
                style={[styles.input, {width: '88%'}]}
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={text => mobileNumberValidate(text)}
                placeholderTextColor={"#424242"}
              />
              {showCheck && (
                <View style={styles.roundedTick}>
                  <AntDesign name={'check'} size={16} color={'#ffffff'} />
                </View>
              )}
            </View>
            {phoneNumErrorMsg != '' && (
              <Text style={{color: 'red', fontSize: 16, textAlign: 'right'}}>
                {phoneNumErrorMsg}
              </Text>
            )}
          </View>
          <View style={styles.textFieldCont}>
            {/* <Text
              style={{
                marginBottom: 5,
                color: '#797979',
                fontSize: 12,
              }}>
              Password
            </Text> */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {width: '90%'}]}
                value={password}
                keyboardType="numeric"
                secureTextEntry={showPassword}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={"#424242"}
              />
              <Icon
                name={showPassword == true ? 'eye-off-outline' : 'eye-outline'}
                color="#000"
                size={20}
                style={{marginRight: 15}}
                onPress={() => showHidePassword()}
              />
            </View>
            <TouchableOpacity
              style={{marginTop: 30}}
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={{fontSize: 12, color: '#30303090'}}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          {loading == true ? (
            <Loader />
          ) : (
            <TouchableOpacity
              onPress={() => loginApiCall()}
              style={styles.presseableView}>
              <Text style={styles.presseableText}>Login</Text>
              <AntDesign name={'arrowright'} size={24} color={'#ffffff'} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
      <Image
        style={{
          width: windowWidth,
          height: windowHeight / 2,
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
    height: 310,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  textFieldCont: {
    // alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '90%',
    margin: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    // backgroundColor: 'white',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 2,
    borderColor: '#D3DFEF60',
  },
  inputStyle: {
    flex: 1,
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    // backgroundColor: '#fff',
    color: '#24272B',
    width: '100%',
    borderRadius: 15,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#38ef7d',
    borderRadius: 10,
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
  roundedTick: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#58BE3F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presseableView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#58BE3F',
    alignItems: 'center',
    height: 55,
    borderRadius: 10,
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

export default SignIn;
