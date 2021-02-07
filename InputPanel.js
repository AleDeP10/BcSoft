import React, { useState } from 'react';

import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

import GenericDialog from './GenericDialog';

import { submitRequest } from './commons';
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
    const [
        inputError, setInputError
    ] = useState('');



    const searchLocality = (value) => {
        let encLocality = encodeURIComponent(value);
        props.setSelectedCity(null);
        if (encLocality != '') {
            submitRequest('locations/search?query=' + encLocality, displayLocalities);
        }
        else {
            props.setCities(null);
        }
        props.setDestination(value);
    };

    const displayLocalities = (data) => {
        let cities = [];
        data.suggestions[0].entities.map(city => cities.push({ label: city.name, value: city.destinationId }));
        cities.sort((city1, city2) => city1.label<city2.label?-1:1);
        props.setCities(cities);
    };



    const renderCityDropDown = () => {
        if (props.cities != null) {
            return (
                <>
                    <Text style={styles.label} >
                        Select among the matching cities
                    </Text>
                    <DropDownPicker
                        items={props.cities}
                        defaultValue={props.selectedCity != null ? props.selectedCity.value : null}
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: '#ffffff' }}
                        selectedLabelStyle={{ color: '#39739d' }}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        dropDownStyle={{ backgroundColor: '#ffffff' }}
                        onChangeItem={city => props.setSelectedCity(city)}
                    />
                </>
            );
        }
    };



    const setIntProperty = (text, originalValue, setTargetValue, setStringValue) => {
        let number = parseInt(text);
        if (Object.is(number, NaN)) {
            setStringValue('' + originalValue);
            setInputError('Expected an integer value');
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

                {/* Final destination selection into a dropdown */}
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

                {/* CheckIn and checkOut dates loaded from a GenericDialog */}
                <View style={styles.row}>
                    <Text style={[styles.left, styles.label]}>
                        ChekIn Date
                    </Text>
                    <DateInput 
                        targetDate={props.checkIn}
                        setTargetDate={props.setCheckIn}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={[styles.left, styles.label]}>
                        CheckOut Date
                    </Text>
                    <DateInput 
                        targetDate={props.checkOut}
                        setTargetDate={props.setCheckOut}
                    />
                </View>

                {/* Guests for each room (adults) */}
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

                {/* Error alert dialog  */}
                <GenericDialog
                    title='Error'
                    showDialog={inputError != ''}
                    onOk={() => setInputError('')}
                >
                    <Text>{inputError}</Text>
                    <></>
                </GenericDialog>
            </ScrollView>
        :
            <></>
    )
};

{/* Date picker separated into a GenericDialog */}
const DateInput = (props) => {
    const [
        date, setDate
    ] = useState(props.targetDate);
    const [
        showDialog, setShowDialog
    ] = useState(false);
    return (
        <>
            {/* Disabled textfield with activation button */}
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <TextInput 
                    style={[styles.input, { width: 220, height: 40 }]}
                    value={date.toDateString()}
                    editable={false}
                />
                <TouchableHighlight onPress={() => setShowDialog(true)}>
                    <Image
                        source={require('./img/date-time.png')}
                        style={{ width: 30, height: 30, marginLeft: 10 }}
                    />
                </TouchableHighlight>
            </View>

            {/* Popup for the date selection */}
            <GenericDialog
                title='Choose a date'
                showDialog={showDialog}
                showCancel={true}
                onOk={() => {props.setTargetDate(date);setShowDialog(false);}}
                onCancel={() => setShowDialog(false)}
            >
                <DatePicker
                    style={{ maxWidth: 280 }}
                    date={date}
                    mode="date"
                    locale="en"
                    onDateChange={(value) => setDate(value)}
                />
                <></>
            </GenericDialog>
        </>
    );
};

export default InputPanel;