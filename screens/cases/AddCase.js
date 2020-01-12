import React, {Component} from 'react';
import { Platform, Dimensions, View, Image, StatusBar, AsyncStorage, TouchableOpacity, Alert, Text, BackHandler, ActivityIndicator, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Item, Input, Toast, CheckBox, Form, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Global} from './../../core/Global'
import Services from './../../services/Services'
import Spinner from 'react-native-loading-spinner-overlay'
import Logo from './../../assets/images/logo.png'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import {MenuProvider,Menu,MenuOptions,MenuOption,MenuTrigger } from 'react-native-popup-menu'
import Modal from "react-native-modal"

var { width, height } = Dimensions.get('window');



class AddCase extends Component{
  constructor(props){
    super(props)
    this.state = {
      name:'',
      room_number:'',
      score:'Score',
      comment:'',
      wrongName:'',
      wrongSurvey:'',
      wrongComment:'',
      wrongRoom:'',
      surveyType:[],
      getLoading:false,
      type:'Case Type',
      typeId:'',
      wrongType:'',
      employees:[],
      assignItem:'Assgin to',
      assginId:'',
      wrongAssgin:'',
    }
  }

  componentDidMount(){
    this.props.navigation.addListener ('willFocus',()=>{
      this.getSurveytype()
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

  getSurveytype(){
    this.setState({getLoading:true})
    Services.getSurveytype((res)=>{
      console.log(res);
      this.setState({surveyType:res.types},()=>this.getEmployees())
    })
  }

  getEmployees(){
    Services.getEmployees((res)=>{
      this.setState({employees:res.Employees, getLoading:false, selectedEmpolyee:''})
    })
  }


  handleOnChange = x => (event) =>{
    switch (x) {
      case 'name':
      this.setState({name: event.nativeEvent.text, wrongName:'',})
      break
      case 'room_number':
      this.setState({room_number: event.nativeEvent.text, wrongRoom:'',})
      break
      case 'comment':
      this.setState({comment: event.nativeEvent.text, wrongComment:'',})
      break
    }
  }
  handleOnChangeMenu(item, type){
    if (type == 'type') {
      this.setState({type:item.name, typeId:item.id, wrongType:''})
    }else if (type == 'assign') {
      this.setState({assignItem:item.name, assginId:item.id, wrongAssgin:''})
    }else {
      this.setState({score:item, wrongSurvey:''})
    }
  }


  addCase(){

    if (!this.state.name.replace(/\s/g, '').length) {
      this.setState({wrongName:'Enter name'})
    }else if (!this.state.room_number.replace(/\s/g, '').length) {
      this.setState({wrongRoom:'Enter room number'})
    }else if (!this.state.comment.replace(/\s/g, '').length) {
      this.setState({wrongComment:'Enter comment'})
    }else if (this.state.typeId == '') {
      this.setState({wrongType:'Choose Case Type'})
    }else{
      AsyncStorage.getItem('userData').then((value)=>{
        if (value) {
          let data = {
            guest_name: this.state.name,
            room_number: this.state.room_number,
            comment: this.state.comment,
            status:'Open',
            // score:parseInt(this.state.score),
            user_id:JSON.parse(value).user.id,
            type:this.state.typeId,
            // assignedto_id: this.state.assginId
          }
          if (this.state.assginId != '') {
            data.assignedto_id = this.state.assginId
          }
          console.log(data);
          this.setState({loading:true})
          Services.createCase(data, (res)=>{
            this.setState({loading:false},()=>this.props.navigation.goBack())
          })
        }
      })
    }
  }



  render() {
    return (
      <Container>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS=='ios'?'':'padding'}
          style={{flex:1}}>
          <View style={{paddingHorizontal:'5%',flexDirection:'row',justifyContent:'space-between', marginTop:Platform.OS=='ios'?height*.07:height*.03}}>
            <Icon name='arrow-left' style={{fontSize:20, color:'#000'}} onPress={()=>this.props.navigation.goBack()} />
            <Text style={{alignSelf:'center',color:'#363636',fontSize:18,paddingBottom:10, alignSelf:'flex-end'}}>Create Case</Text>
            <View style={{width:30}}/>
          </View>

          <Content bounces={false} contentContainerStyle={{paddingHorizontal:'5%',backgroundColor:'#fff'}}>








            <Item stackedLabel  style={{borderBottomWidth:0,marginTop:height*.03}}>
              <Label style={{fontSize:16,color:'#2c2c2c',textAlign:'left', marginBottom:-8}}>Guest Name <Text style={{color:'#ec3323'}}>*</Text></Label>
              <Input
                placeholder='Ex. Guest Name'
                placeholderTextColor="#a3acb5"
                onChange={this.handleOnChange('name')}
                value={this.state.name}
                selectionColor={Global.baseColor}
                autoCapitalize = 'none'
                style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#777',}}
              />
            </Item>
            {this.state.wrongName!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongName}</Text>
            ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>



            <Item stackedLabel style={{borderBottomWidth:0,}}>
              <Label style={{fontSize:16,color:'#2c2c2c',textAlign:'left', marginBottom:-8}}>Room Number <Text style={{color:'#ec3323'}}>*</Text></Label>
              <Input
                placeholder='Ex. T150'
                placeholderTextColor="#a3acb5"
                onChange={this.handleOnChange('room_number')}
                value={this.state.room_number}
                selectionColor={Global.baseColor}
                autoCapitalize = 'none'
                style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#777',}}
              />
              {this.state.wrongRoom!=''?(
                <Text style={{paddingHorizontal:'2%',fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10,width:'100%'}}>{this.state.wrongRoom}</Text>
              ):null}
            </Item>

            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>




            <Item stackedLabel  style={{borderBottomWidth:0,}}>
              <Label style={{fontSize:16,color:'#2c2c2c',textAlign:'left', marginBottom:-8}}>Guest Comment <Text style={{color:'#ec3323'}}>*</Text></Label>
              <Input
                multiline={true}
                placeholder='write the guest comment'
                placeholderTextColor="#a3acb5"
                onChange={this.handleOnChange('comment')}
                value={this.state.comment}
                selectionColor={Global.baseColor}
                autoCapitalize = 'none'
                style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#777',}}
              />
            </Item>
            {this.state.wrongComment!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongComment}</Text>
            ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>


            {/* <Menu style={{marginLeft:-10}}>

              <MenuTrigger style={{alignItems:'flex-start',borderColor:'grey',padding:15,marginBottom:height*0.017}}>
                <Text style={{fontSize:16,color:this.state.score!='Score'?'#777':'#000'}}>{this.state.score}</Text>
                <Icon name="chevron-down" style={{position:'absolute',top:height*0.03,right:width*0.07,fontSize:20}}/>
              </MenuTrigger>

              <MenuOptions customStyles={optionsStyles}>

                <MenuOption value='1' text='1' onSelect={value => this.handleOnChangeMenu(value,'se')}/>
                <MenuOption value='2' text='2' onSelect={value => this.handleOnChangeMenu(value,'se')}/>
                <MenuOption value='3' text='3' onSelect={value => this.handleOnChangeMenu(value,'se')}/>
                <MenuOption value='4' text='4' onSelect={value => this.handleOnChangeMenu(value,'se')}/>
                <MenuOption value='5' text='5' onSelect={value => this.handleOnChangeMenu(value,'se')}/>
              </MenuOptions>
              </Menu>
              {this.state.wrongSurvey!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongSurvey}</Text>
              ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/> */}


            {this.state.getLoading?(
              <ActivityIndicator  size="small" color={Global.baseColor} />
            ):(
              <Menu style={{marginLeft:-10}}>

                <MenuTrigger style={{alignItems:'flex-start',borderColor:'grey',padding:15,marginBottom:height*0.017}}>
                  <Text style={{fontSize:16,color:this.state.type!='Case Type'?'#777':'#000'}}>{this.state.type}</Text>
                  <Icon name="chevron-down" style={{position:'absolute',top:height*0.03,right:width*0.07,fontSize:20}}/>
                </MenuTrigger>

                <MenuOptions customStyles={optionsStyles}>
                  {this.state.surveyType.map((item, index)=>(
                    <MenuOption key={index} value={item.id} text={item.name} onSelect={value => this.handleOnChangeMenu(item, 'type')}/>
                  ))}
                </MenuOptions>
              </Menu>
            )}

            {this.state.wrongType!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongType}</Text>
            ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>


            <Menu style={{marginLeft:-10}}>
              <MenuTrigger style={{alignItems:'flex-start',borderColor:'grey',padding:15,marginBottom:height*0.017}}>
                <Text style={{fontSize:16,color:this.state.type!='Case Type'?'#777':'#000'}}>{this.state.assignItem}</Text>
                <Icon name="chevron-down" style={{position:'absolute',top:height*0.03,right:width*0.07,fontSize:20}}/>
              </MenuTrigger>

              <MenuOptions customStyles={optionsStyles}>


                <ScrollView contentContainerStyle={{flex:1}} nestedScrollEnabled={true} >
                  {this.state.employees.map((item, index)=>(
                    <MenuOption key={index} value={item.id} text={item.name}  onSelect={value => this.handleOnChangeMenu(item, 'assign')}/>
                  ))}
                </ScrollView>

              </MenuOptions>
            </Menu>
            {this.state.wrongAssgin!=''?(
              <Text style={{fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongAssgin}</Text>
            ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>




            <Button onPress={()=>this.addCase()} full style={{height:height*.08, backgroundColor:Global.baseColor, marginTop:height*.015, borderRadius:4, marginBottom:height*.03,width:'90%', alignSelf:'center', elevation:0}}>
              {this.state.loading?(
                <ActivityIndicator size="small" color='#1d1d1d' />
              ):(
                <Text style={{fontFamily:'OpenSans-Regular',  color:'#1d1d1d', fontSize:16, textAlign:'center'}}>Create Case</Text>
              )}
            </Button>
          </Content>


        </KeyboardAvoidingView>
        </Container>
    )
  }

  renderModalContent(){
    return(
      <View style={{backgroundColor:'#fff', height:height*.6,borderRadius:5,width:'80%', alignSelf:'center'}}>
        <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({visibleModal:false})} style={{flexDirection:'row',padding:15, justifyContent:'space-between', borderBottomColor:'#ededed', borderBottomWidth:1}}>
          <Text style={{ fontSize:18}}>X</Text>
          <Text style={{fontSize:16, color:'#2c2c2c'}}>All Employees</Text>
          <View />
        </TouchableOpacity>

        <FlatList
          data={this.state.employees}
          renderItem={({item})=>(
            <Text onPress={()=>this.setSelectedEmpolyee(item)} style={{paddingVertical:10, borderBottomColor:'#ededed', borderBottomWidth:.5, backgroundColor:this.state.selectedEmpolyee.id == item.id? Global.baseColor:'#fff'}}>{item.name}</Text>
          )}
          extraData={this.state}
          keyExtractor={(item,index)=> index.toString()}
          contentContainerStyle={{paddingHorizontal:'5%'}}
        />

        <TouchableOpacity activeOpacity={1} onPress={()=>this.assignToSelectedEmpolyee()} style={{alignSelf:'center',marginVertical:height*.02, backgroundColor:Global.baseColor,width:'80%', paddingVertical:10, borderRadius:6}}>
          <Text style={{alignSelf:'center', fontSize:16, color:'#1d1d1d'}}>Assign</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default AddCase

const optionsStyles = {
  optionsContainer: {
    paddingVertical:height*.01,
    width:width*.92,
    alignSelf:"center",
    marginLeft:0,
    backgroundColor:'white',
    borderRadius:10,
    paddingHorizontal:10,
    paddingBottom:8,
    marginLeft:height*.01,
    maxHeight:height*.5,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'black',
    fontSize:14,
  },
}
