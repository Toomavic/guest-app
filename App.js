import React, {Component} from 'react';
import { Platform, StatusBar, AsyncStorage, ImageBackground, Dimensions, NetInfo, Modal} from 'react-native';
import { Container, Root, Text } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import Spinner from 'react-native-loading-spinner-overlay'
import { setCustomText } from 'react-native-global-props';
import { SwitchNavigation } from './core/Router'
import FirebaseListener from './core/FirebaseListener'
import NavigationService from './core/NavigationService'
import { MenuProvider } from 'react-native-popup-menu';
import BottomTabs from './components/BottomTabs'

import Logo from './assets/images/logo.png'
var { width, height } = Dimensions.get('window')
let Leyout = {}
global.isLogged = false


const customTextProps = {
  style: {
    fontFamily:'OpenSans-Regular'
  }
}


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isDisconnected: false,
      isMount:false,
    }
    AsyncStorage.getItem('logged').then((value) => {
      console.log(value);
      if (value) {
        Leyout = SwitchNavigation(value)
        if (value == 'logged') {
          global.isLogged = false
        }else {
          global.isLogged = true
        }
        this.setState({isMount:true},()=>console.log('2'))
      }else {
        Leyout = SwitchNavigation('login')
        this.setState({isMount:true},()=>console.log('3'))
      }
    })

    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        if (JSON.parse(value).user.type == 'employee') {
          global.userType = 'employee'
          global.permissions = JSON.parse(value).user.roles.clientrole.permissions
        }else {
          global.userType = 'user'
          global.permissions = []
        }
      }
    })
    setCustomText(customTextProps);
    global.tab='home'
  }

  componentDidMount(){
  // AsyncStorage.clear();
    this.handleConnectionChange()
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
    setTimeout(() => SplashScreen.hide(), 2000)
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
  }


  handleConnectionChange = (isConnected) => {
    if (!isConnected && isConnected != undefined) {
      return this.setState({ isDisconnected: true});
    }else {
      return this.setState({ isDisconnected: false});
    }
  }


  render() {
    if (this.state.isMount != true) {
      return (
        <Container style={{backgroundColor:'#fff'}}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          {/* <ImageBackground source={Logo} style={{width:width, height:height, resizeMode:'cover'}}/> */}
        </Container>
      )
    }else {
      return (
        <Root>
          <FirebaseListener />
          <Modal animationType="slide" transparent={true} visible={this.state.isDisconnected} onRequestClose={()=>{}}>
            <Text style={{textAlign:'center',paddingTop:15,paddingBottom:10, backgroundColor: '#b52424',color:'#fff'}}>No Internet Connection</Text>
          </Modal>
          <MenuProvider>
            <Leyout ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef)}}/>
            {/* {global.isLogged?  <BottomTabs /> :null} */}
          </MenuProvider>
        </Root>
      )
    }
  }
}

export default App;
