import React, {Component} from 'react'
import { Platform, View, Dimensions } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import styles from './../assets/style/Style'
import { Global } from './../core/Global'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"

var { width, height } = Dimensions.get('window')


class Header extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={[styles.shadow,{paddingTop:Platform.OS=='ios'?20:0,paddingHorizontal:'5%', backgroundColor:Global.baseColor,flexDirection:'row',justifyContent:'space-between', borderBottomWidth: 0,height:Platform.OS == 'ios'?height*.12:height*.08,shadowOffset:{width:0,height:5},shadowOpacity:.15}]}>
        {this.props.leftSide!=''? this.props.leftSide :<View style={{width:30}}/>}
        <Text style={{marginTop:'auto',marginBottom:'auto', alignSelf:'center',color:'#363636',fontSize:18}}>{this.props.title}</Text>
        {this.props.rightSide!=''? this.props.rightSide :<View style={{width:30}}/>}
      </View>
    )
  }
}




export default Header


Header.propTypes = {
  title : PropTypes.string,
  leftSide: PropTypes.node,
  rightSide: PropTypes.node,
}


Header.defaultProps = {
  title: '',
  leftSide:'',
  rightSide:'',
}
