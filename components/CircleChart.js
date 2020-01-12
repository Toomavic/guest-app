import React, {Component} from 'react'
import { Platform, View, Dimensions } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import styles from './../assets/style/Style'
import { Global } from './../core/Global'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import ProgressCircle from 'react-native-progress-circle'
var { width, height } = Dimensions.get('window')
import Carousel, { Pagination }  from 'react-native-snap-carousel';
import Circle from './Circle'
import SingleCircle from './SingleCircle'


class CircleChart extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <Carousel
        ref={(c) => { this._carousel = c }}
        data={['one','two','three','four']}
        renderItem={(item)=>this.renderItem(item)}
        sliderWidth={width}
        itemWidth={width-width*.2}
        firstItem={1}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='center'
        contentContainerCustomStyle={{justifyContent:'center'}}
        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
      />

    )
  }
  renderItem(item){
    if (item.item == 'one') {
      return(
        <View style={[styles.shadow,{elevation:1, width:width*.75,minHeight:height*.34, alignSelf:'center', marginVertical:3,borderRadius:20,backgroundColor:'#fff'}]}>
          <Text style={{fontSize:18, color:'#25345c', textAlign:'center', paddingVertical:'3%'}}>Surveys</Text>
          <Circle caseNumber={this.props.surveycount} reslutionTime={this.props.avarage}/>
          <View style={{flexDirection:'row',justifyContent:'space-around', paddingBottom:'5%', paddingLeft:'6%'}}>
            <View>
              <View style={{flexDirection:'row', marginTop:'-5%',justifyContent:'flex-end'}}>
                <FontAwesome name='square' solid style={{fontSize:10,color:'#f6511d', alignSelf:'center'}}/>
                <Text style={{fontSize:12, marginHorizontal:4,alignSelf:'center',}}>{this.props.surveycount}</Text>
                <Text style={{fontSize:12, alignSelf:'center',alignSelf:'center',paddingBottom:'1%'}}>Surveys</Text>
              </View>
              <Text style={{color:'#8e8e93',fontSize:10, textAlign:'right'}}>Surveys Received</Text>
              <Text style={{color:'#f55753',fontSize:10, textAlign:'right'}}>{this.props.percentageForSurveycount}%  vs Yesterday</Text>
            </View>
            <View>
              <View style={{flexDirection:'row', marginTop:'-5%',}}>
                <FontAwesome name='square' solid style={{fontSize:10,color:'#f8d053', alignSelf:'center'}}/>
                <Text style={{fontSize:12, marginHorizontal:4,alignSelf:'center'}}>{this.props.avarage}</Text>
                <Text style={{fontSize:12, alignSelf:'center',paddingBottom:'1%'}}>Avarage</Text>
              </View>
              <Text style={{color:'#8e8e93',fontSize:10,}}>Avarage Survey Score</Text>
              <Text style={{color:'#f8d053',fontSize:10}}>{this.props.percentageForSurveycountScore}%  vs Yesterday</Text>
            </View>
          </View>
        </View>
      )
    }else if (item.item == 'two') {
      return(
        <View style={[styles.shadow,{elevation:1, width:width*.75,minHeight:height*.34, alignSelf:'center', marginVertical:3,borderRadius:20,backgroundColor:'#fff'}]}>
          <Text style={{fontSize:18, color:'#25345c', textAlign:'center', paddingVertical:'3%'}}>Cases</Text>
          <Circle caseNumber={this.props.caseNumber} reslutionTime={this.props.reslutionTime}/>
          <View style={{flexDirection:'row',justifyContent:'space-around', paddingBottom:'5%', paddingLeft:'4%'}}>
            <View>
              <View style={{flexDirection:'row', marginTop:'-5%',justifyContent:'flex-end'}}>
                <FontAwesome name='square' solid style={{fontSize:10,color:'#f6511d', alignSelf:'center'}}/>
                <Text style={{fontSize:12, marginHorizontal:4,alignSelf:'center'}}>{this.props.caseNumber}</Text>
                <Text style={{fontSize:12, alignSelf:'center',paddingBottom:'1%'}}>CASES</Text>
              </View>
              <Text style={{color:'#8e8e93',fontSize:10, textAlign:'right'}}>Cases Received</Text>
              <Text style={{color:'#f55753',fontSize:10, textAlign:'right'}}>{this.props.casespercentage}%  vs Yesterday</Text>
            </View>
            <View>
              <View style={{flexDirection:'row', marginTop:'-5%',}}>
                <FontAwesome name='square' solid style={{fontSize:10,color:'#f8d053', alignSelf:'center'}}/>
                <Text style={{fontSize:12, marginHorizontal:4,alignSelf:'center',paddingBottom:'1%'}}>{this.props.reslutionTime}</Text>
                {/* <Text style={{fontSize:12, alignSelf:'center'}}>HOURS</Text> */}
              </View>
              <Text style={{color:'#8e8e93',fontSize:10}}>Case Resolution Time</Text>
              <Text style={{color:'#f8d053',fontSize:10}}>{this.props.TotalPercantageResolutionTime}%  vs Yesterday</Text>
            </View>
          </View>
        </View>
      )
    }else if(item.item == 'three') {
      return(
        <View style={[styles.shadow,{elevation:1, width:width*.75,minHeight:height*.34, alignSelf:'center', marginVertical:3,borderRadius:20,backgroundColor:'#fff'}]}>
          <Text style={{fontSize:18, color:'#25345c', textAlign:'center', paddingVertical:'5%'}}>Recovery Rate</Text>
          <SingleCircle progress={this.props.recoveryRate} />
          <View style={{flexDirection:'row', alignSelf:'center', marginTop:-10}}>
            <FontAwesome name='square' solid style={{fontSize:10,color:'#f6511d', alignSelf:'center'}}/>
            <Text style={{fontSize:12, marginHorizontal:4}}>{this.props.recoveryRate}%</Text>
            <Text style={{fontSize:12, alignSelf:'center'}}>Recovery Rate</Text>
          </View>
        </View>
      )
    }else {
      return(
        <View style={[styles.shadow,{elevation:1, width:width*.75,minHeight:height*.34, alignSelf:'center', marginVertical:3,borderRadius:20,backgroundColor:'#fff'}]}>
          <Text style={{fontSize:18, color:'#25345c', textAlign:'center', paddingVertical:'5%'}}>TripAdvisor Reviews</Text>
          <SingleCircle progress={this.props.tripadvisor.count_today} />
          <View style={{flexDirection:'row', alignSelf:'center', marginTop:-15}}>
            <FontAwesome name='square' solid style={{fontSize:10,color:'#f6511d', alignSelf:'center'}}/>
            <Text style={{fontSize:12, marginHorizontal:4}}>{this.props.tripadvisor.count_today}</Text>
            <Text style={{fontSize:12, alignSelf:'center'}}>Review</Text>
          </View>
          <Text style={{color:'#f55753',fontSize:10, textAlign:'center'}}>{this.props.tripadvisor.count_today_vs_yesterday}%  vs Yesterday</Text>
        </View>
      )
    }
  }

}




export default CircleChart


CircleChart.propTypes = {
  caseNumber : PropTypes.number,
  reslutionTime : PropTypes.string,
  recoveryRate: PropTypes.number
}


CircleChart.defaultProps = {
  caseNumber : 0,
  reslutionTime : '',
  recoveryRate: 0
}
