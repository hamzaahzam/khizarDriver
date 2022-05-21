import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import Images from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import HistoryListItem from '../../component/HistoryListItem';
import {getCompletedRideList} from '../../service/Api';
import Loader from '../../service/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const History = ({navigation}) => {
  const [rideList, setRideList] = useState([]);
  const [loading, setLoading] = useState('true');

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      setLoading(true);
      getList();
    });
    return willFocusSubscription;
  }, [navigation]);
  const getList = () => {
    getCompletedRideList()
      .then(response => {
        if (response.status === 1) {
          console.log('Ride Data', response.data);
          setLoading(false);
          setRideList(response.data);
        } else {
          setLoading(false);
          alert(response.status);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };
  const renderItem = ({item}) => <HistoryListItem rideDetails={item} />;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ImageBackground
        resizeMode="stretch"
        style={styles.roundedHeader}
        source={Images.roundedHeader}>
        <View
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
          <Text style={styles.welcomeText}>Rides Completed</Text>
          <Text style={styles.welcomeText}> </Text>
        </View>
      </ImageBackground>
      {loading ? (
        <Loader />
      ) : (
        // <LinearGradient
        //   // Background Linear Gradient
        //   colors={['#38ef7d', '#11998e']}
        //   style={{ flex: 1 }}
        // >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            }}>
            {rideList.length == 0 ? (
              <Text style={{fontSize: 20, color: 'white'}}>
                Currently No Ride History
              </Text>
            ) : (
              <FlatList
                data={rideList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </View>
        // </LinearGradient>
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
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    // marginTop: StatusBar.currentHeight || 20,
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

export default History;
