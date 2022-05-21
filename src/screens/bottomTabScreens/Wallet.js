import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import GradientButton from '../../common/GradientButton';
import Images from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../../service/Loader';
import {getWalletDetailAPI} from '../../service/Api';
import {FlatList} from 'react-native';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const Wallet = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [walletDetails, setWalletDetails] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getWalletDetails();
    }
  }, [isFocused]);
  const getWalletDetails = async () => {
    setLoading(true);
    getWalletDetailAPI()
      .then(response => {
        setLoading(false);
        if (response.status === 1) {
          let tempArray = response.data;
          console.log('Status is 1', JSON.stringify(response));
          setWalletDetails([...tempArray]);
        } else {
          alert(response.status);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };
  const renderRideDetails = ({item, index}) => {
    return (
      <View style={styles.rideList}>
        <View>
          <Image
            style={styles.passengerAvatar}
            source={{uri: item.passenger.image}}
          />
          <Text style={{textAlign: 'center', marginTop: 10}}>
            {item.passenger.fullname.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={{textAlign: 'center',color:"black"}}>
            Ride Fare:{' '}
            <Text style={{color: '#58BE3F'}}>{`${item.fareAmount}`}</Text>
          </Text>
          <Text style={{textAlign: 'center',color:"black",marginTop:10}}>Phone Number</Text>
            <Text style={{textAlign: 'center',color:"#58BE3F",marginTop:5}}>{item.passenger.phone}</Text>
        </View>
      </View>
    );
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 20,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name={'arrowleft'} size={24} color={'#ffffff'} />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Wallets</Text>
          <Text style={styles.welcomeText}> </Text>
        </View>
        <View style={styles.creditBox}>
          <Text style={styles.totalBalance}>TOTAL BALANCE</Text>
          {loading ? (
            <Loader />
          ) : (
            <Text style={[styles.totalBalance, {fontSize: 32}]}>Rs2435.00</Text>
          )}
        </View>
      </ImageBackground>
      <View style={styles.container}>
        {/* <View style={{marginTop: 20}}>
            <Text style={{fontSize: 30, textAlign: 'center'}}>
              Available Credit
            </Text>
            <Text
              style={{fontSize: 35, fontWeight: 'bold', textAlign: 'center'}}>
              PKR 0
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View style={styles.textFieldCont}>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 20,
                  color: 'black',
                }}>
                Enter amount you want to add
              </Text>
              <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                value={''}
                keyboardType="numeric"
                onChangeText={text => console.log(text)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '90%',
                marginBottom: 10,
              }}>
              <Icon name={'checkbox-blank-outline'} size={30}></Icon>
              <Text style={{fontSize: 22, textAlign: 'center'}}>Use Card</Text>
            </View>
            <View
              style={{
                borderRadius: 10,
                elevation: 8,
                backgroundColor: '#FFFFFF',
                width: '90%',
                justifyContent: 'space-around',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: 'left',
                  marginLeft: 10,
                  marginTop: 10,
                }}>
                Card
              </Text>
              <View style={styles.cardDetailView}>
                <View style={styles.textFieldCont}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: 20,
                      marginLeft: 5,
                    }}>
                    Card Number
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={'3864276427834682'}
                  />
                </View>
                <View style={styles.textFieldCont}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: 20,
                      marginLeft: 5,
                    }}>
                    Card Holder Name
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="default"
                    value={'Khizar Fleet'}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <View style={[styles.textFieldCont, {width: '47%'}]}>
                    <Text
                      style={{
                        marginBottom: 5,
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 20,
                        marginLeft: 5,
                      }}>
                      Expiry Date
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={'12/20/2022'}
                    />
                  </View>
                  <View style={[styles.textFieldCont, {width: '47%'}]}>
                    <Text
                      style={{
                        marginBottom: 5,
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 20,
                        marginLeft: 5,
                      }}>
                      CVV
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={'0987'}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View> */}
        <View style={styles.bottomBox}>
          {/* <View style={styles.buttonsHolder}>
            <TouchableOpacity
              onPress={() => setButtonActive(false)}
              style={[
                styles.buttonAll,
                {backgroundColor: buttonActive ? '#F1F3F6' : '#58BE3F'},
              ]}>
              <Text style={{color: buttonActive ? '#58BE3F' : '#ffffff'}}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setButtonActive(true)}
              style={[
                styles.buttonRecent,
                {backgroundColor: !buttonActive ? '#F1F3F6' : '#58BE3F'},
              ]}>
              <Text style={{color: !buttonActive ? '#58BE3F' : '#ffffff'}}>
                Recent
              </Text>
            </TouchableOpacity>
          </View> */}
          <FlatList
            data={walletDetails}
            keyExtractor={item => item._id}
            renderItem={renderRideDetails}
          />
          {loading && <Loader />}
        </View>
      </View>
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
  creditBox: {
    position: 'absolute',
    height: 132,
    width: '90%',
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 5,
    alignSelf: 'center',
    bottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBalance: {
    fontSize: 14,
    color: '#58BE3F',
  },
  bottomBox: {
    height: height / 1.7,
    width: '90%',
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    // paddingHorizontal:20,
  },
  buttonsHolder: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
  },
  buttonAll: {
    width: 55,
    height: 32,
    backgroundColor: '#58BE3F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRecent: {
    width: 90,
    height: 32,
    backgroundColor: '#58BE3F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  passengerAvatar: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 30,
  },
  rideList: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#58BE3F',
  },
});
export default Wallet;
