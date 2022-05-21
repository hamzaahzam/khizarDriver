import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  ToastAndroid,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import GradientButton from '../common/GradientButton';
import Prefrence from 'react-native-preference';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CustomAlert = props => {
  return (
    <Modal transparent visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.closeButtonView}>
            <TouchableOpacity
              onPress={props.onPressClose}
              style={styles.closeButton}>
              <Entypo name={'cross'} color={'#3E4958'} size={25} />
            </TouchableOpacity>
          </View>
          <Image
            style={styles.carImage}
            source={require('../../assets/images/car_top.png')}
          />
          <Text style={styles.bodyText}>{props.modalData}</Text>
          {props.btnVisibility && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <GradientButton
                height={55}
                width={'40%'}
                title={'Accept'}
                margin={5}
                action={props.acceptOffer}
              />
              <GradientButton
                height={55}
                width={'40%'}
                title={'Reject'}
                margin={5}
                action={props.rejectOffer}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
export default CustomAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: windowHeight / 1.6,
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonView: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  carImage: {
    height: windowHeight / 3,
    width: windowWidth / 1.5,
    resizeMode: 'contain',
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});
