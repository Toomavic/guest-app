import React, {Component} from 'react';
import { Platform, Dimensions, View, Image, StatusBar, AsyncStorage, TouchableOpacity, Alert, Text, SafeAreaView, NetInfo, BackHandler } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Item, Input, Toast, CheckBox, Form } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Global} from './../../core/Global'
import Services from './../../services/Services'
import Spinner from 'react-native-loading-spinner-overlay'
import Logo from './../../assets/images/logo.png'

var { width, height } = Dimensions.get('window');



class ForgetPassword extends Component{
  constructor(props){
    super(props)
    this.state = {
      email:'',
      wrongEmail:'',
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
    this.goTo('login')
    return true;
  }

  goTo(screen){
    this.props.navigation.navigate(screen)
  }


  handleOnChange = x => (event) =>{
    switch (x) {
      case 'email':
      this.setState({email: event.nativeEvent.text, wrongEmail:'',})
      break
    }
  }


  login(){
    if (!this.state.email.includes('@')) {
      this.setState({wrongEmail:'Invalid email'})
    }else if (this.state.email.indexOf('@') != -1 && !/(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email)) {
      this.setState({wrongEmail:'Invalid email'})
    }else{
      let data = { email: this.state.email }
      this.setState({loading:true})
      Services.forgetPassword(data, (res)=>{
        this.setState({loading:false})
      console.log(res);
      Toast.show({text:res,duration:3000,type:"success"})
      })
    }
  }



  render() {
    return (
      <Container>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF'}} size='large'/>

        <Icon name='arrow-left' style={{paddingHorizontal:'4%',marginTop:height*.06,fontSize:30, color:'#000'}} onPress={()=>this.goTo('login')} />
        <Content padder bounces={false} contentContainerStyle={{flex: 1,paddingHorizontal:'4%', backgroundColor:'#fff'}}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />






          <Image source={Logo} style={{marginTop:height*.05, width:width*.5,height:height*.12, resizeMode:'contain',alignSelf:'center'}}/>

          <View style={{paddingHorizontal:'2%'}}>


            <Text style={{fontFamily:'OpenSans-Regular', fontSize:16, color:'#252631', textAlign:'left', marginTop:height*.06}}>Recover password</Text>
            <Text style={{fontFamily:'OpenSans-Regular', fontSize:14, color:'rgba(37, 38, 49, 0.61)', textAlign:'left', marginTop:height*.01, marginBottom:height*.04}}>
              Please enter your email to recover your password
            </Text>
            {this.state.wrongEmail!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',}}>{this.state.wrongEmail}</Text>
            ):null}
            <Item regular style={{marginBottom:10,borderRadius:4,borderWidth:0, borderColor:'#ededed', backgroundColor:'#f5f5f5',width:'98.5%',}}>
              <Input
                placeholder='Email'
                placeholderTextColor="#a3acb5"
                onChange={this.handleOnChange('email')}
                value={this.state.email}
                selectionColor={'#3897F1'}
                keyboardType='email-address'
                autoCapitalize = 'none'
                style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#252631',}}
              />
            </Item>


            <Button onPress={()=>this.login()} full style={{height:height*.085, backgroundColor:Global.baseColor, marginTop:height*.015, borderRadius:4, marginBottom:height*.03,width:'98%', alignSelf:'center', elevation:0}}>
              <Text style={{fontFamily:'OpenSans-Regular', fontWeight:'600', color:'#1d1d1f', fontSize:14, textAlign:'center'}}>Send Confirmation</Text>
            </Button>

          </View>
        </Content>

      </Container>
    )
  }
}

export default ForgetPassword;
