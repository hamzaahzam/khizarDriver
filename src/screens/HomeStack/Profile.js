import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileDetailAPI } from '../../service/Api';
import { StackActions, useNavigation, useIsFocused } from '@react-navigation/native';

//Images
import Images from '../../../assets/images';


const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);

  const focused = useIsFocused()
  useEffect(() => {
    if (focused) {
      getProfileDetail();
    }
  }, [focused])
  const getProfileDetail = async () => {
    // let userData = await AsyncStorage.getItem('user');
    // console.log("userData",userData)
    getProfileDetailAPI()
      .then(async response => {
        setProfileData(response.data)
        console.log("Response", response.data)
      })
      .catch(error => {
        console.error('error', error);
      })
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.logo} source={profileData?.user?.image ? { uri: profileData.user.image[0] } : Images.Avatar} />
          <TouchableOpacity
            // onPress={openPicker}
            style={styles.cameraIcon}>
            <Image style={styles.cameraPosition} source={require('../../../assets/images/camera.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.driverText}>Driver</Text>
        <Text style={styles.driverName}>{`${profileData?.user?.fullname ? profileData.user.fullname : ''}`}</Text>
        <View style={styles.earningBar}>
          <View>
            <Text style={styles.titlesText}>{`Total trips:`}</Text>
            <Text style={styles.titleDetailText}>{`${profileData?.noOftrips ? profileData.noOftrips : '0'}`}</Text>
          </View>
          <View>
            <Text style={styles.titlesText}>{`Price:`}</Text>
            <Text style={styles.titleDetailText}>{`Rs ${profileData?.totalAmount ? profileData.totalAmount : '0'}`}</Text>
          </View>
          <View>
            <Text style={styles.titlesText}>{`Years:`}</Text>
            <Text style={styles.titleDetailText}>{`2.5`}</Text>
          </View>
        </View>
        <View style={{ width: "100%", padding: 20, borderBottomWidth: 1, borderColor: "#F6F6F6" }}>
          <View style={styles.doubleText}>
            <Text>{`Total trips:`}</Text>
            <Text>{`${profileData?.noOftrips ? profileData.noOftrips : '0'}`}</Text>
          </View>
          <View style={styles.doubleText}>
            <Text>{`Price:`}</Text>
            <Text>{`Rs ${profileData?.totalAmount ? profileData.totalAmount : '0'}`}</Text>
          </View>
          <View style={styles.doubleText}>
            <Text>{`Years:`}</Text>
            <Text>{`2.5`}</Text>
          </View>
        </View>
        {/* <TouchableOpacity onPress={logOut} style={styles.pressableButton}>
            <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};
export default Profile;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#ffffff"
  },
  logo: {
    width: 145,
    height: 145,
    marginTop: 200,
    borderRadius: 75
  },
  buildings: {
    width: "100%",
    height: 450,
    position: "absolute",
    bottom: 0,
  },
  car: {
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: 0,
  },
  driverText: {
    marginTop: 25,
    color: "#D6D6D6"
  },
  driverName: {
    fontSize: 23,
    fontWeight: "bold",
    lineHeight: 35
  },
  line: {
    height: 1,
    backgroundColor: "#F6F6F6",
    width: "100%",
    marginTop: 65
  },
  earningBar: {
    height: 110,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F6F6F6",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 65
  },
  titlesText: {
    color: "#D6D6D6",
    fontSize: 14
  },
  titleDetailText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#303030",
    marginTop: 5
  },
  doubleText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15
  },
  pressableButton: {
    height: 45,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#58BE3F",
    borderRadius: 25,
    marginTop: 33,
    elevation: 5,
    marginBottom: 40
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff"
  },
  cameraIcon: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: 22,
    right: 0,
  },
  cameraPosition: {
    width: 45,
    height: 45,

  },
});
