import React,{Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { PERMISSIONS, check, request }  from 'react-native-permissions'

export async function requestLocationPermission() 
{
  try {
    const granted = await request(
        Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          }),
      {
        'title': 'Khizar',
        'message': 'Khizar wants access to your location '
      }
    )
    if (granted == 'granted') {
      console.log("You can use the location")
    } else {
      console.log("location permission denied")
      // alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}