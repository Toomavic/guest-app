import React from 'react';
import { Alert, Text, AsyncStorage, View, Dimensions, Image } from 'react-native'
import { Badge } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomNavigation, { IconTab } from 'react-native-material-bottom-navigation'
import {Global} from './../core/Global'

import Home from './../assets/images/home.png'
import Dashboard from './../assets/images/menu.png'
import Database from './../assets/images/database.png'
import More from './../assets/images/more.png'
import {goTo} from './../core/Helpers'

var { width, height } = Dimensions.get('window');

class BottomTabs extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isMount:false,
      activeTab:global.tab,
      cartItems:[],
    }
  }

  componentDidMount(){
    // this.props.navigation.addListener ('willFocus',()=>{
    //
    // })
  }
  componentWillReceiveProps(nextProps) {

  }


  tabs = [
    {
      key: 'home',
      icon: <Image source={Home} style={{width:20,height:20,tintColor:'#4e4e50'}} resizeMode="contain"/>,
      barColor: '#fff',
      activeIcon: <Image source={Home} style={{width:20,height:20,tintColor:Global.baseColor}} resizeMode="contain"/>,
      showBadge:true,
      pressColor: '#fff'
    },{
      key: 'dashboard',
      icon: <Image source={Dashboard} style={{width:20,height:20,tintColor:'#4e4e50'}} resizeMode="contain"/>,
      barColor: '#fff',
      activeIcon: <Image source={Dashboard} style={{width:20,height:20,tintColor:Global.baseColor}} resizeMode="contain"/>,
      showBadge:true,
      pressColor: '#fff'
    },{
      key: 'cases',
      icon: <Image source={Database} style={{width:20,height:20,tintColor:'#4e4e50'}} resizeMode="contain"/>,
      barColor: '#fff',
      activeIcon: <Image source={Database} style={{width:20,height:20,tintColor:Global.baseColor}} resizeMode="contain"/>,
      showBadge:true,
      pressColor: '#fff'
    },
    {
      key: 'settings',
      icon: <Image source={More} style={{width:20,height:20,tintColor:'#4e4e50'}} resizeMode="contain"/>,
      barColor: '#fff',
      activeIcon: <Image source={More} style={{width:20,height:20,tintColor:Global.baseColor}} resizeMode="contain"/>,
      pressColor: '#fff'
    }
  ]

  renderIcon = tab => ({ isActive }) => (
    isActive ? tab.activeIcon : tab.icon
  )
  renderBadge = tab => ({ isActive }) => (
    tab.showBadge ? (
      <View style={{position:'absolute',right: -6,top: -12,height:18,minWidth:18,borderRadius:18/2,justifyContent:'center',alignItems:'center',backgroundColor:Global.baseColor,borderColor:Global.baseColor,borderWidth:0.5}}>
        <Text style={{color:'white',fontSize:10,fontWeight:'bold'}}>{this.state.cartItems.length}</Text>
      </View>
  ) : null
)

renderTab = ({ tab, isActive }) => (
  <IconTab
    key={tab.key}
    isActive={isActive}
    renderIcon={this.renderIcon(tab)}
    renderBadge={this.renderBadge(tab)}
    style={{paddingHorizontal:20, marginHorizontal:-20,}}
  />
)
nav(x){
  global.tab = x
  // this.setState({activeTab:x},()=>goTo(x))
  this.props.navigation.navigate(x)
}

render(){
  return (
    <BottomNavigation
      onTabPress={newTab => this.nav(newTab.key)}
      renderTab={this.renderTab}
      tabs={this.tabs}
      activeTab={this.state.activeTab}
    />
  )
}

}
export default BottomTabs;
