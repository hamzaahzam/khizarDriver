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
import { getTime, getDate } from '../common/Index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HistoryListItem extends Component {
  render() {
    return (
      <TouchableOpacity style={{marginBottom:10}} onPress={this.props.action}>
        <View style={styles.container}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
              <Avatar
                rounded
                size={80}
                source={require('../../assets/images/Avatar.png')}
              />
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', width: 100, height:50}}>
              <Text style={[styles.text,{color:'black',fontSize:20}]}>Completed</Text>
                <Text style={[styles.text, { marginTop: 20 }]}>2.5 KM</Text>
              </View>
            </View> 
        <View style={{marginBottom:10}}>
          <Text style={[styles.text,{color:'black'}]}>{this.props.rideDetails?.passenger.fullname}</Text>
          <View style={styles.detalView}>
            <Text style={styles.text}>Pickup</Text>
            <Text>{this.props.rideDetails?.pickLocation}</Text>
          </View>
          <View style={styles.detalView}>
            <Text style={styles.text}>Drop Off</Text>
            <Text>{this.props.rideDetails?.dropLocation}</Text>
          </View>
        </View>
      </View>
      </TouchableOpacity >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
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
  }
});
