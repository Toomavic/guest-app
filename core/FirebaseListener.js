import React from 'react'
import { Alert, Linking, View, NativeEventEmitter, Platform } from 'react-native'
import firebase from 'react-native-firebase'
import Services from './../services/Services'
import {goTo} from './../core/Helpers'

class FirebaseListener extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      notifications:[],
    }
  }

  async componentDidMount(){
    const fcmToken = await firebase.messaging().getToken()
    if (fcmToken) { console.log("yas "+fcmToken) }
    const enabled = await firebase.messaging().hasPermission()
    if (!enabled) {
      firebase.messaging().requestPermission()
      .then(() => {})
      .catch(error => {})
    }

    // background - killed
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification()

    if (notificationOpen) {
      const action = notificationOpen.action
      const notification: Notification = notificationOpen.notification
      if (notification._data.action == 'general') {
        Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'Ok'}],{ cancelable: false })
      }else {
        let item = {id:notification._data.case_id}
        global.case = item
        global.tab = 'cases'
        Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'View', onPress:()=>goTo('singleCase',{new:'new'})},{text:'Cancel'}],{ cancelable: false })
      }

      firebase.notifications().removeDeliveredNotification(notification._notificationId)
      firebase.notifications().removeDeliveredNotification(notification.notificationId)
    }

    // android
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    .setDescription('My apps test channel')
    firebase.notifications().android.createChannel(channel)



    // foreground
    await firebase.notifications().onNotification((notification: Notification) => {
      if (notification._data.action == 'general') {
        Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'Ok'}],{ cancelable: false })
      }else {
        let item = {id: notification._data.case_id}
        global.case = item
        global.tab = 'cases'
        Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'View', onPress:()=>goTo('singleCase',{new:'new'})},{text:'Cancel'}],{ cancelable: false })
      }
      firebase.notifications().removeDeliveredNotification(notification._notificationId)
      firebase.notifications().removeDeliveredNotification(notification.notificationId)
    })

    if (Platform.OS == 'ios') {
      await firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        const action = notificationOpen.action
        const notification: Notification = notificationOpen.notification
        if (notification._data.action == 'general') {
          Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'Ok'}],{ cancelable: false })
        }else {
          let item = {id: notification._data.case_id}
          global.case = item
          global.tab = 'cases'
          Alert.alert(`${notification._data.title}`,`${notification._data.body}`,[{text:'View', onPress:()=>goTo('singleCase',{new:'new'})},{text:'Cancel'}],{ cancelable: false })
        }

        firebase.notifications().removeDeliveredNotification(notification._notificationId)
        firebase.notifications().removeDeliveredNotification(notification.notificationId)
      })
    }



  }


  render(){
    return (
      <View/>
    )
  }


}
export default FirebaseListener
