import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    FlatList,
    Image,
    TouchableHighlight
} from 'react-native';

import styles from './styles';



export const showStars = (starRating) => {
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



const Hotel = ({ hotel, selectedHotel, onPress }) => {
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



const HotelsPanel = (props) => {

    const renderHotel = (hotel) => {
        return (
            <Hotel key={hotel.id}
                hotel={hotel}
                selectedHotel={props.selectedHotel}
                onPress={() => { handlePress(hotel) }}
            />
        );
    };

    const handlePress = (hotel) => {
        props.setSelectedHotel(hotel);
        props.changeStep(1);
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
                <ScrollView style={{ maxHeight: 505 }}>
                    <View style={styles.separator} />
                    {
                        props.hotels.map((hotel) => renderHotel(hotel))
                    }
                </ScrollView>
            </View>
        :
            <></>
    );
};



export default HotelsPanel;