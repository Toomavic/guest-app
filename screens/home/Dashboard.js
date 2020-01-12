import React from 'react'
import { Platform, StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image, Dimensions, TouchableOpacity, FlatList, ImageBackground, ScrollView, ActivityIndicator, PixelRatio, RefreshControl } from 'react-native'
import { Container, Content, Button, Toast, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Spinner from 'react-native-loading-spinner-overlay'
import Swiper from 'react-native-swiper'
import Logo from './../../assets/images/logo.png'
import styles from './../../assets/style/Style'
import { Global } from './../../core/Global'
import moment from 'moment'



import PureChart from 'react-native-pure-chart'
import Services from './../../services/Services'
import BottomTabs from './../../components/BottomTabs'
import Header from './../../components/Header'
import CircleChart from './../../components/CircleChart'

import DatePicker from 'react-native-datepicker'
import Modal from "react-native-modal"

var { width, height } = Dimensions.get('window')




class Dashboard extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      tab:'today',
      chartArr:[],
      reportNumbers:'',
      loading:false,
      date:new Date(),
      dateText:'Today',
      isFetching:false,
      visibleModal:false,
      dateTo:'Set Date',
      dateFrom:'Set Date',
      hasPermission:true,
      surveyreports:[],
      tripadvisor:'',
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
    this.props.navigation.goBack()
    return true
  }

  checkHasPermission(){
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Report Generation') != undefined) {
        this.setState({hasPermission:true})
        let today = new Date()
        this.setState({date:today.toISOString().split('T')[0],tab:'today'},()=>this.getReports())
      }else {
        this.setState({hasPermission:false})
      }
    }else {
      let today = new Date()
      this.setState({date:today.toISOString().split('T')[0],tab:'today'},()=>this.getReports())
    }
  }

  toggleModal(){
    this.setState({visibleModal:!this.state.visibleModal})
  }
  setModal(bool){
    this.setState({visibleModal:bool})
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
        // return ;
        Services.getReports(data, (res)=>{

          console.log(res);
          this.setState({reportNumbers:res, visibleModal:false},()=>this.getSurveyReports())
        })
      }
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
      this.setState({tripadvisor:res},()=>this.getCasesReports(this.state.tab))
    })
  }

  getCasesReports(type){

    AsyncStorage.getItem('userData').then((value)=>{
      let data = {}
      if (value) {
        data = {
          user_id:JSON.parse(value).user.id,
          type: this.state.tab
        }
        if (type == 'withFilter') {
          if (this.state.dateFrom != 'Set Date') {
            data.from = this.state.dateFrom
          }
          if (this.state.dateTo != 'Set Date') {
            data.to = this.state.dateTo
          }
        }
        console.log(data);
        Services.getCasesReports(data, (res)=>{
          let sampleData = []
          if (this.state.tab == 'today') {
             sampleData = [
              {
                seriesName: 'survey',
                data: [
                  {x: moment(res.date).format("MMM DD"), y: res.survey},
                ],
                color: '#f8d053'
              },
              {
                seriesName: 'cases',
                data: [
                  {x: 'cases', y: res.cases},
                ],
                color: '#f55753'
              }
              ,
              {
                seriesName: 'cases_close',
                data: [
                  {x: 'cases_close', y: res.cases_close},
                ],
                color: '#10cfbd'
              }
            ]
          }else {
            let obj1 = {
              name:'survey',
              data:[],
              color: '#f8d053'
            }
            let obj2 = {
              name:'cases',
              data:[],
              color: '#f55753'
            }
            let obj3 = {
              name:'cases_close',
              data:[],
              color: '#10cfbd'
            }
            for (var i = 0; i < res.length; i++) {
              obj1.data.push({x:moment(res[i].date).format("MMM DD") , y:res[i].survey})
              obj2.data.push({x:moment(res[i].date).format("MMM DD") , y:res[i].cases})
              obj3.data.push({x:moment(res[i].date).format("MMM DD") , y:res[i].cases_close})
            }
            sampleData.push(obj1)
            sampleData.push(obj2)
            sampleData.push(obj3)
          }
          this.setState({loading2:false, chartArr:sampleData, isFetching:false, visibleModal:false, dateTo:'Set Date',dateFrom:'Set Date',})
        })
      }
    })
  }



  handleRefresh(){
    this.setState({isFetching:true})
    let today = new Date()
    this.setState({tab:'today'},()=>this.getReports())
  }

  openDatePicker(type){
    if (Platform.OS == 'ios') {
      this.toggleModal()
      setTimeout(()=>{
        type == 'from' ? this.dateFrom.onPressDate() : this.dateTo.onPressDate()
      },400)
    }else {
      type == 'from' ? this.dateFrom.onPressDate() : this.dateTo.onPressDate()
    }
  }

  render() {
    return (
      <Container style={{backgroundColor:'#fff'}}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
        {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{writingDirection:'ltr',  color: '#FFF'}} size='large'/> */}
        <Header
          title='Dashboard'
          rightSide={this.state.hasPermission?<Icon name='calendar-blank-outline' style={{fontSize:21,alignSelf:'flex-end', alignSelf:'center', color:'#2c2c2c'}} onPress={()=>this.toggleModal()}/>:''}
        />
        <Content
          refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={()=>this.handleRefresh()}/>}
        >
          {this.state.hasPermission?(
            <View>
              {this.state.loading?(
                <ActivityIndicator style={{marginTop:height*.35}} size="small" color={Global.baseColor} />
              ):(
                <View>
                  <Text style={{fontSize:20,color:'#000000',paddingVertical:'4%',paddingHorizontal:'4%'}}>{this.state.dateText}'s Summary</Text>

                  <CircleChart
                    caseNumber={this.state.reportNumbers.casesnumber}
                    reslutionTime={this.state.reportNumbers.Reslution_time}
                    casespercentage={this.state.reportNumbers.casespercentage}
                    TotalPercantageResolutionTime={this.state.reportNumbers.TotalPercantageResolutionTime}
                    surveycount={this.state.surveyreports.surveycount}
                    percentageForSurveycount={this.state.surveyreports.percentage}
                    percentageForSurveycountScore={this.state.surveyreports.percentage_score}
                    avarage={this.state.surveyreports.avarage}
                    recoveryRate={this.state.surveyreports.recovery_rate?this.state.surveyreports.recovery_rate:0}
                    tripadvisor={this.state.tripadvisor}
                  />
                  <Text style={{fontSize:18,color:'#000000',paddingVertical:'4%',paddingHorizontal:'4%'}}>Service Recovery</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:20,paddingHorizontal:'4%'}}>

                    <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({tab:'today'},()=>this.getCasesReports('today'))} style={{backgroundColor:this.state.tab=='today'?'#f5f9fb':'#fff', width:'33.33333%',borderRadius:5}}>
                      <Text style={{fontSize:12, color:'#000', textAlign:'center',paddingVertical:height*.01}}>Today</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({tab:'week'},()=>this.getCasesReports('week'))} style={{backgroundColor:this.state.tab=='week'?'#f5f9fb':'#fff', width:'33.33333%',borderRadius:5}}>
                      <Text style={{fontSize:12, color:'#000', textAlign:'center',paddingVertical:height*.01}}>Week</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({tab:'month'},()=>this.getCasesReports('month'))}
                      style={{backgroundColor:this.state.tab=='month'?'#f5f9fb':'#fff', width:'33.33333%', borderRadius:5, marginHorizontal:2}}>
                      <Text style={{fontSize:12, color:'#000', textAlign:'center',paddingVertical:height*.01}}>Month</Text>
                    </TouchableOpacity>

                  </View>



                  {this.state.loading2?(
                    <ActivityIndicator style={{marginTop:height*.05, height:height*.16}} size="small" color={Global.baseColor} />
                  ):(
                    <View style={{alignSelf:'center',  paddingHorizontal:20}}>
                      <PureChart
                        data={this.state.chartArr}
                        type='bar'
                        drawSelected={false}
                        height={height*.18}
                        width={300}
                        defaultColumnWidth={25}
                        defaultColumnMargin={15}
                        // numberOfYAxisGuideLine={5}
                      />
                    </View>
                  )}

                  {/* <View style={{flexDirection:'row',justifyContent:'space-between', paddingHorizontal:'15%', }}>
                    <Text style={{fontSize:10,color:'#aeaeae',}}>{this.state.tab}</Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}></Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}></Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}></Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}></Text>
                  </View> */}

                  <View style={{flexDirection:'row',justifyContent:'space-around', paddingHorizontal:'20%', borderTopColor:'#eee', borderTopWidth:1, paddingVertical:10, marginTop:4 ,paddingBottom:PixelRatio.get()==2?height*.04:10}}>
                    <Text style={{fontSize:10,color:'#aeaeae',}}><FontAwesome name='square' solid style={{fontSize:10,color:'#f8d053', alignSelf:'center'}}/>  Surveys</Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}><FontAwesome name='square' solid style={{fontSize:10,color:'#f55753', alignSelf:'center'}}/>  Cases</Text>
                    <Text style={{fontSize:10,color:'#aeaeae',}}><FontAwesome name='square' solid style={{fontSize:10,color:'#10cfbd', alignSelf:'center'}}/>  Closed Cases</Text>
                  </View>
                </View>
              )}

              <DatePicker
                style={{width: 0, height: 0}}
                showIcon={false}
                customStyles={{dateInput: {width: 0,height: 0,borderWidth: 0},btnTextConfirm:{color: '#0365d6'}}}
                ref={(ref)=>this.dateFrom = ref}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => this.setState({dateFrom:date},()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o'))}
                onCloseModal={()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o')}
              />
              <DatePicker
                style={{width: 0, height: 0}}
                showIcon={false}
                customStyles={{dateInput: {width: 0,height: 0,borderWidth: 0},btnTextConfirm:{color: '#0365d6'}}}
                ref={(ref)=>this.dateTo = ref}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => this.setState({dateTo:date},()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o'))}
                onCloseModal={()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o')}
              />
            </View>
          ):(
            <View style={{alignSelf:'center', marginTop:height*.2}}>
              <Icon name='eye-off-outline' style={{textAlign:'center',fontSize:30, marginBottom:height*.01}}/>
              <Text style={{fontSize:13}}>You don't have permission for viewing content</Text>
            </View>
          )}
        </Content>

        <Modal isVisible={this.state.visibleModal} backdropOpacity={.2} style={{justifyContent:'center',margin:0}} onBackdropPress={()=>this.toggleModal()}>
          {this.renderModalContent()}
        </Modal>
        <BottomTabs navigation={this.props.navigation} />
      </Container>
      )
    }


    renderModalContent(){
      return(
        <View style={{backgroundColor:'#ffffffed',borderRadius:15,paddingVertical:'3%', width:width*.8, alignSelf:'center', paddingHorizontal:'5%'}}>
          <Text style={{fontSize:18,textAlign:'center', marginVertical:height*.02}}>Select Date</Text>
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>
            <TouchableOpacity activeOpacity={1} onPress={()=>this.openDatePicker('from')}>
              <Text style={{fontSize:16,textAlign:'center'}}><Icon name='calendar' style={{fontSize:16}}/> {' '+'From'}</Text>
              <Text style={{fontSize:12,textAlign:'center'}}>{this.state.dateFrom}</Text>
            </TouchableOpacity>
            <Text style={{fontSize:18}}>:</Text>
            <TouchableOpacity activeOpacity={1} onPress={()=>this.openDatePicker('to')}>
              <Text style={{fontSize:16,textAlign:'center'}}><Icon name='calendar' style={{fontSize:16}}/> {' '+'To'}</Text>
              <Text style={{fontSize:12,textAlign:'center'}}>{this.state.dateTo}</Text>
            </TouchableOpacity>
          </View>
          <Button onPress={()=>this.getCasesReports('withFilter')} full style={{height:height*.06, backgroundColor:Global.baseColor, marginTop:height*.025, borderRadius:4, marginBottom:height*.01,width:'90%', alignSelf:'center', elevation:0}}>
            {this.state.loading?(
              <ActivityIndicator size="small" color='#1d1d1d' />
            ):(
              <Text style={{fontFamily:'OpenSans-Regular',  color:'#1d1d1d', fontSize:16, textAlign:'center'}}>Filter</Text>
            )}
          </Button>
        </View>
      )
    }
  }

  export default Dashboard;
