import React from 'react'
import { createSwitchNavigator, createStackNavigator} from 'react-navigation'

// appStack screens
import Home from './../screens/home/Home'
import Dashboard from './../screens/home/Dashboard'
import Cases from './../screens/cases/Cases'
import AddCase from './../screens/cases/AddCase'
import AddComment from './../screens/cases/AddComment'
import SingleCase from './../screens/cases/SingleCase'
import Settings from './../screens/home/Settings'
import About from './../screens/general/About'
import Feedback from './../screens/general/Feedback'

// authStack screens
import Login from './../screens/auth/Login'
import ForgetPassword from './../screens/auth/ForgetPassword'


export const AppStack = createStackNavigator({
  home:Home,
  dashboard:Dashboard,
  cases:Cases,
  settings:Settings,
  about:About,
  feedback: Feedback,
  addCase:AddCase,
  addComment:AddComment,
  singleCase:SingleCase,
},{
  navigationOptions: { gesturesEnabled: false,header: null },
  initialRouteName: 'home',
  transitionConfig: () => ({
     transitionSpec: {
       duration:0,
     }
   })
})


export const AuthStack = createStackNavigator({
  login:Login,
  forgetPassword:ForgetPassword,
},{
  navigationOptions: { gesturesEnabled: false,header: null },
  initialRouteName: 'login',
})



export const SwitchNavigation = (logged = 'login') => {
  return createSwitchNavigator({
    appStack: AppStack,
    authStack: AuthStack,
  },{
    initialRouteName: logged == 'home' ? 'appStack' : 'authStack'
  })
}
