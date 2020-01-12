import React, {Component} from 'react'
import { Platform, View, Dimensions } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import styles from './../assets/style/Style'
import { Global } from './../core/Global'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import ProgressCircle from 'react-native-progress-circle'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

var { width, height } = Dimensions.get('window')


class Circle extends React.PureComponent{
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
          fill={this.props.caseNumber}
          tintColor="#f6511d"
          backgroundColor="#dbecf8"
          arcSweepAngle={260}
          rotation={230}
        />
        <View style={{marginTop:-height*0.175, alignSelf:'center'}}>
          <AnimatedCircularProgress
            size={height*.15}
            width={12}
            backgroundWidth={12}
            fill={this.props.reslutionTime}
            tintColor="#f8d053"
            backgroundColor="#dbecf8"
            arcSweepAngle={260}
            rotation={230}
          />
        </View>
      </View>
    )
  }
}




export default Circle


Circle.propTypes = {
  caseNumber : PropTypes.number,
  reslutionTime : PropTypes.number,
}


Circle.defaultProps = {
  caseNumber : 0,
  reslutionTime : 0,
}
