import React from 'react'
import { Platform, StatusBar, AsyncStorage, Text, BackHandler, Alert, View, Dimensions, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { Container, Content, Button, Toast, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'
import Spinner from 'react-native-loading-spinner-overlay'
import Switch from 'react-native-switch-pro'
// import clear from 'react-native-clear-app-cache'

import Header from './../../components/Header'
import BottomTabs from './../../components/BottomTabs'
import Services from './../../services/Services'
import Logo from './../../assets/images/logo.png'
import {Global} from './../../core/Global'
import styles from './../../assets/style/Style'

var { width, height } = Dimensions.get('window')

class Settings extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      notifications:true,
      loading:false,
      loading2:false
    }
  }

  componentDidMount(){
    this.props.navigation.addListener ('willFocus',()=>{
    })

    BackHandler.addEventListener('hardwareBackPress',this.handleAndroidBack)
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack)
  }

  handleAndroidBack = () => {
    this.props.navigation.goBack()
    return true;
  }

  handleSwitch(value){
    this.setState({notifications:value, loading: true})
    let data = {}
    value ? data.status = 1 : data.status = 0

    Services.toggleNotification(data, (res)=>{
      console.log(res);
      this.setState({loading:false})
    })
  }

  goTo(screen){
    this.props.navigation.navigate(screen)
  }

  rate(){
    Linking.openURL(Platform.OS=='ios'?'https://play.google.com/store/apps/details?id=com.guesto':'https://play.google.com/store/apps/details?id=com.guesto')
  }

  // resetAppCache(){
  //   Alert.alert(`Guesto`,`Do you want to reset App cache?`,[{text: `Cancel`},{text: `Ok`, onPress:()=>this.confirmRestApp()}],{ cancelable: false })
  // }
  // confirmRestApp(){
  //   clear.clearAppCache(() => {
  //     Toast.show({text: 'App has been reseted',duration:4000,type:"success"})
  //   })
  // }


  logout(){
    Alert.alert(`Guesto`,`Do you want to Log out?`,[{text: `Cancel`},{text: `Ok`, onPress:()=>this.confirmLogout()}],{ cancelable: false })
  }
  confirmLogout(){
    this.setState({loading2:true})
    Services.logout((res)=>{
      this.setState({loading2:false})
      global.tab='home'
      AsyncStorage.setItem('logged','logged')
      this.props.navigation.navigate('authStack')
    })


  }

  render() {
    return (
      <Container style={{backgroundColor:'#f6f9fc'}}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
        <Header title='More' />
        <Content>

          <Text style={{fontSize:18, paddingVertical:15,paddingHorizontal:'5%'}}>Settings</Text>

          <View style={{backgroundColor:'#fff', paddingVertical:15, width:'100%'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between',paddingHorizontal:'5%'}}>
              <Text style={{fontSize:14, color:'#292929', alignSelf:'center'}}>Push Notifications</Text>

              {this.state.loading?(
                <ActivityIndicator size="small" color={Global.baseColor} style={{marginRight:'3%', paddingVertical:'1.7%'}}/>
              ):(
                <Switch
                  value={this.state.notifications}
                  height={31}
                  width={51}
                  circleStyle={[styles.shadow,{height:28, width:28,elevation:2}]}
                  backgroundInactive='#fff' backgroundActive={Global.baseColor}
                  style={{borderColor:'#ededed',borderWidth:1}}
                  onSyncPress={v => this.handleSwitch(v)}
                />
              )}


            </View>
            <Text style={{paddingHorizontal:'5%',fontSize:12, color:'#7b7b7b', paddingVertical:10 }}>Enable/Disable Push Notifications. Push notifications to the app are delivered through Apple servers.</Text>
          </View>



          <TouchableOpacity activeOpacity={1} onPress={()=>this.goTo('about')} style={{backgroundColor:'#fff', paddingLeft:'5%', marginTop:15}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#ededed', flexDirection:'row', justifyContent:'space-between', paddingVertical:17}}>
              <Text style={{color:'#292929', fontSize:14,alignSelf:'center',}}>About Guesto</Text>
              <Icon name='chevron-thin-right' style={{color:Global.baseColor, alignSelf:'center', paddingRight:'5%', fontSize:16}}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} onPress={()=>this.goTo('feedback')} style={{backgroundColor:'#fff', paddingLeft:'5%'}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#ededed', flexDirection:'row', justifyContent:'space-between', paddingVertical:17}}>
              <Text style={{color:'#292929', fontSize:14,alignSelf:'center',}}>Feedback</Text>
              <Icon name='chevron-thin-right' style={{color:Global.baseColor, alignSelf:'center', paddingRight:'5%', fontSize:16}}/>
            </View>
          </TouchableOpacity>



          <TouchableOpacity activeOpacity={1} onPress={()=>this.rate()} style={{backgroundColor:'#fff', paddingLeft:'5%'}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#ededed', flexDirection:'row', justifyContent:'space-between', paddingVertical:17}}>
              <Text style={{color:'#292929', fontSize:14, }}>Rate us</Text>
            </View>
          </TouchableOpacity>



          {/* <TouchableOpacity activeOpacity={1} onPress={()=>this.resetAppCache()} style={{backgroundColor:'#fff', paddingLeft:'5%'}}>
            <Text style={{color:'#f25851', fontSize:14,paddingVertical:8}}>Reset App</Text>
            <Text style={{color:'#909090',fontSize:14,borderBottomWidth:1,borderBottomColor:'#ededed',paddingBottom:17}}>Removes customisation and takes the app back to its
            intial state</Text>
          </TouchableOpacity> */}


          <TouchableOpacity activeOpacity={1} onPress={()=>this.logout()} style={{backgroundColor:'#fff', paddingLeft:'5%', marginBottom:40, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{color:'#f25851', fontSize:14,paddingVertical:15}}>Log out</Text>
            {this.state.loading2?(
              <ActivityIndicator size="small" color={Global.baseColor} style={{marginRight:'5%'}}/>
            ):null}
          </TouchableOpacity>



        </Content>
        <BottomTabs navigation={this.props.navigation} />
      </Container>
      )
    }
  }

  export default Settings;
