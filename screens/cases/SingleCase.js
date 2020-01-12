import React from 'react'
import {
  Platform, StyleSheet, StatusBar, AsyncStorage, Text, NetInfo, BackHandler, Alert, View, Image,
  Dimensions, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator
} from 'react-native'
import { Container, Content, Button, Item, Input, Toast } from 'native-base'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Entypo'
import { Global } from './../../core/Global'

import Modal from "react-native-modal"
import Services from './../../services/Services'

import Header from './../../components/Header'
import BottomTabs from './../../components/BottomTabs'


import ProfileImg from './../../assets/images/profile.png'
import ReopenImg from './../../assets/images/arrow-repeatpng.png'
import CloseImg from './../../assets/images/close.png'
import DoneImg from './../../assets/images/done.png'

import moment from 'moment'

var { width, height } = Dimensions.get('window')

class SingleCase extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      singleCase: global.case,
      singleCaseObj: '',
      employees: [],
      commentArr: [],
      readBy: [],
      selectedEmpolyee: '',
      visibleModal: false,
      loading: true,
      loadingAssign: false,
      readByPermission: true,
      selectedCaseImage:'',
      visibleImageModal:false,
      selectedImageData: [],
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.checkReadByPermission()
      this.setState({ case: global.case }, () => this.getSingleCase())
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.new == 'new') {
      console.log('ya ya yaaasmen');
      this.setState({ case: global.case }, () => this.getSingleCase())
    }
  }
  handleAndroidBack = () => {
    this.goBack()
    return true
  }
  goBack() {
    this.props.navigation.goBack()
  }
  checkReadByPermission() {
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'View Participants') != undefined) {
        this.setState({ readByPermission: true })
      } else {
        this.setState({ readByPermission: false })
      }
    } else {
      this.setState({ readByPermission: true })
    }
  }
  getSingleCase() {
    console.log(global.case.id);
    this.setState({ loading: true })
    Services.getSingleCase(global.case.id, (res) => {
      console.log(res);
      this.setState({ singleCaseObj: res, singleCase: res.cases, readBy: res.readby }, () => this.getRelatedComment())
    })
  }
  getRelatedComment() {
    Services.getRelatedComment(global.case.id, (res) => {
      console.log(res);
      this.setState({ commentArr: res.caseComment, loading: false })
    })
  }

  reopenCase() {
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Reopen closed cases') != undefined) {
        this.setState({ loading: true })
        Services.reopenCase(global.case.id, (res) => {
          this.setState({ loading: false, }, () => this.getSingleCase())
        })
      } else {
        Toast.show({ text: 'You don\'t have permission for reopen closed case', duration: 3000, })
      }
    } else {
      this.setState({ loading: true })
      Services.reopenCase(global.case.id, (res) => {
        this.setState({ loading: false, }, () => this.getSingleCase())
      })
    }

  }

  closeCase() {
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Close Case') != undefined) {
        this.setState({ loading: true })
        Services.closeCase(global.case.id, (res) => {
          this.setState({ loading: false, }, () => this.getSingleCase())
        })
      } else {
        Toast.show({ text: 'You don\'t have permission for close a case', duration: 3000, })
      }
    } else {
      this.setState({ loading: true })
      Services.closeCase(global.case.id, (res) => {
        this.setState({ loading: false, }, () => this.getSingleCase())
      })
    }
  }

  claim() {
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Claim Case') != undefined) {
        this.setState({ loading: true })
        Services.claimCase(global.case.id, (res) => {
          this.setState({ loading: false, }, () => this.getSingleCase())
        })
      } else {
        Toast.show({ text: 'You don\'t have permission for claim a case', duration: 3000, })
      }
    } else {
      this.setState({ loading: true })
      Services.claimCase(global.case.id, (res) => {
        this.setState({ loading: false, }, () => this.getSingleCase())
      })
    }
  }

  assignTo() {
    if (global.userType != 'user') {
      if (global.permissions.find(x => x.key == 'Case assign') != undefined) {
        this.setState({ loadingAssign: true })
        Services.getEmployees((res) => {
          this.setState({ employees: res.Employees, loadingAssign: false, visibleModal: true, selectedEmpolyee: '' })
        })
      } else {
        Toast.show({ text: 'You don\'t have permission for assign a case', duration: 3000, })
      }
    } else {
      this.setState({ loadingAssign: true })
      Services.getEmployees((res) => {
        this.setState({ employees: res.Employees, loadingAssign: false, visibleModal: true, selectedEmpolyee: '' })
      })
    }
  }

  setSelectedEmpolyee(item) {
    this.setState({ selectedEmpolyee: item })
  }

  assignToSelectedEmpolyee() {
    this.setState({ loading: true })
    let data = {
      case_id: global.case.id,
      assignedto_id: this.state.selectedEmpolyee.id
    }
    console.log(data);
    Services.assign(data, (res) => {
      console.log(res);
      // Toast.show({text:res.msg,duration:2000,type:"success"})
      this.setState({ loading: false, visibleModal: false }, () => this.getSingleCase())
    })
  }

  renderModalContent() {
    return (
      <View style={{ backgroundColor: '#fff', height: height * .6, borderRadius: 5, width: '80%', alignSelf: 'center' }}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ visibleModal: false })} 
        style={{ flexDirection: 'row', padding: 15, justifyContent: 'space-between', borderBottomColor: '#ededed', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>X</Text>
          <Text style={{ fontSize: 16, color: '#2c2c2c' }}>All Employees</Text>
          <View />
        </TouchableOpacity>

        <FlatList
          data={this.state.employees}
          renderItem={({ item }) => (
            <Text onPress={() => this.setSelectedEmpolyee(item)} style={{ paddingVertical: 10, borderBottomColor: '#ededed', borderBottomWidth: .5, backgroundColor: this.state.selectedEmpolyee.id == item.id ? Global.baseColor : '#fff' }}>{item.name}</Text>
          )}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: '5%' }}
        />

        <TouchableOpacity activeOpacity={1} onPress={() => this.assignToSelectedEmpolyee()} style={{ alignSelf: 'center', marginVertical: height * .02, backgroundColor: Global.baseColor, width: '80%', paddingVertical: 10, borderRadius: 6 }}>
          <Text style={{ alignSelf: 'center', fontSize: 16, color: '#1d1d1d' }}>Assign</Text>
        </TouchableOpacity>
      </View>
    )
  }

  setImageModalVisible(visible) {
    this.setState({visibleImageModal: visible});
  }


  selectedItem = (data) => {
    this.setState({selectedImageData: data});
    this.setImageModalVisible(true);
  }


  renderCaseImageView ()
  {
    return(
      <View style={{alignItems:'center',padding:10, justifyContent: 'center', backgroundColor: '#fff', height: height * .8, borderRadius: 5, width: '90%', alignSelf: 'center' }}>

          
                {this.state.selectedImageData? <Image 
                          style={{width:'100%',height:height*.6,borderRadius:5,alignSelf: 'center'}}
                          source={{uri:`http://165.227.137.192/storage/${this.state.selectedImageData}`}} />:null}

              <TouchableOpacity activeOpacity={1} onPress={() =>this.setImageModalVisible(false)} 
              style={{ alignSelf: 'center',marginVertical: height * .05, backgroundColor: Global.baseColor, width: '80%', paddingVertical: 10, borderRadius: 6 }}>
                <Text style={{ alignSelf: 'center', fontSize: 16, color: '#1d1d1d' }}>Close</Text>
              </TouchableOpacity>
           
      </View>

    );
  }

  
  renderSingleActivity(type, item) {
    return (
      <View style={{ paddingHorizontal: '4%', borderBottomColor: '#ededed', borderBottomWidth: 1, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
          <Image style={{ width: height * .06, height: height * .06, marginLeft: 2, marginRight: '5%', borderRadius: 20, marginBottom: type == 'action' ? height * .02 : 0 }} source={{ uri: `http://165.227.137.192/${item.user.avatar}` }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginVertical: height * .01 }}>
            {item.user ? (
              <Text style={{ fontSize: 14, color: '#293340' }}>{item.user.name}</Text>
            ) : null}
            <Text style={{ fontSize: 10, color: '#8f8f8f' }}>{moment(item.created_at).add(2, 'hour').format('llll')}</Text>
          </View>
        </View>
        <Text style={{ color: '#777', fontSize: 12, paddingHorizontal: '17%', marginTop: type != 'action' ? -10 : -25, marginBottom: 15, }}>{type != 'action' ? item.comment : item.activity}</Text>


        <TouchableOpacity activeOpacity = { .5 }  onPress={() => this.selectedItem(item.attached_file)} >
          
          {item.attached_file? <Image 
          style={{width:height*.12,height:height*.12,marginLeft:width*.15,borderRadius:20,  marginBottom:height*.02, marginTop:-10}}
          source={{uri:`http://165.227.137.192/storage/${item.attached_file}`}} />:null}

        </TouchableOpacity>
        {/* Modal here.. */}

      </View>
    )
  }




  render() {
    return (
      <Container style={{ backgroundColor: '#f6f6f6' }}>
        <StatusBar backgroundColor={Global.baseColor} barStyle="dark-content" />

        <Header
          title='Cases Overview'
          leftSide={<Icon name='chevron-thin-left' style={{ fontSize: 20, alignSelf: 'center', color: '#2c2c2c' }} onPress={() => this.goBack()} />}
        />

        <View style={{ paddingHorizontal: '5%', flexDirection: 'row', backgroundColor: '#f6f9fc', justifyContent: 'space-between', paddingVertical: 18 }}>
          <Text style={{ color: '#252529' }} onPress={() => this.claim()}><Image source={DoneImg} style={{ width: 15, height: 15, resizeMode: 'contain' }} />  Claim</Text>

          {!this.state.loadingAssign ? (
            <Text style={{ color: '#252529' }} onPress={() => this.assignTo()}><Image source={ProfileImg} style={{ width: 15, height: 15, resizeMode: 'contain' }} />  Assign</Text>
          ) : (
              <View style={{ flexDirection: 'row' }}>
                <ActivityIndicator size="small" color='#2c2c2c' />
                <Text style={{ color: '#252529' }} onPress={() => this.assignTo()}>   Assign</Text>
              </View>
            )}

          <Text style={{ color: '#252529' }} onPress={() => this.state.singleCase.status != 'reopen' ? this.reopenCase() : null}><Image source={ReopenImg} style={{ width: 13, height: 15, resizeMode: 'contain' }} />  Reopen</Text>
          <Text style={{ color: '#252529' }} onPress={() => this.state.singleCase.status != 'close' ? this.closeCase() : null}><Image source={CloseImg} style={{ width: 15, height: 15, resizeMode: 'contain' }} />  Close</Text>
        </View>

        <Content style={{ backgroundColor: '#fff' }}>
          {this.state.loading ? (
            <ActivityIndicator style={{ marginTop: height * .35 }} size="small" color={Global.baseColor} />
          ) : (
              <View>


                <View style={{ paddingHorizontal: '5%', flexDirection: 'row', justifyContent: 'space-between', marginTop: height * .04 }}>
                  <View>
                    <Text style={{ color: '#252529', fontSize: 16 }}>{'Guest Name'.toUpperCase()}</Text>
                    <Text style={{ color: '#656565', fontSize: 14, textAlign: 'left' }}>{this.state.singleCase.guest_name}</Text>
                  </View>
                  <View>
                    <Text style={{ color: '#252529', fontSize: 16 }}>{'Room No.'.toUpperCase()}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Text style={{ color: '#2c2c2c', fontSize: 14, marginRight: height * .02 }}>{this.state.singleCase.room_number}</Text>

                      {global.case.score != null ? (
                        <Text style={{
                          backgroundColor: global.case.score == '1' ? '#e02020' : global.case.score == '2' ? '#fa6400' : global.case.score == '3' ? '#f9a71c' : '#f9a71c',
                          color: '#fff', textAlign: 'center', fontSize: 10, alignSelf: 'center', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10, overflow: 'hidden'
                        }}>
                          {global.case.score}
                        </Text>
                      ) : null}

                    </View>
                    {/* <Text style={{textAlign:'center', fontSize:14, color:'#3e3f42'}}>{this.state.singleCase.room_number}</Text> */}
                  </View>
                </View>

                <View style={{ paddingHorizontal: '5%', marginTop: height * .02 }}>
                  <Text style={{ color: '#252529', fontSize: 16 }}>{'Guest comment'.toUpperCase()}</Text>
                  <Text style={{ color: '#656565', fontSize: 14, textAlign: 'left' }}>{this.state.singleCase.comment}</Text>
                </View>


                {/* {this.state.singleCase.surveytype!=null?(
                <View style={{paddingHorizontal:'5%',marginTop:height*.02}}>
                  <Text style={{color:'#656565', fontSize:16}}>{'Survey Type'.toUpperCase()}</Text>
                  <Text style={{color:'#2c2c2c', fontSize:14}}>{this.state.singleCase.surveytype.name}</Text>
                </View>
              ):null} */}


                <View style={{ borderWidth: .5, borderColor: '#ededed', marginTop: height * .025 }} />
                <View style={{ paddingHorizontal: '5%', marginTop: height * .02 }}>
                  {/* <Text style={{color:'#252529', fontSize:16}}>Information</Text> */}

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: height * .02 }}>
                    <View style={{ flex: width * .4, }}>
                      <Text style={{ color: '#252529', fontSize: 12 }}>{'Case Status'.toUpperCase()}</Text>
                      <Text style={{ color: '#656565', fontSize: 12 }}>{this.state.singleCase.status}</Text>
                    </View>
                    <View style={{ flex: width * .4, }}>
                      <Text style={{ color: '#252529', fontSize: 12 }}>{'Assigned to'.toUpperCase()}</Text>
                      <Text numberOfLines={1} style={{ color: '#656565', fontSize: 12, maxWidth: width * .24, overflow: 'hidden' }}>{this.state.singleCase.assignedto != null ? this.state.singleCase.assignedto.name : "Unassigned"}</Text>

                    </View>
                    {/* <View style={{ flex:width*.2,}}>
                    <Text style={{color:'#252529',fontSize:12}}>{'Case Date'.toUpperCase()}</Text>
                    <Text style={{color:'#656565', fontSize:12}}>{this.state.singleCase.created_at}</Text>
                  </View> */}
                    <View style={{ flex: width * .2 }}>
                      <Text style={{ color: '#252529', fontSize: 12 }}>{'Survey Type'.toUpperCase()}</Text>
                      <Text style={{ color: '#2c2c2c', fontSize: 10 }}>{this.state.singleCase.surveytype != null ? this.state.singleCase.surveytype.name : ''}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: height * .02 }}>
                    {this.state.singleCaseObj != '' ? (
                      <View style={{ flex: width * .4, }}>
                        <Text style={{ color: '#252529', fontSize: 12, }} numberOfLines={1}>{'Resolution time'.toUpperCase()}</Text>
                        <Text style={{ color: '#656565', fontSize: 12 }}>{this.state.singleCaseObj.Reslution_time == '' ? 0 : this.state.singleCaseObj.Reslution_time}h</Text>
                      </View>
                    ) : null}

                    <View style={{ flex: width * .4, }}>
                      <Text style={{ color: '#252529', fontSize: 12, }}>{'Time Received'.toUpperCase()}</Text>
                      <Text style={{ color: '#656565', fontSize: 12 }}>{this.state.singleCase.created_at}</Text>
                    </View>
                    <View style={{ flex: width * .2, }}>
                      <Text style={{ color: '#252529', fontSize: 12 }}>{'Read By'.toUpperCase()}</Text>
                      {this.state.readByPermission ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          {this.state.readBy.map((item, index) => (
                            <Image key={index} style={{ width: height * .03, height: height * .03, marginLeft: 2, borderRadius: height * .015, overflow: 'hidden', marginTop: height * .007 }} source={{ uri: `http://165.227.137.192/${item.user.avatar}` }} />
                          ))}
                        </View>
                      ) : (
                          <Icon2 name='eye-off-outline' style={{ textAlign: 'left', fontSize: 16 }} />
                        )}

                    </View>
                  </View>

                </View>

                <View style={{ borderWidth: .5, borderColor: '#ededed', marginVertical: height * .025 }} />

                {this.state.singleCase.activities.length != 0 ? (
                  <View>
                    <Text style={{ paddingHorizontal: '4%', fontSize: 16, color: '#3b3a3a' }}>Activity Log</Text>
                    <FlatList bounces={false}
                      data={this.state.singleCase.activities}
                      renderItem={({ item }) => this.renderSingleActivity('action', item)}
                      extraData={this.state}
                      keyExtractor={(item, index) => index.toString()}
                    />
                    <FlatList bounces={false}
                      data={this.state.commentArr}
                      renderItem={({ item }) => this.renderSingleActivity('comment', item)}
                      extraData={this.state}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                ) : null}

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('addComment')} style={{ alignSelf: 'center', marginVertical: height * .02, backgroundColor: Global.baseColor, width: '90%', paddingVertical: 10, borderRadius: 4 }}>
                  <Text style={{ textAlign: 'center', fontSize: 16, color: '#1d1d1f' }}>Comment</Text>
                </TouchableOpacity>
              </View>
            )}

        </Content>

        <Modal isVisible={this.state.visibleModal} style={{ justifyContent: 'center', margin: 0, }} >
          {this.renderModalContent()}
        </Modal>


        <Modal 
          isVisible={this.state.visibleImageModal} 
          style={{ justifyContent: 'center', margin: 0, }} 
          onRequestClose={() => {this.setImageModalVisible(false);}}>
          {this.renderCaseImageView()}
        </Modal>

        <BottomTabs navigation={this.props.navigation} />
      </Container>
    )
  }
}

export default SingleCase;



const optionsStyles = {
  optionsContainer: {
    width: width * .9,
    alignSelf: "center",
    marginLeft: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
    maxHeight: height * .7,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'black',
    fontSize: 16,
  },
}
