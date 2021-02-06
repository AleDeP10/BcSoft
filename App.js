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
import DatePicker from 'react-native-date-picker'



const submitRequest = (request, handleDisplay) => {
  console.log(request);
  fetch('https://hotels4.p.rapidapi.com/' + request + '&locale=en_US', {
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

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

const shallowClone = (object) =>  {
  const clone = {};
  let x;
  for (x in object) {
    clone[x] = object[x];
  }
  return clone;
};



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
            defaultValue={props.selectedCity!=null?props.selectedCity.value:props.cities[0].value}
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

const showStars = (starRating) => {
  let array=[];
  let stars = [];
  for (let i=0; i<=starRating; i++) {
    array.push(i);
  }
  array.map((i) => {
    stars.push(
      <Image key={i}
        source={require('./img/star.png')}
        style={styles.imageIconStyle}
      />
    )}
  );
  return (
    stars
  );
};

const Hotel = ({ hotel, selectedHotel, onPress, itemStyle }) => {
  const style = [styles.itemStyle];
  if (selectedHotel != null && hotel.id == selectedHotel.id) {
    style.push({backgroundColor: '#118AFE'});
  }
  return (
    <TouchableHighlight onPress={onPress} style={style}>
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 22 }}>
          <View style={{width: 280}}>
            <Text style={styles.h3}>{hotel.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: 100 }}>
            { showStars(hotel.starRating) }
          </View>
        </View>
        <Text>{hotel.address.streetAddress} {hotel.address.locality}</Text>
        <View style={styles.separator} />
      </>
    </TouchableHighlight>
  )
};

const HotelPanel = (props) => {

  const renderHotel = (hotel) => {
    return (
      <Hotel key={hotel.id}
        hotel={hotel} 
        selectedHotel = {props.selectedHotel}
        onPress={() => {handlePress(hotel)}}
      />
    );
  };
  
  const handlePress = (hotel) => {
    props.setSelectedHotel(hotel);
    {/*  */}
    //props.changeStep(1);
  };

  return (
    props.step == 2 ?
      <View style={styles.h2}>
        <Text style={styles.label}>
          Hotels available near {props.selectedCity.label}
        </Text>
        
        <FlatList>
          data={props.hotels}
          renderItem={renderHotel}
          keyExtractor={(hotel) => hotel.id}
          style={styles.listbox}
        </FlatList>

        {/*
            UI trouble with FlatList

          The code used to build the above flatlist is the same of the ToDoList implementation.
          However, it seems not display anything neatherless hotel property is populated.
          To overcome this trouble renderHotel is called inside a ScrollView that manages to
          show the data as intended.

          Still, it is not clear the reason of the issue. What's the matter with this code??
        */}
        <ScrollView style={{ maxHeight:505 }}>
          <View style={styles.separator} />
          {
            props.hotels.map((hotel)=>renderHotel(hotel))
          }
        </ScrollView>
      </View>
    :
      <></>
  );
};

