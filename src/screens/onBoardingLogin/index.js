import React, {useEffect} from 'react';
import {View, Image, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Images
import Images from '../../../assets/images';

const OnBoardingLogin = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // navigation.dispatch(StackActions.replace('OnBoarding'))
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
        <Text style={styles.helloText}>
        Hello, nice to meet you!
        </Text>
        <Text style={styles.experienceText}>
            Get a new experience
        </Text>
      <Image style={styles.logo} source={Images.khizarLogo} />
      <Image
        resizeMode="stretch"
        style={styles.buildings}
        source={Images.splashBuildings}
      />
      <TouchableOpacity
          onPress={() => navigation.navigate('AuthStack')}
          style={styles.presseableView}>
          <Text style={styles.presseableText}>Login with Phone</Text>
          <AntDesign
            name={'arrowright'}
            size={24}
            color={'#ffffff'}
          />
        </TouchableOpacity>
    </View>
  );
};
export default OnBoardingLogin;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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
    position: 'absolute',
    bottom: 0,
  },
  car: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  helloText:{
      fontSize:14,
      lineHeight:21,
      color:"#30303090",
      marginTop:55,
      marginLeft:20
  },
  experienceText:{
      fontWeight:"bold",
      fontSize:24,
      color:"#303030",
      marginTop:20,
      marginBottom:80,
      marginLeft:20
  },
  presseableView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#58BE3F',
   alignItems: 'center',
    height: 55,
    borderRadius: 10,
    position:"absolute",
    bottom:100,
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:30

  },
  presseableText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  }
});
