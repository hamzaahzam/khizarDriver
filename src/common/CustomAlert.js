import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import GradientButton from './GradientButton';

export default class CustomAlert extends Component {
    render() {
        //Props to pass 
        //show cross button 
        //button count 
        //alert msg
        return (
            <LinearGradient
                // Background Linear Gradient
                colors={['#38ef7d', '#11998e']}
                style={{
                    flex: 1, alignItems: 'center', justifyContent: 'center'
                }}
            >
                <View style={styles.container}>

                    <View style={{ borderRadius: 10, height: 40, width: 40, backgroundColor: '#ffff', elevation: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }}>
                        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
                        <Feather name='x' size={25} color={'black'}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center', alignSelf:'center', justifyContent:'space-between', width:'70%'}}>
                        <Image source={require('../../assets/images/car_top.png')} style={{ height: 120, width: 60, marginTop: 20, alignSelf: 'center' }} />
                        {/* //here display alert msg */}
                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 18, color: 'black', textAlign: 'center', marginTop:10}} numberOfLines={2} ellipsizeMode='tail'>{this.props.route.params.alertMsg}</Text>
                    </View>
                    <GradientButton height={60} title={this.props.route.params.titleButton} width={'100%'} style={{alignSelf:'center'}}/>
                    {/* <View style={{ height: '20%', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <GradientButton title={"I'm Coming"} width={'45%'} height={60} action={() => this.props.navigation.navigate('CustomAlert')}></GradientButton>
                        <GradientButton title={'Call'} width={'45%'} height={60} action={() => this.props.navigation.navigate('Schedule')}></GradientButton>

                    </View> */}
                </View>
            </LinearGradient>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 400,
        width: '85%',
        borderColor: '#38ef7d',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderRadius: 25,
        elevation: 10,
        padding: 10
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
});