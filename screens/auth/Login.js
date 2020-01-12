import React, {Component} from 'react';
import { Platform, Dimensions, View, Image, StatusBar, AsyncStorage, TouchableOpacity, Alert, Text, SafeAreaView, NetInfo, BackHandler, ActivityIndicator } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Item, Input, Toast, CheckBox, Form } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Global} from './../../core/Global'
import Services from './../../services/Services'
import Spinner from 'react-native-loading-spinner-overlay'
import Logo from './../../assets/images/logo.png'
import style from './../../assets/style/Style'
import firebase from 'react-native-firebase'

var { width, height } = Dimensions.get('window')



class Login extends Component{
  constructor(props){
    super(props)
    this.state = {
      email:'',
      password:'',
      wrongEmail:'',
      wrongPassword:'',
      errorMsg:'',
      mob_token:''
    }
  }

  async componentDidMount(){
    const fcmToken = await firebase.messaging().getToken()
    if (fcmToken) { this.setState({mob_token:fcmToken},()=>console.log(this.state.mob_token))}
    this.props.navigation.addListener ('willFocus',()=>{

    })
    BackHandler.addEventListener('hardwareBackPress',this.handleAndroidBack)
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack)
  }

  handleAndroidBack = () => {
    Alert.alert(`Guesto`,`Do you want to close guesto`,[{text: `Cancel`},{text: `Ok`, onPress:()=>BackHandler.exitApp()}],{ cancelable: false })
    return true;
  }

  goTo(screen){
    this.props.navigation.navigate(screen)
  }


  handleOnChange = x => (event) =>{
    switch (x) {
      case 'email':
      this.setState({email: event.nativeEvent.text, wrongEmail:'', errorMsg:''})
      break
      case 'password':
      this.setState({password: event.nativeEvent.text, wrongPassword:'', errorMsg:''})
      break
    }
  }


  login(){
    if (!this.state.email.includes('@')) {
      this.setState({wrongEmail:'Invalid email'})
    }else if (this.state.email.indexOf('@') != -1 && !/(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email)) {
      this.setState({wrongEmail:'Invalid email'})
    }else if (!this.state.password || !this.state.password.replace(/\s/g, '').length) {
      this.setState({wrongPassword:'Please, enter password'})
    }else if (this.state.password.length < 6) {
      this.setState({wrongPassword:'Invalid password'})
    }else{
      this.setState({loading:true})

      let data = {
        email:this.state.email,
        password:this.state.password,
        mob_token:this.state.mob_token
      }

      Services.login(data, (res)=>{
        console.log(res);
        this.setState({loading:false})
        if (res.error == 'UnAuthorised') {
          this.setState({errorMsg:'Wrong name or password'})
        }else if (res.error == 'Not active') {
          this.setState({errorMsg:'Your email doesn\'t active'})
        }else if (true) {
          AsyncStorage.setItem('logged','home')
          AsyncStorage.setItem('userData',JSON.stringify(res))
          if (res.user.type == 'employee') {
            global.userType = 'employee'
            global.permissions = res.user.roles.clientrole.permissions
          }else {
            global.userType = 'user'
            global.permissions = []
          }
          console.log(global.permissions);
          this.goTo('home')
          global.isLogged = true
        }
      })
    }
  }



  render() {
    return (
      <Container>
        <SafeAreaView style={{flex:1}}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF'}} size='large'/> */}

          <Content padder bounces={false} contentContainerStyle={{flex: 1,paddingHorizontal:'4%', backgroundColor:'#fff', paddingTop:height*.16}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />


            <View style={{flex:1,justifyContent:'space-around', }}>


              <Image source={Logo} style={{marginTop:height*.05, width:width*.5,height:height*.12, resizeMode:'contain',alignSelf:'center'}}/>

              <View style={[style.shadow,{elevation:2.5, backgroundColor:'#fff', paddingVertical:height*.04, paddingHorizontal:width*.06}]}>

                <Text style={{fontFamily:'OpenSans-Regular', fontSize:16, color:'#252631', textAlign:'center', marginBottom:height*.04}}>Sign into your account</Text>

                {this.state.wrongEmail!=''?(
                  <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',}}>{this.state.wrongEmail}</Text>
                ):null}

                <Item regular style={{marginBottom:10,borderRadius:4,borderWidth:0, borderColor:'#ededed', backgroundColor:'#f5f5f5',width:'98.5%'}}>
                  <Input
                    placeholder='Enter your email'
                    placeholderTextColor="#a3acb5"
                    onChange={this.handleOnChange('email')}
                    value={this.state.email}
                    selectionColor={'#3897F1'}
                    keyboardType='email-address'
                    autoCapitalize = 'none'
                    style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#252631',}}
                  />
                </Item>


                {this.state.wrongPassword!=''?(
                  <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',}}>{this.state.wrongPassword}</Text>
                ):null}
                <Item regular style={{marginBottom:10,borderRadius:4,borderWidth:0, borderColor:'#ededed', backgroundColor:'#f5f5f5',width:'98.5%'}}>
                  <Input
                    placeholder='Enter your password'
                    placeholderTextColor="#a3acb5"
                    onChange={this.handleOnChange('password')}
                    value={this.state.password}
                    selectionColor={'#3897F1'}
                    secureTextEntry={true}
                    autoCapitalize = 'none'
                    style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#252631',}}
                  />
                </Item>

                {this.state.errorMsg!=''?(
                  <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',}}>{this.state.errorMsg}</Text>
                ):null}
                <Button onPress={()=>this.login()} full style={{backgroundColor:Global.baseColor, marginTop:height*.015, borderRadius:4, marginBottom:height*.03,width:'98%', alignSelf:'center', elevation:0}}>
                  {this.state.loading?(
                    <ActivityIndicator size="small" color='#1d1d1f' />
                  ):(
                    <Text style={{fontFamily:'OpenSans-Regular', fontWeight:'600', color:'#1d1d1f', fontSize:14, textAlign:'center'}}>Sign In</Text>
                  )}
                </Button>

                <Text style={{fontFamily:'OpenSans-Regular',color:'#2c2c2c', fontSize:14, textAlign:'center'}}>Forgot your password ? <Text onPress={()=>this.goTo('forgetPassword')} style={{color:'#2e9490', }}>Reset Now</Text></Text>
              </View>
            </View>
          </Content>
        </SafeAreaView>
      </Container>
    )
  }
}

export default Login;
