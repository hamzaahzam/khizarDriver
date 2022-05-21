import React,{Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class RideListItem extends Component{
  render(){
  return (
    <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.6} style={{ borderRadius:10,width:'100%',height:'100%', alignItems:'center', justifyContent:'center'}}>
        <View style={{height:'100%', width:'100%',flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
        <Image source={require('../../assets/images/carView.png')} style={{ height: 30, width: 85, marginTop: 20 }} /> 
<Text>Standard</Text>
<Text style={{fontSize:10, fontWeight:'bold'}}>Rs<Text style={{fontSize:15, fontWeight:'bold'}}> 300</Text></Text>
<Text style={{backgroundColor:'#38ef7d', borderRadius:10, width:'50%', textAlign:'center', color:'white', fontWeight:'bold'}}>3 min</Text>

        {/* <View style={{height:50,backgroundColor:'green' ,width:'',alignItems:'center', justifyContent:'center' ,borderRadius:15, marginBottom:10}}>
    <Image source={require('../../assets/images/sideViewCar.jpg')} style={{ height: 20, width: 50, marginTop: 20 }} /> 

        </View>
        <View style={{height:50,backgroundColor:'green' ,width:30,alignItems:'center', justifyContent:'center' ,borderRadius:15, marginBottom:10}}>
        <Image source={require('../../assets/images/sideViewCar.jpg')} style={{ height: 20, width: 50, marginTop: 20 }} />

        </View> */}
        </View>
      </TouchableOpacity>
    </View>
  )
      }
}

const styles = StyleSheet.create({
  container: {
    // height:140,
    width:100,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection:'column',
    borderRadius:10,
    borderWidth:1,
    borderColor:'#f5f5f5',
    margin:10,
    elevation:5
  },
});

