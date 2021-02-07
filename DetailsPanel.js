import React, { useState } from 'react';

import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';

import {shallowClone} from './commons';
import {showStars} from './HotelsPanel';

import styles from './styles';



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
      let clone = shallowClone(props.sectionsVisibility);
      clone[heading] = !clone[heading];
      props.setSectionsVisibility(clone);
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
  


  export default DetailsPanel;