import React from 'react'
import { Platform, StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image, Dimensions, TouchableOpacity, FlatList, ImageBackground, ScrollView, ActivityIndicator, PixelRatio, RefreshControl } from 'react-native'
import { Container, Content, Button, Toast, Thumbnail, } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay'

import moment from 'moment'

import {Global} from './../../core/Global'
import styles from './../../assets/style/Style'

import CircleChart from './../../components/CircleChart'
import BottomTabs from './../../components/BottomTabs'
import Services from './../../services/Services'
import Logo from './../../assets/images/logo.png'
var { width, height } = Dimensions.get('window')

class Home extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      cases:[],
      surveyreports:'',
      reportNumbers:'',
      tripadvisor:'',
      loading:true,
      date:'',
      isFetching:false,
      hasPermission:true,
    }
  }

  componentDidMount(){
    this.props.navigation.addListener ('willFocus',()=>{
      this.checkHasPermission()
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

  checkHasPermission(){
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Report Generation') != undefined) {
        this.setState({hasPermission:true})
        let today = new Date()
        this.setState({date:today.toISOString().split('T')[0], loading:true},()=>this.getReports())
      }else {
        this.setState({hasPermission:false})
      }
    }else {
      let today = new Date()
      this.setState({date:today.toISOString().split('T')[0], loading:true},()=>this.getReports())
    }
  }


  getReports(){
    // this.setState({loading:true})
    AsyncStorage.getItem('userData').then((value)=>{
      let data = {}
      if (value) {
        data = {
          user_id:JSON.parse(value).user.id,
          created_at: this.state.date
        }
        console.log(data);
        Services.getReports(data, (res)=>{
          console.log(res);
          this.setState({reportNumbers:res},()=>this.getCasesForToday())
        })
      }
    })
  }

  getCasesForToday(){
    Services.getCasesForToday((res)=>{
      this.setState({cases:res.casestoday, loading:false,isFetching:false},()=>this.getSurveyReports())
    })
  }
  getSurveyReports(){
    Services.getSurveyReports((res)=>{
      console.log(res);
      this.setState({surveyreports:res},()=>this.getTripadvisor())
    })
  }

  getTripadvisor(){
    Services.getTripadvisor((res)=>{
      console.log(res);
      this.setState({tripadvisor:res})
    })
  }

  goSingleCase(item){
    global.case = item
    this.props.navigation.navigate('singleCase')
  }

  createCase(){
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Case Creation') != undefined) {
        this.props.navigation.navigate('addCase')
      }else {
        Toast.show({text: 'You don\'t have permission for creating a case',duration:3000,})
      }
    }else {
      this.props.navigation.navigate('addCase')
    }
  }

  handleRefresh(){
    this.setState({isFetching:true})
    let today = new Date()
    this.setState({date:today.toISOString().split('T')[0],},()=>this.getReports())
  }

  renderSingleCase(item){
    return(
      <TouchableOpacity activeOpacity={1} onPress={()=>this.goSingleCase(item)} style={{backgroundColor:'#fff',paddingVertical:'4%',borderBottomWidth:1,borderBottomColor:'#ededed'}}>

        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{color:'#2c2c2c', fontSize:16, fontWeight:'bold'}}>{item.guest_name}</Text>
          <Text style={{color:'#8f8f8f', fontSize:12}}>{item.created_at}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
          <Text style={{color:'#2c2c2c', fontSize:14}}>Room No. {item.room_number+ '  '}</Text>

          {item.score!=null?(
            <Text style={{backgroundColor:item.score=='1'?'#e02020':item.score=='2'?'#fa6400':item.score=='3'?'#f9a71c':'#f9a71c',  color:'#fff',textAlign:'center', fontSize:10, alignSelf:'center', paddingVertical:2, paddingHorizontal:8,borderRadius:10,overflow:'hidden' }}>
              {item.score}
            </Text>
          ):null}

        </View>
        {/* {item.surveytype!=null?(
          <Text style={{color:'#2c2c2c', fontSize:12}}>{item.surveytype.name}</Text>
          ):null}
        */}
        <Text numberOfLines={2} style={{color:'#787878', fontSize:12, textAlign:'left'}}>{item.comment}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container style={{backgroundColor:'#fff'}}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
        <View style={[styles.shadow,{paddingHorizontal:'5%',paddingTop:Platform.OS=='ios'?20:0,backgroundColor:Global.baseColor,flexDirection:'row',justifyContent:'space-between', borderBottomWidth: 0,height:Platform.OS == 'ios'?height*.12:height*.08,shadowOffset:{width:0,height:5},shadowOpacity:.15}]}>
          <View style={{width:30}}/>
          <Image source={Logo} style={{width:width*.25,height:height*.06, resizeMode:'contain',alignSelf:'center',}}/>
          <Icon onPress={()=>this.createCase()} name='plus' style={{fontSize:23, color:'#2c2c2c',alignSelf:'center',}}/>
        </View>


        <Content
          refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={()=>this.handleRefresh()}/>}
        >
          {this.state.hasPermission?(
            <View>
              {this.state.loading?(
                <ActivityIndicator style={{marginTop:height*.35}} size="small" color={Global.baseColor} />
              ):(

                <View style={{paddingBottom:PixelRatio.get()==2?height*.04:10}}>
                  <Text style={{fontSize:20,color:'#000000', paddingVertical:'4%',paddingHorizontal:'4%' }}>Today’s Summary</Text>

                  <CircleChart
                    caseNumber={this.state.reportNumbers.casesnumber}
                    reslutionTime={this.state.reportNumbers.Reslution_time}
                    casespercentage={this.state.reportNumbers.casespercentage}
                    TotalPercantageResolutionTime={this.state.reportNumbers.TotalPercantageResolutionTime}
                    surveycount={this.state.surveyreports.surveycount}
                    avarage={this.state.surveyreports.avarage}
                    percentageForSurveycount={this.state.surveyreports.percentage}
                    percentageForSurveycountScore={this.state.surveyreports.percentage_score}
                    recoveryRate={this.state.surveyreports.recovery_rate?this.state.surveyreports.recovery_rate:0}
                    tripadvisor={this.state.tripadvisor}
                  />

                  <Text style={{fontSize:20,color:'#000000', paddingVertical:'4%',paddingHorizontal:'4%'}}>Today’s Cases</Text>

                  <View style={{paddingHorizontal:'4%'}}>

                    {this.state.cases.length==0?(
                      <Text style={{fontSize:14, textAlign:'center', color:'#787878', marginTop:height*.05}}>No case for today</Text>
                    ):(
                      <FlatList bounces={false}
                        data={this.state.cases}
                        renderItem={({item})=>this.renderSingleCase(item)}
                        extraData={this.state}
                        keyExtractor={(item,index)=> index.toString()}
                      />
                    )}
                  </View>
                </View>
              )}
            </View>
          ):(
            <View style={{alignSelf:'center', marginTop:height*.2}}>
              <Icon name='eye-off-outline' style={{textAlign:'center',fontSize:30, marginBottom:height*.01}}/>
              <Text style={{fontSize:13}}>You don't have permission for viewing content</Text>
            </View>
          )}

        </Content>
        <BottomTabs navigation={this.props.navigation} />
      </Container>
      )
    }
  }

  export default Home;
