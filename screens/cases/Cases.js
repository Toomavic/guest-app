import React from 'react'
import { Platform, StyleSheet, StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image, Dimensions, TouchableOpacity, FlatList, ImageBackground, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { Container, Content, Button, Item, Input, Badge, Toast } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay'
import Swiper from 'react-native-swiper'
import {Global} from './../../core/Global'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import RoundCheckbox from 'rn-round-checkbox'
import Modal from "react-native-modal"
import DatePicker from 'react-native-datepicker'
import moment from 'moment'

import SearchImg from './../../assets/images/search.png'
import ReopenImg from './../../assets/images/arrow-repeatpng.png'
import CloseImg from './../../assets/images/close.png'
import DeleteImg from './../../assets/images/delete.png'

import Header from './../../components/Header'

import BottomTabs from './../../components/BottomTabs'
import Services from './../../services/Services'
import styles from './../../assets/style/Style'
import Logo from './../../assets/images/logo.png'

var { width, height } = Dimensions.get('window')

class Cases extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      cases:[],
      editIsOn:false,
      loading:true,
      search:'',
      noData:['empty'],
      status:'',
      sortBy:'',
      dateRange:'',
      dateFrom:'set date',
      dateTo:'set date',
      date:new Date(),
      selectedCasesArray:[],
      isFetching:false,
      date:"2016-05-15"
    }
  }

  componentDidMount(){
    this.props.navigation.addListener ('willFocus',()=>{
      this.setState({editIsOn:false},()=>this.getCases())
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
  handleOnChangeInputs = () => (event) =>{
    // let reg = /^[1-9]\d*(\.\d+)?$/
    // const re = /^[0-9\b]+$/;
    const newData = this.state.cases.filter(item => {
      const isNumber = item.room_number.toString()
      const isText =  item.guest_name.toString()
      const textData = event.nativeEvent.text
      if (Number(parseFloat(textData))) {
        return isNumber.indexOf(textData) > -1
      }else {
        return isText.indexOf(textData) > -1
      }
    })
    console.log(newData);
    this.setState({ noData: newData,search: event.nativeEvent.text })
  }

  getCases(){
    // this.setState({loading:true})
    Services.getCases((res)=>{
      // let arr = []
      for (var i = 0; i < res.length; i++) {
        res[i].select = false
      }
      if (res.msg != 'not Auth') {
        this.setState({isFetching:false,loading:false, cases:res})
      }else {
        this.setState({isFetching:false,loading:false, cases:[]})
      }

    })
  }
  handleRefresh(){
    this.setState({isFetching:true})
    this.getCases()
  }


  toggleEdit(){
    this.setState({editIsOn: !this.state.editIsOn})
  }

  setCaseSelect(val, id){
    let arr = this.state.cases
    let selectedCasesArray = []
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        arr[i].select = val
      }
      if (arr[i].select) {
        selectedCasesArray.push(arr[i].id)
      }
    }
    console.log(selectedCasesArray);
    this.setState({cases:arr, selectedCasesArray: selectedCasesArray},()=>this.forceUpdate())
  }
  selectAll(){
    let arr = this.state.cases
    for (var i = 0; i < arr.length; i++) {
      arr[i].select = true
    }
    this.setState({cases:arr},()=>this.forceUpdate())
  }
  cancel(){
    this.toggleEdit()
    let arr = this.state.cases
    for (var i = 0; i < arr.length; i++) {
      arr[i].select = false
    }
    this.setState({cases:arr},()=>this.forceUpdate())
  }

  setSort(type){
    this.setState({sortBy:type})
  }
  setStatus(type){
    this.setState({status:type})
  }
  setDateRange(type){
    this.setState({dateRange:type})
  }
  clearFilter(){
    this.setState({sortBy:'',status:'',dateRange:'',dateFrom:'set date',dateTo:'set date'},()=>this.getCases(),this.toggleModalFilter())
  }

  setDate(type){
    this.setState({dateRange:'range'})
    if (type=='from') {
      console.log(this.state.date);
      this.setState({dateFrom:this.state.date.toISOString().split('T')[0]})
    }else {
      this.setState({dateTo:this.state.date.toISOString().split('T')[0]})
    }
  }

  goSingleCase(item){
    global.case = item
    this.props.navigation.navigate('singleCase')
  }

  multiCasesAction(type){
    if (type == 'reopen') {
      if (global.userType != 'user') {
        if (global.permissions.find(x => x.key == 'Reopen closed cases') != undefined) {
          this.doAction(type)
        }else {
          Toast.show({text: 'You don\'t have permission for reopen closed case',duration:3000,})
        }
      }else {
        this.doAction(type)
      }
    }else {
      if (global.userType != 'user') {
        if (global.permissions.find(x => x.key == 'Close Case') != undefined) {
          this.doAction(type)
        }else {
          Toast.show({text: 'You don\'t have permission for close a case',duration:3000,})
        }
      }else {
        this.doAction(type)
      }
    }

  }

  doAction(type){
    if (this.state.selectedCasesArray.length == 0) {
      Toast.show({text:'Select one case at least',duration:2000,type:"denger"})
    }else {
      this.setState({loading:true})
      Services.multiCasesAction(type ,this.state.selectedCasesArray, (res)=>{
        console.log(res);
        if (res.status) {
          this.setState({loading:false, selectedCasesArray:[], editIsOn:false})
          this.getCases()
          // Toast.show({text:res.msg,duration:3000,type:"success"})
        }
      })
    }
  }

  applyFilter(){
    let data = {}
    if (this.state.status == 'none' || this.state.dateRange == 'none') {
      this.setState({sortBy:'',status:'',dateRange:'',dateFrom:'set date',dateTo:'set date'},()=>this.getCases(),this.toggleModalFilter())
      return true
    }

    if (this.state.sortBy != '') {
      data.sortby = this.state.sortBy
    }
    if (this.state.status != '' && this.state.status != 'none') {
      data.status = this.state.status
    }

    if (this.state.dateRange != '' && this.state.dateRange != 'none') {
      if (this.state.dateRange == 'range') {
        this.state.dateFrom != 'set date' ? data.date_from = this.state.dateFrom : null
        this.state.dateTo != 'set date' ? data.date_to = this.state.dateTo : null
      }else {
        console.log(3);
        data.type = this.state.dateRange
      }
    }


    console.log(data);

    if (Object.entries(data).length != 0) {
      console.log(1);
      this.setState({loadingfliter:true})
      Services.filter(data, (res)=>{
        console.log(res);
        this.setState({loadingfliter:false, cases:res.filters,sortBy:'',status:'',dateRange:'',dateFrom:'set date',dateTo:'set date'},()=>this.toggleModalFilter())
      })
    }else {
      alert('Select at least one option')
    }
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


  toggleModalFilter(){
    this.setState({ visibleModal:!this.state.visibleModal})
  }
  setModal(bool){
    this.setState({visibleModal:bool})
  }
  openDatePicker(type){
    if (Platform.OS == 'ios') {
      this.toggleModalFilter()
      this.setState({dateRange:'range'})
      setTimeout(()=>{
        type == 'from' ? this.dateFromFilter.onPressDate() : this.dateToFilter.onPressDate()
      },600)
    }else {
      type == 'from' ? this.dateFromFilter.onPressDate() : this.dateToFilter.onPressDate()
    }
  }






    render() {
      return (
        <Container style={{backgroundColor:'#f6f6f6'}}>
          <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />
          {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{writingDirection:'ltr',  color: '#FFF'}} size='large'/> */}
          <View style={[styles.shadow,{paddingTop:Platform.OS=='ios'?20:0,paddingHorizontal:'5%', backgroundColor:Global.baseColor,flexDirection:'row',justifyContent:'space-between',borderBottomWidth: 0,height:Platform.OS == 'ios'?height*.12:height*.08,shadowOffset:{width:0,height:5},shadowOpacity:.15}]}>

            {this.state.editIsOn?(
              <Text style={{fontSize:14,alignSelf:'center', color:'#2c2c2c', marginRight:'11%'}} onPress={()=>this.selectAll()}>Select All</Text>
            ):(
              <Text style={{fontSize:14,alignSelf:'center', color:'#2c2c2c', marginRight:'11%'}} onPress={()=>this.toggleEdit()}>Edit</Text>
            )}

            <Text style={{color:'#363636',fontSize:18,alignSelf:'center',}}>All Cases </Text>
            <View style={{flexDirection:'row', alignSelf:'center',}}>
              <Icon name='filter-outline' style={{fontSize:20, color:'#363636', marginRight:10}} onPress={()=>this.toggleModalFilter()}/>
              <Icon name='plus' style={{fontSize:20, color:'#363636',}} onPress={()=>this.createCase()}/>
            </View>
          </View>

          <Item regular style={{paddingHorizontal:'2%',borderRadius:4,borderWidth:0, borderColor:'#fff', backgroundColor:'#fff', height:height*.07}}>
            <Image source={SearchImg} style={{width:17,height:17, resizeMode:'contain', marginLeft:'4%', marginRight:'2%',}}/>
            <Input
              placeholder='Enter room number'
              placeholderTextColor="#787878"
              onChange={this.handleOnChangeInputs()}
              value={this.state.search}
              selectionColor={'#3897F1'}
              // keyboardType='numeric'
              autoCapitalize = 'none'
              style={{fontFamily:'OpenSans-Regular',fontSize:12, textAlign:'left', color:'#252631',}}
            />
            {this.state.search != ''?(
              <Text onPress={()=>this.setState({search:'',noData:['empty']})} style={{color:'#2c2c2c', marginRight:10, fontSize:12}}>Cancel</Text>
            ):null}

          </Item>


          <Content
            contentContainerStyle={{backgroundColor:'#f6f6f6'}}
            refreshControl={<RefreshControl refreshing={this.state.isFetching} onRefresh={()=>this.handleRefresh()}/>}
          >
            {this.state.loading?(
              <ActivityIndicator style={{marginTop:height*.35}} size="small" color={Global.baseColor} />
            ):(
              <View>

                {this.state.noData.length == 0 ||  this.state.cases.length == 0? (
                  <Text style={{color:'#777',fontSize:15,paddingVertical:7,textAlign:'center', marginTop:height*.2}}>
                    There is no cases with this number
                  </Text>
                ):(
                  <View>
                    {/* <Text style={{paddingHorizontal:'4%', fontSize:18,color:'#000000',paddingVertical:'4%'}}>Today</Text> */}
                    <FlatList bounces={false}
                      data={this.state.cases.filter(item => item.room_number.toString().includes(this.state.search.toLowerCase()) || item.guest_name.toString().includes(this.state.search.toLowerCase()))}
                      renderItem={({item})=>this.renderSingleCase(item)}
                      extraData={this.state}
                      keyExtractor={(item,index)=> index.toString()}
                    />
                  </View>
                )}
              </View>
            )}

            <DatePicker
              style={{width: 0, height: 0}}
              showIcon={false}
              customStyles={{dateInput: {width: 0,height: 0,borderWidth: 0},btnTextConfirm:{color: '#0365d6'}}}
              ref={(ref)=>this.dateFromFilter = ref}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => this.setState({dateFrom:date},()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o'))}
              onCloseModal={()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o')}
            />
            <DatePicker
              style={{width: 0, height: 0}}
              showIcon={false}
              customStyles={{dateInput: {width: 0,height: 0,borderWidth: 0},btnTextConfirm:{color: '#0365d6'}}}
              ref={(ref)=>this.dateToFilter = ref}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => this.setState({dateTo:date},()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o'))}
              onCloseModal={()=>Platform.OS=='ios'?setTimeout(()=>{this.setModal(true)},300):console.log('o')}
            />

          </Content>
          {this.state.editIsOn?(
            <View style={{flexDirection:'row', backgroundColor:'#fff', justifyContent:'space-around', paddingVertical:18, paddingBottom:Platform.OS=='ios'?32:18}}>
              <Text onPress={()=>this.multiCasesAction('reopen')}><Image source={ReopenImg} style={{width:13,height:15}} resizeMethod='resize'/>  Reopen</Text>
              <Text onPress={()=>this.multiCasesAction('close')}><Image source={CloseImg} style={{width:15,height:15, resizeMode:'contain'}}/>  Close</Text>
              {/* <Text onPress={()=>this.multiCasesAction('id')}><Image source={DeleteImg} style={{width:15,height:15, resizeMode:'contain'}}/>  Delete</Text> */}
              <Text style={{color:'#f25851'}} onPress={()=>this.cancel()}>Cancel</Text>
            </View>
          ):(
            <BottomTabs navigation={this.props.navigation} />
          )}

          <Modal isVisible={this.state.visibleModal} style={{justifyContent: 'flex-end',margin: 0,}} >
            {this.renderModalContent()}
          </Modal>
        </Container>
      )
    }


      renderModalContent(){
        return(
          <View style={{backgroundColor:'#fff', height:height*.7,}}>
            <View style={{flexDirection:'row', justifyContent:'space-between',paddingVertical:10,marginTop:5, borderBottomColor:'#ededed',borderBottomWidth:1,paddingHorizontal:15}}>
              <Icon name='close' onPress={()=>this.toggleModalFilter()} style={{fontSize:20, paddingHorizontal:10, color:'#000'}}/>
              <Text style={{fontSize:16, color:'#2c2c2c'}}>Filters</Text>
              <Text onPress={()=>this.clearFilter()} style={{fontSize:14, color:'#2c2c2c'}}>Clear All</Text>
            </View>
            <View style={{paddingHorizontal:15}}>

              {/* sort by */}
              {/* <View style={{borderBottomColor:'#ededed',borderBottomWidth:1,marginTop:height*.02}}>
                <Text style={{fontSize:14, color:'#2c2c2c'}}>Sort by</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical:height*.03,}}>
                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setSort('Low')} style={{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                <RoundCheckbox
                size={12} checked={this.state.sortBy=='Low'?true:false}
                backgroundColor={Global.baseColor}
                onValueChange={(v) => this.setSort('Low')}
                />
                <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>Low - High</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setSort('High')} style={{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                <RoundCheckbox
                size={12} checked={this.state.sortBy=='High'?true:false}
                backgroundColor={Global.baseColor}
                onValueChange={(v) => this.setSort('High')}
                />
                <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>High - Low</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {/* Status */}



              <View style={{borderBottomColor:'#ededed',borderBottomWidth:1,marginTop:height*.02}}>
                <Text style={{fontSize:14, color:'#2c2c2c'}}>Status</Text>
                <View style={{flexDirection:'row', justifyContent:'center', paddingVertical:height*.03, marginTop:-5}}>
                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setStatus('none')} style={{paddingVertical:height*.008,paddingHorizontal:width*.05,backgroundColor:this.state.status=='none'?'#f6f9fc':'#fff', borderRadius:6, overflow:'hidden'}}>
                    <Text style={{fontSize:12,color:'#58585f',}}>All</Text>
                  </TouchableOpacity>
                  <Text onPress={()=>this.setStatus('close')} style={{paddingVertical:height*.008,paddingHorizontal:width*.05,fontSize:12,color:'#58585f', backgroundColor:this.state.status=='close'?'#f6f9fc':'#fff', borderRadius:6, overflow:'hidden'}}>Closed</Text>
                  <Text onPress={()=>this.setStatus('assigned')} style={{paddingVertical:height*.008,paddingHorizontal:width*.05,fontSize:12,color:'#58585f', backgroundColor:this.state.status=='assigned'?'#f6f9fc':'#fff', borderRadius:6, overflow:'hidden'}}>Assigned</Text>
                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setStatus('open')} style={{paddingVertical:height*.008,paddingHorizontal:width*.05,backgroundColor:this.state.status=='open'?'#f6f9fc':'#fff', borderRadius:6, overflow:'hidden'}}>
                    <Text style={{fontSize:12,color:'#58585f',}}>Open</Text>
                  </TouchableOpacity>
                </View>
              </View>


              {/* Date Range */}
              <View style={{marginTop:height*.02}}>
                <Text style={{fontSize:14, color:'#2c2c2c'}}>Date Range</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:height*.03}}>
                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setDateRange('none')} style={{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                    <RoundCheckbox
                      size={16} checked={this.state.dateRange=='none'?true:false}
                      backgroundColor={Global.baseColor}
                      onValueChange={(v) => this.setDateRange('none')}
                    />
                    <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setDateRange('week')} style={{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                    <RoundCheckbox
                      size={16} checked={this.state.dateRange=='week'?true:false}
                      backgroundColor={Global.baseColor}
                      onValueChange={(v) => this.setDateRange('week')}
                    />
                    <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>Week</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} onPress={()=>this.setDateRange('month')} style={{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                    <RoundCheckbox
                      size={16} checked={this.state.dateRange=='month'?true:false}
                      backgroundColor={Global.baseColor}
                      onValueChange={(v) => this.setDateRange('month')}
                    />
                    <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>Month</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={()=>this.setDateRange('range')} style={{flexDirection:'row', paddingHorizontal:0}}>
                  <RoundCheckbox
                    size={16} checked={this.state.dateRange=='range'?true:false}
                    backgroundColor={Global.baseColor}
                    onValueChange={(v) => this.setDateRange('range')}
                  />
                  <Text style={{marginLeft:10,marginTop:-3,fontSize:12,color:'#58585f'}}>From / To </Text>
                </TouchableOpacity>


                <View style={{backgroundColor:'#ffffffed',borderRadius:15,paddingVertical:'3%', width:width*.8, alignSelf:'center', paddingHorizontal:'5%'}}>
                  <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>this.openDatePicker('from')}>
                      <Text style={{fontSize:14,textAlign:'center',color:'#58585f'}}><Icon name='calendar' style={{fontSize:14}}/> {' '+'From'}</Text>
                      <Text style={{fontSize:12,textAlign:'center',color:'#58585f'}}>{this.state.dateFrom}</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:18}}>:</Text>
                    <TouchableOpacity activeOpacity={1} onPress={()=>this.openDatePicker('to')}>
                      <Text style={{fontSize:14,textAlign:'center',color:'#58585f'}}><Icon name='calendar' style={{fontSize:14}}/> {' '+'To'}</Text>
                      <Text style={{fontSize:12,textAlign:'center',color:'#58585f'}}>{this.state.dateTo}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>

            </View>
            <TouchableOpacity activeOpacity={1} style={{width:'85%',backgroundColor:Global.baseColor,justifyContent:'center', alignSelf:'center',height:height*.08,borderRadius:6, marginTop:height*.09, flexDirection:"row"}} onPress={()=>this.applyFilter()}>
              {this.state.loadingfliter?(
                <ActivityIndicator size="small" color='#000' />
              ):null}
              <Text style={{alignSelf:'center', fontSize:16, color:'#1d1d1d'}}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        )
      }

      renderSingleCase(item){
        return(
          <View style={{flexDirection:'row'}}>
            {this.state.editIsOn?(
              <View style={{alignSelf:'center', marginHorizontal:10}}>
                <RoundCheckbox
                  size={20} checked={item.select}
                  backgroundColor={Global.baseColor}
                  onValueChange={(v) => this.setCaseSelect(v, item.id)}
                />
              </View>
            ):null}

            <TouchableOpacity activeOpacity={1} onPress={()=>this.goSingleCase(item)} style={{backgroundColor:'#fff',paddingTop:'4%', width:width, paddingHorizontal:'4%'}}>

              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#2c2c2c', fontSize:16, fontWeight:'bold'}}>{item.guest_name}</Text>
                <Text style={{color:'#8f8f8f', fontSize:12}}>{item.created_at}</Text>
              </View>

              <View style={{flexDirection:'row', justifyContent:'flex-start',}}>
                <Text style={{color:'#2c2c2c', fontSize:14}}>Room No. {item.room_number+ '  '}</Text>
                {item.score!=null?(
                  <Text style={{backgroundColor:item.score=='1'?'#e02020':item.score=='2'?'#fa6400':item.score=='3'?'#f9a71c':'#f9a71c',  color:'#fff',textAlign:'center', fontSize:10, alignSelf:'center', paddingVertical:2, paddingHorizontal:8,borderRadius:10,overflow:'hidden' }}>
                    {item.score}
                  </Text>
                ):null}

              </View>
              {/* {item.surveytype!=null?(
                <Text style={{color:'#2c2c2c', fontSize:12}}>{item.surveytype.name}</Text>
              ):null} */}

              <Text numberOfLines={2} style={{color:'#787878', fontSize:12,borderBottomWidth:1,borderBottomColor:'#ededed', paddingBottom:'4%', textAlign:'left'}}>{item.comment}</Text>
            </TouchableOpacity>
            </View>
          )
        }



  }

  export default Cases;
