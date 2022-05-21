import React,{Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Menu =()=>{
  return (
    <View style={styles.container}>
      <Text>Welcome To Menu</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Menu;