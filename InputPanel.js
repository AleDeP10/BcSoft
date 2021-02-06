import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

import {submitRequest} from './commons';
import styles from './styles';



const InputPanel = (props) => {

    const [
      guests1Str, setGuests1Str
    ] = useState('' + props.guests1);
    const [
      guests2Str, setGuests2Str
    ] = useState('' + props.guests2);
    const [
      guests3Str, setGuests3Str
    ] = useState('' + props.guests3);
  
    const searchLocality = (value) => {
      let encLocality = encodeURIComponent(value);
      console.log(encLocality);
      if (encLocality != '') {
        submitRequest('locations/search?query=' + encLocality, displayLocalities);
      }
      else {
        props.setCities(null);
      }
      props.setDestination(value);
    };
  
    const displayLocalities = (data) => {
      console.log(JSON.stringify(data));
      let array = [];
      data.suggestions[0].entities.map(city => array.push({ label: city.name, value: city.destinationId }));
  
      console.log('cities: ' + JSON.stringify(array));
      props.setCities(array);
    };
  
    const renderCityDropDown = () => {
      console.log(JSON.stringify(props.selectedCity));
      if (props.cities != null) {
        return (
          <>
            <Text style={styles.label} >
              Select among the matching cities
            </Text>
            <DropDownPicker
              items={props.cities}
              defaultValue={props.selectedCity!=null?props.selectedCity.value:null}
              containerStyle={{ height: 40 }}
              style={{ backgroundColor: '#ffffff' }}
              itemStyle={{ justifyContent: 'flex-start' }}
              dropDownStyle={{ backgroundColor: '#ffffff' }}
              onChangeItem={item => props.setSelectedCity(item)}
            />
          </>
        );
      }
    };
  
    const setIntProperty = (text, originalValue, setTargetValue, setStringValue) => {
      let number = parseInt(text);
      console.log(number);
      if ( Object.is(number, NaN) ) {
        setStringValue('' + originalValue);
        alert('Expected an integer value');
      }
      else {
        setTargetValue(number);
        setStringValue('' + number);
      }
    }
  
    return (
      props.step == 1 ?
        <ScrollView>
          <Text style={styles.h2}>Travel details</Text>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              Destination
            </Text>
            <View>
              <TextInput
                placeholder='Enter your destination'
                value={props.destination}
                style={[styles.right, styles.input]}
                onChangeText={text => props.setDestination(text)}
                onSubmitEditing={(event) => searchLocality(event.nativeEvent.text)}
              />
              { renderCityDropDown() }
            </View>
          </View>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              ChekIn Date
            </Text>
            <DatePicker
              style={{ maxWidth: 220 }}
              date={props.checkIn}
              mode="date"
              locale="en"
              onDateChange={(date) => props.setCheckIn(date)}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              CheckOut Date
            </Text>
            <DatePicker
              style={{ maxWidth: 220 }}
              date={props.checkOut}
              mode="date"
              locale="en"
              onDateChange={(date) => props.setCheckOut(date)}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              Guests 1st room
            </Text>
            <TextInput 
              style={[styles.right, styles.input]} 
              value={guests1Str} 
              onChangeText={value => setGuests1Str(value)}
              onSubmitEditing={(event) => setIntProperty(event.nativeEvent.text, props.guests1, props.setGuests1, setGuests1Str)} />
          </View>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              Guests 2nd room
            </Text>
            <TextInput 
              style={[styles.right, styles.input]} 
              value={guests2Str} 
              onChangeText={value => setGuests2Str(value)}
              onSubmitEditing={(event) => setIntProperty(event.nativeEvent.text, props.guests2, props.setGuests2, setGuests2Str)} />
          </View>
          <View style={styles.row}>
            <Text style={[styles.left, styles.label]}>
              Guests 3rd room
            </Text>
            <TextInput 
              style={[styles.right, styles.input]} 
              value={guests3Str} 
              onChangeText={value => setGuests3Str(value)}
              onSubmitEditing={(event) => setIntProperty(event.nativeEvent.text, props.guests3, props.setGuests3, setGuests3Str)} />
          </View>
        </ScrollView>
        :
        <></>
    )
  };

  export default InputPanel;