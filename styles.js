import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
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
      alignContent: 'center',
      paddingTop: 10,
    },
    left: {
      minWidth: 120
    },
    right: {
      minWidth: '100%'
    },
    label: {
        marginVertical: 8,
        fontSize: 14,
        fontWeight: '400',
        color: '#CAC8E0',
      },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: '#ffffff',
      borderColor: '#00509E',
      color: '#39739d'
    },
  
    listbox: {
      flex: 1,
      marginVertical: 20,
      backgroundColor: '#ffffff', minWidth: '100%',
      padding: 10
    },
    separator: {
      flex: 1,
      height: 1,//StyleSheet.hairlineWidth,
      backgroundColor: '#CECECE',
      marginTop: 5
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