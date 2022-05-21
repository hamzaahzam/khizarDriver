import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Avatar, Badge } from 'react-native-elements';
import GradientButton from '../common/GradientButton'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class RideSummaryAndDetail extends Component {
  callNumber = (phone) => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    const { rideInfo } = this.props;
    return (
      // <TouchableOpacity style={{height:300, width:'90%',alignSelf:"center"}} onPress={this.props.action}>
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Avatar
            rounded
            size={80}
            source={require('../../assets/images/Avatar.png')}
          />
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: 100 }}>
            <GradientButton action={() => this.callNumber(rideInfo?.passenger?.phone)} height={40} title={'Call'} width={'100%'} style={{ alignSelf: 'flex-end' }} />
            <Text style={[styles.text, { marginTop: 20 }]}>{`${this.props.distance} KM`}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.text, { color: 'black' }]}>{rideInfo?.passenger?.fullname}</Text>
          <View style={styles.detalView}>
            <Text style={styles.text}>Pickup</Text>
            <Text>{rideInfo?.passenger.location}</Text>
          </View>
          <View style={styles.detalView}>
            <Text style={styles.text}>Drop Off</Text>
            <Text>{rideInfo?.dropLocation}</Text>
          </View>
          {!this.props.rideBtn &&
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
              <GradientButton action={this.props.actionforMap} height={40} title={'Map'} width={'40%'} />
              <GradientButton action={this.props.MultiRide} height={40} title={rideInfo?.rideStatus == 'create' ? 'Start' : rideInfo?.rideStatus == 'start' ? 'Arrived' : rideInfo?.rideStatus == 'arrived' ? 'Pick' : rideInfo?.rideStatus == 'pick' ? 'Drop' : rideInfo?.rideStatus == 'drop' && 'End'} width={'40%'} />
            </View>
          }
        </View>


        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom:10 }}>
                <GradientButton height={50} title={'Use GoogleMap'} width={'45%'} style={{ alignSelf: 'flex-end' }} action={this.props.actionforMap}/>
                <GradientButton height={50} title={this.props.statusBtnText} width={'45%'} style={{ alignSelf: 'center' }} action={this.props.actionOnArrived}/>
              </View> */}

      </View>
      // </TouchableOpacity >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 2,
    height: 350,
    alignSelf: "center",
    marginTop: 20
  },
  text: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold'
  },
  detalView: {
    marginTop: 10
  }
});
