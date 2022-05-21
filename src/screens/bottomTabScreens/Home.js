import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Dashboard from '../../screens/HomeStack/Dashboard/Dashboard'

const Home =()=> {

    return (
   
      <Dashboard />
    )
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Home;