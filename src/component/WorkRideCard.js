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
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { Avatar } from 'react-native-elements';
import GradientButton from '../common/GradientButton'
import { getTime, getDate } from '../common/Index';


export default class WorkRideCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerButton: 0,

    };
  }
 
  render() {
    return (
      <Pressable
      onPress={this.props.action}
      style={{ marginBottom: 10, width: "100%" }}>
        <View style={[styles.container,{borderColor:this.props.rideID == this.props.rideDetailObject._id ? '#58BE3F' :'grey'},{borderWidth:this.props.rideID == this.props.rideDetailObject._id ? 2 :1}]}>
          {this.props.displayCustomerInfo ?

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Avatar
                rounded
                size={80}
                source={{
                  uri: 'https://abdulrahman.fleeti.com/save_file/uploads/provider/user/5bf637c8_60262ff8dbde39.10627959.jpg',
                }}
              />
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'green', width: 100 }}>
                <GradientButton height={40} title={'Call'} width={'100%'} style={{ alignSelf: 'flex-end' }} />
                <Text style={[styles.text, { marginTop: 20 }]}>2.5 KM</Text>
              </View>
            </View>
            :
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Avatar
                rounded
                size={60}
                source={{
                  // uri: 'http://162.0.236.163:8000/uploads/driver/thumbnails/1629788956336-image.jpeg',
                  uri: this.props.rideDetails?.passenger.image ==null ? 'https://www.clipartmax.com/png/middle/171-1717870_stockvader-predicted-cron-for-may-user-profile-icon-png.png' : 'http://162.0.236.163:8000/uploads/driver/thumbnails/1629788956336-image.jpeg'
                }}
              />
              <Text style={[styles.text, { marginTop: 20 }]}>{this.props.rideDetails?.distance}</Text>
            </View>
          }
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.text, { color: 'black' }]}>{this.props.rideDetails?.passenger.fullname}</Text>
            <View style={styles.detalView}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ width: "60%" }}>
                  <Text style={styles.text}>Pickup</Text>
                  <Text>{this.props.rideDetails?.passenger.location}</Text>
                  <Text  style={styles.text}>Time of pickup</Text>
                  <Text>{Moment(this.props.rideDetails?.pickDateTime).format('hh:mm a')}</Text>
                </View>
                <View>
                  <Text style={styles.text}>Date</Text>
                  <Text style={{ textAlign: "left" }}>{Moment(this.props.rideDetails?.pickDateTime).format('YYYY-MM-DD')}</Text>
                  <Text style={styles.text}>Estimated Time</Text>
                  <Text style={{ textAlign: "left" }}>{this.props.rideDetails?.distanceDuration}</Text>
                </View>
              </View>

            </View>
            <View style={styles.detalView}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.text}>Drop Off</Text>
                <Text style={styles.text}>{this.props?.rideDetails?.rideShare ? "Multiple Passenger" : "Single Passenger"}</Text>
              </View>
              <Text>{this.props.rideDetails?.dropLocation}</Text>
            </View>

            {/* Offer Buttons */}
            {this.props.button ? <View style={styles.buttonView}>
              <Pressable onPress={this.props.onAccept}>
                <View style={styles.button}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>Accept</Text>
                </View>

              </Pressable>
              <Pressable onPress={this.props.onReject}>
                <View style={styles.button}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>Reject</Text>
                </View>

              </Pressable>

            </View>
              :
              <View></View>
            }
          </View>
        </View>
      </Pressable >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold'
  },
  detalView: {
    marginTop: 10
  },
  buttonView: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    width: 120,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 4,
    borderWidth: 1.5,
    borderColor:'#58BE3F',
    backgroundColor: '#ffffff'
  }
});
