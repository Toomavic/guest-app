import React, {Component} from 'react'
import { Platform, View, Dimensions, PixelRatio } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import styles from './../assets/style/Style'
import { Global } from './../core/Global'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import ProgressCircle from 'react-native-progress-circle'
import { AnimatedCircularProgress } from 'react-native-circular-progress';


var { width, height } = Dimensions.get('window')


class SingleCircle extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={{alignSelf:'center'}}>
        <AnimatedCircularProgress
          size={height*.2}
          width={12}
          backgroundWidth={12}
          fill={this.props.progress}
          tintColor="#f6511d"
          backgroundColor="#dbecf8"
          arcSweepAngle={260}
          rotation={230}
        />
        {/* <ProgressCircle
          percent={this.props.progress-(this.props.progress*.25)}
          radius={height*.1}
          borderWidth={12}
          color="#f6511d"
          shadowColor="#dbecf8"
          bgColor="#fff"
          outerCircleStyle={{transform: [{ rotate: '225deg'}]}}
          >

          </ProgressCircle>
        <View style={[styles.teriangle,{ borderBottomWidth:Platform.OS=='ios'&&PixelRatio.get()==2?130:height*.1}]}/> */}
      </View>
    )
  }
}




export default SingleCircle


SingleCircle.propTypes = {
  progress : PropTypes.number,
  // reslutionTime : PropTypes.number,
}


SingleCircle.defaultProps = {
  progress : 0,
  // reslutionTime : 0,
}
