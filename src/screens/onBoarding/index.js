import React, {useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StackActions, useNavigation} from '@react-navigation/native';

//Images
import Images from '../../../assets/images';

const OnBoarding = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Images.khizarLogo} />
      <ImageBackground
        resizeMode="stretch"
        style={styles.buildings}
        source={Images.onBoarding}>
        <Text style={styles.introText}>WELCOME TO</Text>
        <Text style={[styles.introText, {marginTop: 0, color: '#17508E'}]}>
          KHIZAR
        </Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.replace('OnBoardingLogin'))}
          style={styles.presseableView}>
          <Text style={styles.presseableText}>GET STARTED</Text>
          <AntDesign
            name={'arrowright'}
            size={24}
            color={'#ffffff'}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
export default OnBoarding;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor:"#fff"
  },
  logo: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    zIndex: 999,
  },
  buildings: {
    width: '100%',
    height: 450,
    bottom: 0,
  },
  introText: {
    lineHeight: 45,
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    color: '#fff',
    marginTop: 220,
    letterSpacing: 10,
  },
  presseableView: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 35,
    backgroundColor: '#46494B',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 10,
  },
  presseableText: {
    fontSize: 26,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
  },
});