const DetailsPanel = (props) => {
  const renderAmenityLists = (container) => {
    return (
      <View key={container.heading}>
        <Text style={styles.h3}>{container.heading}</Text>
        <View style={styles.separator} />
        <View>
          { container.listItems.map((section) => renderAmenities(section)) }
        </View>
      </View>
    );
  };

  const renderAmenities = (section) => {
    const displayContent = (heading) => {
      return (
        props.sectionsVisibility[heading] ?
          <View>
            { section.listItems.map((amenity) => renderAmenity(amenity)) }
          </View>
        : 
          <></>
      );
    };

    const renderIcon = (isOpen) => {
      return (
        isOpen ?
          <Image source={require('./img/close.png')} style={styles.imageIconStyle} />
        :
          <Image source={require('./img/open.png')} style={styles.imageIconStyle} />
      );
    };

    return (
      <View key={section.heading}>
        <TouchableHighlight
          onPress={() => toggleSectionVisibility(section.heading)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 22 }}>
            { renderIcon(props.sectionsVisibility[section.heading]) }
            <Text style={styles.h4}>{section.heading}</Text>
          </View>
        </TouchableHighlight>
        { displayContent(section.heading) }
        <View style={styles.separator} />
      </View>
    );
  };

  const toggleSectionVisibility = (heading) => {
    console.log(heading + ' => ' + props.sectionsVisibility[heading]);
    let clone = shallowClone(props.sectionsVisibility);
    clone[heading] = !clone[heading];
    props.setSectionsVisibility(clone);
    console.log('toggled visibility: '+JSON.stringify(clone));
  }

  const renderAmenity = (amenity) => {
    return (
      <Text key={amenity}>{amenity}</Text>
    );
  };

  let hotel = props.selectedHotel;
  return (
    props.step == 3 && props.hotelDetails != null ?
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 22 }}>
          <View style={{width: 280}}>
            <Text style={styles.h2}>
              {hotel.name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 110 }}>
            { showStars(hotel.starRating) }
          </View>
        </View>
        <Text>{hotel.address.streetAddress} {hotel.address.locality}</Text>
        <Image style={{width: 390, height: 245, marginVertical: 8}} source={{uri: hotel.thumbnailUrl}} />
        <View>
          { props.hotelDetails.amenities.map((section) => renderAmenityLists(section)) }
        </View>
      </ScrollView>
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

  const changeStep = (increment) => {
    if (step==1 && increment==1) {
      searchHotels();
    }
    if (step==2 && increment==1) {
      searchHotelDetails();
    }
    setStep(step+increment);
  };

  const searchHotels = () => {    
    submitRequest('properties/list?' + 'destinationId=' + selectedCity.value +
      '&checkIn=' + checkIn.getFullYear() + '-' + pad(checkIn.getMonth()+1,2) + '-' + pad(checkIn.getDay(),2) +
      '&checkOut=' + checkOut.getFullYear() + '-' + pad(checkOut.getMonth()+1,2) + '-' + pad(checkOut.getDay(),2) +
      '&adults1=' + guests1 + 
      (guests2>0 ? '&adults2=' + guests2 : '') + 
      (guests3>0 ? '&adults3=' + guests3 : '') + 
      '&pageNumber=1&pageSize=25', 
      (response) => setHotels(response.data.body.searchResults.results));
  };

  const searchHotelDetails = () => {    
    setHotelDetails(null);
    submitRequest('properties/get-details?' + 'id=' + selectedHotel.id +
      '&checkIn=' + checkIn.getFullYear() + '-' + pad(checkIn.getMonth()+1,2) + '-' + pad(checkIn.getDay(),2) +
      '&checkOut=' + checkOut.getFullYear() + '-' + pad(checkOut.getMonth()+1,2) + '-' + pad(checkOut.getDay(),2) +
      '&adults1=' + guests1 + 
      (guests2>0 ? '&adults2=' + guests2 : '') + 
      (guests3>0 ? '&adults3=' + guests3 : ''), 
      displayHotelDetails);
  };

  const displayHotelDetails = (response) => {
    const details = response.data.body;
    const landmarks = [];
    console.log('\in the hotel: '+JSON.stringify(details.amenities[0]));
    selectedHotel.landmarks.map((landmark) => landmarks.push(landmark.label+': '+landmark.distance));
    details.amenities[0].listItems.splice(0, 0, {heading: 'Landmarks', listItems: landmarks});
    setHotelDetails(details);
    console.log('loading visibilities from: ' + JSON.stringify(hotelDetails));
    let visibility = {};
    details.amenities.map((container)=>{
      container.listItems.map((section) => {
        visibility[section.heading] = false;
      });
    });
    setSectionsVisibility(visibility);
    console.log('\nhotel details: '+JSON.stringify(hotelDetails));
    console.log('\nvisibility: '+JSON.stringify(visibility));
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
          <HotelPanel
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
            style={styles.imageButtonStyle}
            onPress={() => changeStep(-1)}
            disabled={step <= 1}
          >
            <ScrollView horizontal>
              <Image
                source={require('./img/back.png')}
                style={styles.imageIconStyle}
              />
              <Text style={{ color: step <= 1 ? '#ccccb3' : '#ffffff' }}> Back</Text>
            </ScrollView>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.imageButtonStyle}
            onPress={() => changeStep(+1)}
            disabled={step >= 3}
          >
            <ScrollView horizontal>
              <Text style={{ color: step >= 3 ? '#ccccb3' : '#ffffff' }}>Next </Text>
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
  h1: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0069cc',
  },
  h2: {
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 4
  },
  h3: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4
  },
  h4: {
    fontSize: 16,
    fontWeight: '300',
    color: '#ffffff',
    fontStyle: 'italic'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 2,
    marginHorizontal: 4,
    backgroundColor: '#7D78A9',
    minWidth: '100%'
  },
  label: {
    marginVertical: 8,
    fontSize: 14,
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
    paddingBottom: 10,
    alignContent: 'center'
  },
  left: {
    minWidth: 120
  },
  right: {
    minWidth: '100%'
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
    borderColor: '#00509E',
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
  separator: {
    flex: 1,
    height: 1,//StyleSheet.hairlineWidth,
    backgroundColor: '#CECECE',
    marginVertical: 5
  },


  imageButtonStyle: {
    padding: 10,
    margin: 10,
    backgroundColor: '#0069cc',
  },
  imageIconStyle: {
    width: 20,
    height: 20
  },
});

export default App;
