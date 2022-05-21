import React, {useEffect} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions,useNavigation} from '@react-navigation/native';

//Images
import Images from '../../../assets/images';

const Splash = ({navigation}) => {
  useEffect(() => {
    const timer = navigateToStack()
    return () => clearTimeout(timer);
  }, []);
  const navigateToStack=async ()=>{
    let apiToken = await AsyncStorage.getItem('token');
    setTimeout(() => {
      if(apiToken){
      navigation.dispatch(StackActions.replace('HomeStack'))
      return true;
      } else {
        navigation.dispatch(StackActions.replace('OnBoarding'))
        return true;
      }
  }, 3000);
  }
  return (
    <View style={styles.container}>
        <Image style={styles.logo} source={Images.khizarLogo}/>
        <Image resizeMode="stretch" style={styles.buildings} source={Images.splashBuildings}/>
        <Image resizeMode="stretch" style={styles.car} source={Images.splashCar}/>
    </View>
  );
};
export default Splash;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#fff"
  },
  logo:{
      width:"100%",
      height:300,
      resizeMode:"contain",
      zIndex:999
  },
  buildings:{
    width:"100%",
    height:450,
    position:"absolute",
    bottom:0,
  },
  car:{
    width:"100%",
    height:100,
    position:"absolute",
    bottom:0,
  }
});
