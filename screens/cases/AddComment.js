import React, {Component} from 'react';
import { Platform, Dimensions, View, Image, StatusBar, AsyncStorage, TouchableOpacity, Alert, Text, BackHandler, ActivityIndicator ,KeyboardAvoidingView} from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Item, Input, Toast, CheckBox, Form, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Global} from './../../core/Global'
import Services from './../../services/Services'
import Spinner from 'react-native-loading-spinner-overlay'
import Logo from './../../assets/images/logo.png'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import {MenuProvider,Menu,MenuOptions,MenuOption,MenuTrigger } from 'react-native-popup-menu'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import UploadImg from './../../assets/images/upload.jpeg'

var { width, height } = Dimensions.get('window');



class AddComment extends Component{
  constructor(props){
    super(props)
    this.state = {
      case:global.case,
      comment:'',
      wrongComment:'',
      loading:false,
      pickedImg:''
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



  handleOnChange = x => (event) =>{
    this.setState({comment: event.nativeEvent.text, wrongComment:'',})
  }


  attachMedia(index){
    if (index == 1) {
      this.openCamera()
    }else if (index == 2) {
      this.openGallery()
    }else {
      return true
    }
  }
  openCamera(){
    ImagePicker.openCamera({
      cropping: false,
      useFrontCamera:true,
      mediaType:'photo',
      compressImageQuality:.5,
    }).then(image => {
      this.setState({pickedImg:image},()=>this.attachMediaAS.hide())
      console.log(image);
    });
  }
  openGallery(){
    ImagePicker.openPicker({
      multiple: true,
      cropping: false,
      mediaType:'photo',
      maxFiles: 1,
      compressImageQuality:.5,
    }).then(image => {
      this.setState({pickedImg:image[0]},()=>this.attachMediaAS.hide())

    })
    .catch((error) => {
      console.log('onTakePhotoPress error bos hanaaaa')
      console.log(error)
    });
  }



  addComment(){
    if (!this.state.comment.replace(/\s/g, '').length) {
      this.setState({wrongComment:'Enter comment'})
    }else{
      AsyncStorage.getItem('userData').then((value)=>{
        if (value) {
          let data = new FormData()
          data.append('comment',this.state.comment);
          data.append('case_id',this.state.case.id);
          data.append('user_id',JSON.parse(value).user.id);
          data.append(`file`,{uri: this.state.pickedImg.path, type: 'image/jpeg', name: 'image.jpg'})
          this.setState({loading:true})
          Services.addComment(data, (res)=>{
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
        {/* <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF'}} size='large'/> */}
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{flex:1}}>
          <View style={{paddingHorizontal:'5%',flexDirection:'row',justifyContent:'space-between', marginTop:Platform.OS=='ios'?height*.07:height*.03}}>
            <Icon name='arrow-left' style={{fontSize:20, color:'#000'}} onPress={()=>this.props.navigation.goBack()} />
            <Text style={{alignSelf:'center',color:'#363636',fontSize:18,paddingBottom:10, alignSelf:'flex-end'}}>Add Comment</Text>
            <View style={{width:30}}/>
          </View>
          <Content bounces={false} contentContainerStyle={{paddingHorizontal:'5%',backgroundColor:'#fff', flex:1}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />


            <Item stackedLabel  style={{borderBottomWidth:0,marginTop:height*.05}}>
              <Label style={{fontSize:16,color:'#2c2c2c',textAlign:'left', marginBottom:Platform.OS=='ios'?5:-8}}>Employee Comment</Label>
              <Input
                multiline={true}
                placeholder='write the employee comment'
                placeholderTextColor="#a3acb5"
                onChange={this.handleOnChange('comment')}
                value={this.state.comment}
                selectionColor={Global.baseColor}
                autoCapitalize = 'none'
                style={{fontFamily:'OpenSans-Regular',fontSize:14, textAlign:'left', color:'#777',}}
              />
            </Item>
            {this.state.wrongComment!=''?(
              <Text style={{paddingHorizontal:'3%',fontFamily:'OpenSans-Regular', fontSize:12, color:'red', textAlign:'left',marginTop:-10}}>{this.state.wrongComment}</Text>
            ):null}
            <View style={{borderWidth:.5,borderColor:'#ededed', marginBottom:10}}/>

            <TouchableOpacity activeOpacity={1} onPress={()=>this.attachMediaAS.show()}>
              <Text style={{fontSize:16,color:'#2c2c2c',marginTop:height*.01}}>Choose Image</Text>
              {this.state.pickedImg == '' ? (<Image source={UploadImg} style={{ height:height*.2,width:height*.2, resizeMode:'contain' }}/>) : null}
              
            </TouchableOpacity>


            <View style={{alignSelf:'center',paddingTop:height*.02}}>
              {this.state.pickedImg!=''? (
                <Image source={{uri: this.state.pickedImg.path, height:height*.2,width:height*.2, resizeMode:'contain',}}/>
              ):null}
            </View>


            <Button onPress={()=>this.addComment()} full style={{height:height*.08, backgroundColor:Global.baseColor, marginTop:'auto', borderRadius:4, marginBottom:height*.03,width:'90%', alignSelf:'center', elevation:0}}>
              {this.state.loading?(
                <ActivityIndicator size="small" color='#1d1d1d' />
              ):(
                <Text style={{fontFamily:'OpenSans-Regular',  color:'#1d1d1d', fontSize:16, textAlign:'center'}}>Submit</Text>
              )}
            </Button>
          </Content>
          <ActionSheet
            ref={o => this.attachMediaAS = o}
            title={<Text style={{color: '#000', fontSize: 18,}}>Attach Image</Text>}
            message={<Text note style={{textAlign:'center'}}>Add a image by using one of these options</Text>}
            options={[<Text style={{color: 'red', fontSize: 18,}}>Cancel</Text>,
              <TouchableOpacity activeOpacity={1} onPress={()=>this.openCamera()}><Text><Icon name="camera" style={{fontSize:18}}/>  by Camera</Text></TouchableOpacity>,
              <TouchableOpacity activeOpacity={1} onPress={()=>this.openGallery()}><Text><Icon solid name="image-album" style={{fontSize:18}}/>  by Gallery</Text></TouchableOpacity>]}
            cancelButtonIndex={0}
            destructiveButtonIndex={0}
            onPress={(index) => this.attachMedia(index) }
            tintColor={'#707070'}
          />
        </KeyboardAvoidingView>

        </Container>
    )
  }
}

export default AddComment
