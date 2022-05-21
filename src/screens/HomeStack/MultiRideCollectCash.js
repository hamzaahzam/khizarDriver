import React, {Component, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Images from '../../../assets/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import GradientButton from '../../common/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import {Rating} from 'react-native-ratings';
import {saveAmountInKhizarWallet} from '../../service/Api';
import Loader from '../../service/Loader';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const CollectCash = ({route}) => {
  const navigation = useNavigation();
  const [ratingModal, setRatingModal] = useState(false);
  const fareAmount = route.params.fareAmount;
  const rideDetails = route.params.rideDetail;

  const [loading, setLoading] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState('0');
  const [walletAmount, setWalletAmount] = useState('0');

  function ratingCompleted(rating) {
    console.log('Rating is: ' + rating);
  }

  useEffect(() => {
    console.log('Fare AMount on SCreen Load', fareAmount);
  }, []);
  const saveFareAmount = () => {
    setLoading(true);
    const folderID = rideDetails._id;
    const data = {
      passengerId: rideDetails?.passenger._id,
      fareAmount: fareAmount,
      collectAmount: collectedAmount,
      walletAmount: walletAmount,
    };
    saveAmountInKhizarWallet(folderID, data)
      .then(response => {
        setLoading(false);
        if (response.status === 1) {
          setRatingModal(true);
        } else {
          alert(response.status);
        }
      })
      .catch(error => {
        alert(error);
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <ImageBackground
        resizeMode="stretch"
        style={styles.roundedHeader}
        source={Images.roundedHeader}>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 50,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name={'arrowleft'} size={24} color={'#ffffff'} />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Ride List</Text>
          <Text style={styles.welcomeText}> </Text>
        </View> */}
      </ImageBackground>
      <Modal animationType="slide" transparent={true} visible={ratingModal}>
        <View style={styles.modalOverlay}>
          <View
            style={{
              backgroundColor: 'white',
              width: '90%',
              alignItems: 'center',
              padding: 20,
              borderRadius: 20,
              borderColor: '#38ef7d',
            }}>
            <Text style={{fontSize: 30}}>Rate User</Text>
            <Rating
              style={{marginBottom: 20}}
              startingValue={1}
              ratingCount={5}
              showRating={true}
              imageSize={30}
              fractions={1}
              type={'custom'}
              ratingTextColor={'black'}
              selectedColor={'#38ef7d'}
              ratingColor={'#38ef7d'}
              ratingBackgroundColor="#c8c7c8"
              starContainerStyle={{backgroundColor: 'green', width: 30}}
              // ratingImage={Icons.crossImg}
              onFinishRating={ratingCompleted}
            />

            <GradientButton
              height={50}
              title={'Rate'}
              width={'90%'}
              style={{alignSelf: 'flex-end'}}
              action={() => {
                setRatingModal(false);
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
              }}
            />
          </View>
        </View>
      </Modal>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View style={styles.textFieldCont}>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 5,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 26,
                  color: 'black',
                }}>
                Total Ride Fare
              </Text>
              <Text
                style={{textAlign: 'center', fontSize: 26, color: '#00000090'}}>
                {String(fareAmount)}
              </Text>
            </View>
            <View style={styles.textFieldCont}>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 20,
                  color: 'black',
                }}>
                Collected Amount
              </Text>
              <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                value={collectedAmount}
                keyboardType="numeric"
                placeholderTextColor={"#424242"}
                onSubmitEditing={() => {}}
                onChangeText={text => {
                  setCollectedAmount(text)
                  // console.log('Text After clear field', text);
                  // if (text != '') {
                  //   setCollectedAmount(text);
                  //   const amount = Number(fareAmount) - Number(text);
                  //   console.log('Fare Amount After Subtraction', fareAmount);

                  //   console.log('Collected Amount After Subtraction', text);

                  //   console.log('Wallet Amount After Subtraction', amount);
                  //   setWalletAmount(String(amount));
                  // } else {
                  //   setWalletAmount('0');
                  //   setCollectedAmount(text);
                  // }
                }}
              />
            </View>
            <View style={[styles.textFieldCont, {marginBottom: 20}]}>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 20,
                  color: 'black',
                }}>
                Add Amount to Khizar Wallet
              </Text>
              <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                value={walletAmount}
                keyboardType="numeric"
                // editable={false}
                placeholderTextColor={"#424242"}
                onChangeText={setWalletAmount}
              />
            </View>
            {loading ? (
              <Loader />
            ) : (
              <GradientButton
                height={50}
                title={'Add'}
                width={'90%'}
                style={{alignSelf: 'flex-end'}}
                action={() => saveFareAmount()}
              />
            )}
          </View>
        </View>
      )}
      <Image
        style={{
          width: width,
          height: height / 2,
          position: 'absolute',
          bottom: 0,
          zIndex: -9999,
          resizeMode: 'stretch',
        }}
        source={Images.splashBuildings}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  textFieldCont: {
    // alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '90%',
    margin: 10,
    borderColor: '#ffff',
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#F2F2F2',
    color: '#424242',
    width: '100%',
    borderRadius: 15,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedHeader: {
    width: width,
    height: 200,
  },
  welcomeText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
    letterSpacing: 1,
  },
});
export default CollectCash;
