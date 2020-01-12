import React from 'react'
import { Platform, StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image, Dimensions, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator, Keyboard } from 'react-native'
import { Container, Content, Button, Item, Input, Textarea, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay'
import {Global} from './../../core/Global'

import BottomTabs from './../../components/BottomTabs'
import Header from './../../components/Header'
import Services from './../../services/Services'

var { width, height } = Dimensions.get('window')

class Feedback extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      feedbackMsg:'',
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
    this.goBack()
    return true;
  }

  goBack(){
    this.props.navigation.goBack()
  }

  handleOnChange = x => (event) =>{
    this.setState({feedbackMsg: event.nativeEvent.text})
  }

  sendFeedback(){
    // alert(this.state.feedbackMsg)
    if (this.state.feedbackMsg=='') {
      Toast.show({text: 'Please, enter your feedback',duration:3000,})
    }else {
      let obj = {
        message:this.state.feedbackMsg
      }
      this.setState({loading:true})
      Services.sendFeedback(obj, (res)=>{
        console.log(res);
        Toast.show({text:res,duration:3000,})
        this.setState({loading:false, feedbackMsg:''})
        setTimeout(()=>{Keyboard.dismiss()},50)
      })
    }
  }


  render() {
    return (
      <Container style={{backgroundColor:'#fff'}}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
        {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF'}} size='large'/> */}

        <Header
          title='Feedback'
          leftSide={
            <Text style={{fontSize:14,alignSelf:'center', color:'#2c2c2c'}} onPress={()=>this.goBack()}>Cancel</Text>
          }
          rightSide={
            <Text style={{fontSize:14,alignSelf:'center', color:'#2c2c2c'}} onPress={()=>this.sendFeedback()}>Submit</Text>
          }
        />

        <Content style={{paddingHorizontal:'5%', backgroundColor:'#f6f9fc'}}>

          {this.state.loading?(
            <ActivityIndicator style={{marginTop:height*.35}} size="small" color={Global.baseColor} />
          ):(
            <Textarea
              value={this.state.feedbackMsg}
              onChange={this.handleOnChange()}
              placeholder="Share your feedback about the app!"
              placeholderTextColor='#a9a9a9'
              style={{fontSize:12,color:'#000'}}
              autoFocus={true}
              rowSpan={Platform.OS=='ios'?8:20}
            />
          )}

        </Content>

        <BottomTabs navigation={this.props.navigation}/>
      </Container>
    )
  }
}

export default Feedback;
