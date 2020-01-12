import { Platform, StyleSheet, Dimensions, PixelRatio } from 'react-native';

var { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  teriangle:{
    position:'absolute',
    bottom:0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: height*.1,
    borderBottomWidth:Platform.OS=='ios'&&PixelRatio.get()==2?height*.2:height*.1,
    borderLeftWidth: height*.1,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    borderLeftColor: 'transparent',
  },
  shadow: {
    shadowColor: '#777',
    shadowOffset: { width: 0,height: .2 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    zIndex:9999,
  },

  badge:{
    width:15,
    height:15,
    borderRadius:15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    marginLeft:10
  }
})

export default styles;
