import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class GradientButton extends Component {

    showModalOnParentView=()=>{
        this.props.action
    }
    render() {
        return (
            <LinearGradient
                colors={['#38ef7d', '#38ef7d']}
                style={{height:this.props.height, width:this.props.width, borderRadius: 15, margin:8,
                elevation: 10,alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity style={styles.button} onPress={this.props.action}>
                    <Text style={{color: 'white', textAlign:'center', fontSize:20, fontWeight:'bold'}}>{this.props.title}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 300,
        width: '70%',
        borderColor: '#38ef7d',
        borderWidth: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10
    },
    button: {
        borderRadius: 10,
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
});