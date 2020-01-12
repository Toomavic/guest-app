import React from 'react'
import { StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Icon from 'react-native-vector-icons/Entypo'
import { Global } from './../../core/Global'
import BottomTabs from './../../components/BottomTabs'
import Header from './../../components/Header'
import Logo from './../../assets/images/logo.png'
import Services from './../../services/Services'
import Spinner from 'react-native-loading-spinner-overlay'
var { width, height } = Dimensions.get('window');

class About extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      data:'',
      loading:false,
    }
  }

  componentDidMount(){
    this.props.navigation.addListener ('willFocus',()=>{
      this.getAboutUsText()
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

  getAboutUsText(){
    this.setState({loading:true})
    Services.getAboutUsText((res)=>{
      this.setState({loading:false, data:res.data[0].description})
    })
  }

  render() {
    return (
      <Container style={{backgroundColor:'#fff'}}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
        {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF'}} size='large'/> */}
        <Header
          title='About us'
          leftSide={
            <Icon name='chevron-thin-left' style={{fontSize:20,alignSelf:'center', color:'#2c2c2c'}} onPress={()=>this.goBack()}/>
          }
        />

        <Content style={{paddingHorizontal:'4%'}}>
          {this.state.loading?(
            <ActivityIndicator style={{marginTop:height*.35}} size="small" color={Global.baseColor} />
          ):(
            <View>
              <Image source={Logo} style={{marginVertical:height*.05, width:width*.4,height:height*.1, resizeMode:'contain',alignSelf:'center', }}/>
              <Text style={{textAlign:'left',color:'#7b7b7b',fontSize:14}}>{this.state.data}</Text>
            </View>
          )}

        </Content>
        <BottomTabs navigation={this.props.navigation}/>
      </Container>
    )
  }
}

export default About;
