import React, {useState} from 'react';
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
import DatePicker from 'react-native-date-picker'



const submitRequest = (request, handleDisplay) => {
  console.log(request);
  fetch('https://hotels4.p.rapidapi.com/'+request+'&locale=en_US', {
    'method': 'GET',
    'headers': {
      'x-rapidapi-key': '5df307e14fmshb02ff7094ff52e7p14d821jsnf8875b81fca5',
      'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
  })
  .then(response => response.json())
  .then(data => handleDisplay(data))
  .catch(err => console.error(err));
};



const InputPanel = (props) => {

  const searchLocality = (value) => {
    let encLocality = encodeURIComponent(value);
    console.log(encLocality);
    if (encLocality != '') {
      submitRequest('locations/search?query='+encLocality, displayHotels);
    }
    else {
      props.setCities(null);
    }
    props.setDestination(value);
  };

  const displayHotels = (data) => {
      console.log(JSON.stringify(data));
      let array = [];
      data.suggestions[0].entities.map(city => array.push({label: city.name, value: city.destinationId}));
      
      console.log('cities: '+JSON.stringify(array));
      props.setCities(array);
  };

  const renderCityDropDown = () => {
    if(props.cities != null) {
      return (
        <>
          <Text style={ [styles.caption, {fontSize: 16} ]} >
              Select among the matching cities
            </Text>
            <DropDownPicker
              items={props.cities}
              defaultValue={props.cities[0].value}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => props.setSelectedCity(item)}
            />
        </>
      );
    }
  };


  return (
    props.step==1 ?
      <ScrollView>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            Destination
          </Text>
          <View>
            <TextInput 
              placeholder='Enter your destination' 
              style={styles.input} 
              onSubmitEditing={(event) => searchLocality(event.nativeEvent.text)}
            />
            {renderCityDropDown()}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            ChekIn Date
          </Text>
          <DatePicker
            style={{maxWidth: 220}}
            date={props.checkIn}
            mode="date"
            locale="en"
            onDateChange={(date) => props.setCheckIn(date)}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            CheckOut Date
          </Text>
          <DatePicker
            style={{maxWidth: 220}}
            date={props.checkOut}
            mode="date"
            locale="en"
            onDateChange={(date) => props.setCheckOut(date)}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            Guests 1st room
          </Text>
          <TextInput placeholder='#' style={styles.input} value={''+props.guests1} onChange={value => props.setGuests1(parseInt(value))} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            Guests 2nd room
          </Text>
          <TextInput placeholder='#' style={styles.input} value={''+props.guests2} onChange={value => props.setGuests2(parseInt(value))} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.sectionDescription, styles.caption]}>
            Guests 3rd room
          </Text>
          <TextInput placeholder='#' style={styles.input} value={''+props.guests3} onChange={value => props.setGuests3(parseInt(value))} />
        </View>
      </ScrollView>
    :
      <></>
  )
};

const Item = ({ item }) => (
  <TouchableHighlight style={[styles.item]}>
    <Text style={[styles.sectionDescription]}>{item.value}</Text>
  </TouchableHighlight>
);

const HotelPanel = (props) => {

  const searchHotels = (destinationId) => {
    submitRequest('properties/list?destinationId='+destinationId, displayLocalities);
  };

  const displayLocalities = (data) => {
      console.log(JSON.stringify(data));
      let array = [];
      data.suggestions[0].entities.map(city => array.push({label: city.name, value: city.destinationId}));
      
      console.log('cities: '+JSON.stringify(array));
      props.setCities(array);
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
      />
    );
  };

  return (
    props.step==2 ?
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionDescription}>
          Hotels available in {props.selectedCity.label}
        </Text>
        <FlatList>
          data={props.hotels}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.listbox}
        </FlatList>
      </View>
    :
      <></>
  );
};

const DetailsPanel = (props) => {
  return (
    props.step==3 ?
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionDescription}>
      Your favorite hotel!
      </Text>
    </View>
    :
      <></>
  );
};

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
  ] = useState({label: 'Tolmezzo', value: 12531210});
  const [
    checkIn, setCheckIn
  ] = useState(new Date(2020, 9, 9));
  const [
    checkOut, setCheckOut
  ] = useState(new Date(2020, 9, 16));
  const [
    guests1, setGuest1
  ] = useState(1);
  const [
    guests2, setGuest2
  ] = useState(0);
  const [
    guests3, setGuest3
  ] = useState(0);

  const [
    hotels, setHotels
  ] = useState([]);
  const [
    selectedHotel, setSelectedHotel
  ] = useState([]);

  return (
    <>
        <StatusBar barStyle='dark-content' />
        <View style={styles.body}>
          {/* Title */}
          <Text style={styles.title}>Hotels</Text>

          {/* Navigation Panels */}
          <View style={ {flex:1, height:555, maxWidth:400,backgroundColor:'#7D78A9', paddingHorizontal: 20} }>
            <InputPanel 
              step={step} 
              destination={destination} setDestination={setDestination} cities={cities} setCities={setCities} selectedCity={selectedCity} setSelectedCity={setSelectedCity}
              checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut}
              guests1={guests1} setGuest1={setGuest1} guests2={guests2} setGuest2={setGuest2} guests3={guests3} setGuest3={setGuest3}
            />
            <HotelPanel 
              step={step} 
              selectedCity={selectedCity} guests1={guests1} guests2={guests2} guests3={guests3} checkIn={checkIn} checkOut={checkOut} 
              hotels={hotels} setHotels={setHotels} selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel}
            />
            <DetailsPanel step={step} />
          </View>

          {/* Navigation Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 70}}>
            <TouchableHighlight
              style={styles.imageButtonStyle}
              onPress={() => setStep(step-1)}
              disabled={step<=1}
            >
              <ScrollView horizontal>
                <Image
                  source={require('./img/back.png')}
                  style={styles.imageIconStyle}
                />
                <Text style={{ color: step<=1?'#ccccb3':'#ffffff' }}> Back</Text>
              </ScrollView>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.imageButtonStyle}
              onPress={() => setStep(step+1)}
              disabled={step>=3}
            >
            <ScrollView horizontal>
              <Text style={{ color: step>=3?'#ccccb3':'#ffffff' }}>Next </Text>
              <Image
                source={require('./img/next.png')}
                style={styles.imageIconStyle}
              />
            </ScrollView>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7D78A9',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 10,
    backgroundColor: '#7D78A9',
    minWidth: '100%'
  },
  sectionDescription: {
    marginVertical: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#CAC8E0',
  },
  footer: {
    color: '#5A548E',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },

  row: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  caption: {
    minWidth: 150
  },
  input: {
    minWidth: '100%'
  },

  listbox: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#ffffff', minWidth: '100%',
    padding: 10
  },
  item: {
    padding: 10,
    marginVertical: 10,
    width: '100%',
    textDecorationLine: 'underline',
    fontStyle: 'italic'
  },


  imageButtonStyle: {
    padding: 10,
    margin: 10,
    backgroundColor: '#7D78A9',
  },
  imageIconStyle: {
    width: 20,
    height: 20
  },
});

export default App;
