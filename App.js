import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

import GenericDialog from './GenericDialog';
import InputPanel from './InputPanel';
import HotelsPanel from './HotelsPanel';
import DetailsPanel from './DetailsPanel';
import { submitRequest, pad } from './commons';
import styles from './styles';



const App = () => {

  const [
    step, setStep
  ] = useState(1);

  const [
    destination, setDestination
  ] = useState('');
  const [
    cities, setCities
  ] = useState(null);
  const [
    selectedCity, setSelectedCity
  ] = useState(/*{ label: 'Tolmezzo', value: 12531210 }*/null);
  const [
    checkIn, setCheckIn
  ] = useState(new Date(2021, 9, 9));
  const [
    checkOut, setCheckOut
  ] = useState(new Date(2021, 9, 16));
  const [
    guests1, setGuests1
  ] = useState(1);
  const [
    guests2, setGuests2
  ] = useState(0);
  const [
    guests3, setGuests3
  ] = useState(0);

  const [
    hotels, setHotels
  ] = useState([]);
  const [
    selectedHotel, setSelectedHotel
  ] = useState(null);

  const [
    hotelDetails, setHotelDetails
  ] = useState(null);
  const [
    sectionsVisibility, setSectionsVisibility
  ] = useState({});

  const [
    dataError, setDataError
] = useState('');

  const changeStep = (increment) => {
    if (step == 1 && increment == 1) {
      if (selectedCity == null) {
        setDataError('Choose a destination city first');
        return;
      }
      else {
        setHotels([]);
        searchHotels();
      }
    }
    if (step == 2 && increment == 1) {
      if (selectedCity == null) {
        setDataError('Choose an hotel first');
        return;
      }
      else {
        setHotelDetails(null);
        searchHotelDetails();
      }
    }
    setStep(step + increment);
  };

  const searchHotels = () => {
    submitRequest('properties/list?' + 'destinationId=' + selectedCity.value +
      '&checkIn=' + checkIn.getFullYear() + '-' + pad(checkIn.getMonth() + 1, 2) + '-' + pad(checkIn.getDay(), 2) +
      '&checkOut=' + checkOut.getFullYear() + '-' + pad(checkOut.getMonth() + 1, 2) + '-' + pad(checkOut.getDay(), 2) +
      '&adults1=' + guests1 +
      (guests2 > 0 ? '&adults2=' + guests2 : '') +
      (guests3 > 0 ? '&adults3=' + guests3 : '') +
      '&pageNumber=1&pageSize=25',
      (response) => setHotels(response.data.body.searchResults.results));
  };

  const searchHotelDetails = () => {
    setHotelDetails(null);
    submitRequest('properties/get-details?' + 'id=' + selectedHotel.id +
      '&checkIn=' + checkIn.getFullYear() + '-' + pad(checkIn.getMonth() + 1, 2) + '-' + pad(checkIn.getDay(), 2) +
      '&checkOut=' + checkOut.getFullYear() + '-' + pad(checkOut.getMonth() + 1, 2) + '-' + pad(checkOut.getDay(), 2) +
      '&adults1=' + guests1 +
      (guests2 > 0 ? '&adults2=' + guests2 : '') +
      (guests3 > 0 ? '&adults3=' + guests3 : ''),
      displayHotelDetails);
  };

  const displayHotelDetails = (response) => {
    const details = response.data.body;
    const landmarks = [];
    console.log('\in the hotel: ' + JSON.stringify(details.amenities[0]));
    selectedHotel.landmarks.map((landmark) => landmarks.push(landmark.label + ': ' + landmark.distance));
    details.amenities[0].listItems.splice(0, 0, { heading: 'Landmarks', listItems: landmarks });
    setHotelDetails(details);
    console.log('loading visibilities from: ' + JSON.stringify(hotelDetails));
    let visibility = {};
    details.amenities.map((container) => {
      container.listItems.map((section) => {
        visibility[section.heading] = false;
      });
    });
    setSectionsVisibility(visibility);
    console.log('\nhotel details: ' + JSON.stringify(hotelDetails));
    console.log('\nvisibility: ' + JSON.stringify(visibility));
  };

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.h1}>Hotels</Text>

        {/* Navigation Panels */}
        <View style={{ flex: 1, height: 555, width: 400, backgroundColor: '#0069cc', paddingHorizontal: 5 }}>
          <InputPanel
            step={step}
            destination={destination} setDestination={setDestination} cities={cities} setCities={setCities} selectedCity={selectedCity} setSelectedCity={setSelectedCity}
            checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut}
            guests1={guests1} setGuests1={setGuests1} guests2={guests2} setGuests2={setGuests2} guests3={guests3} setGuests3={setGuests3}
          />
          <HotelsPanel
            step={step}
            selectedCity={selectedCity} hotels={hotels}
            selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel}
            changeStep={changeStep}
          />
          <DetailsPanel
            step={step}
            selectedHotel={selectedHotel} hotelDetails={hotelDetails}
            sectionsVisibility={sectionsVisibility} setSectionsVisibility={setSectionsVisibility}
          />
        </View>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 70 }}>
          <TouchableHighlight
            style={[styles.imageButtonStyle, {backgroundColor: step <= 1 ? '#ccccb3' : '#0069cc'}]}
            onPress={() => changeStep(-1)}
            disabled={step <= 1}
          >
            <ScrollView horizontal>
              <Image
                source={require('./img/back.png')}
                style={styles.imageIconStyle}
              />
              <Text style={{ color: step <= 1 ? '#4A4A2C' : '#ffffff' }}> Back</Text>
            </ScrollView>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.imageButtonStyle, {backgroundColor: step >= 3 ? '#ccccb3' : '#0069cc'}]}
            onPress={() => changeStep(+1)}
            disabled={step >= 3}
          >
            <ScrollView horizontal>
              <Text style={{ color: step >= 3 ? '#4A4A2C' : '#ffffff' }}>Next </Text>
              <Image
                source={require('./img/next.png')}
                style={styles.imageIconStyle}
              />
            </ScrollView>
          </TouchableHighlight>
        </View>

        {/* Error alert dialog */}
        <GenericDialog
          title='Error'
          showDialog={dataError != ''}
          onOk={() => setDataError('')}
        >
          <Text>{dataError}</Text>
          <></>
        </GenericDialog>
      </View>
    </>
  );
};





export default App;
