import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  View
} from 'react-native';

export default DrawerItem = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.drawerItemContainer, props.containerStyle]}
      onPress={() => {
        if (props.onPress && typeof props.onPress == 'function')
          props.onPress();
      }}>
        <View>
      {/* <Image style={styles.image} source={props.icon} /> */}
      </View>
      <Text style={[{fontSize:24,color: "#303030",fontWeight:"bold"}, props.titleStyle]}>
        {props.title}
      </Text>
      {props.notifications&&<View style={styles.notificationView}>
        <Text style={{fontSize:12,fontWeight:"bold",color:"#fff"}}>
          {props.notifications}
        </Text>
      </View>}
      {props.loading && (
        <ActivityIndicator
          animating={props.loading}
          size={'small'}
          color={"red"}
          style={[{marginLeft: 5}]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  drawerItemContainer: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 20,
    // tintColor: 'pink',
  },
  notificationView:{
    width:20,
    height:20,
    borderRadius:10,
    marginLeft:10,
    backgroundColor:"#58BE3F",
    justifyContent:"center",
    alignItems:"center"
  }
});
