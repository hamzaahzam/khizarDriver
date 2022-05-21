import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity,Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class DashboardItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.navigateTo}>
        {/* <TouchableOpacity
          activeOpacity={0.6}
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this.props.navigateTo}> */}
          <View
            style={{
              height: 80,
              width: 80,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
              backgroundColor: '#38ef7d',
              marginBottom: 10,
              borderWidth:1.5,
              backgroundColor:"#ffffff50",
              borderColor:"#ffffff"
            }}>
            {/* <Ionicons name={this.props.imageName} size={22} color={'white'} /> */}
            <Image style={{width:45,height:45}} source={this.props.imageName}/>
          </View>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
            {this.props.title}
          </Text>
        {/* </TouchableOpacity> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    // borderColor: '#38ef7d',
    // borderWidth: 2,
    backgroundColor: '#38ef7d',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    borderRadius: 16,
    elevation:5
  },
});
