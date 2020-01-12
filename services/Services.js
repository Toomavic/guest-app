import React, {Component} from 'react'
import { AsyncStorage } from 'react-native'
import {Global} from './../core/Global'

class Services extends Component {

  static login(data, callBack) {
    fetch(`${Global.baseURL}login`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(
      (response) =>{
        console.log(response);
        callBack(response)
      },
      (error) => {
        callBack(error)
      }
    )
  }



  static forgetPassword(data, callBack) {
    fetch(`${Global.baseURL}forgot-password`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json',
        // 'Authorization': 'Bearer '
      }
    })
    .then(res => res.text())
    .then(
      (response) =>{
        console.log(response);
        callBack(response)
      },
      (error) => {
        callBack(error)
      }
    )
  }

  static getCases(callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      console.log(`${Global.baseURL}cases?user_id=${JSON.parse(value).user.id}`);
      if (value) {
        fetch(`${Global.baseURL}cases?user_id=${JSON.parse(value).user.id}`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            console.log(response);
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }




  static getSingleCase(id, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        console.log(JSON.parse(value));
        fetch(`${Global.baseURL}cases/${id}`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }


  static reopenCase(id, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases/status`,{
          method: 'POST',
          body: JSON.stringify({
            reopen : id,
          }),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }


  static closeCase(id, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases/status`,{
          method: 'POST',
          body: JSON.stringify({
            close : id,
          }),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static claimCase(id, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases/claim`,{
          method: 'POST',
          body: JSON.stringify({
            case_id : id,
          }),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }





  static createCase(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static multiCasesAction(type, array, callBack) {
    let data = new FormData()
    let url = ''
    for (var i = 0; i < array.length; i++) {
      data.append(`${type}[]`,array[i]);
    }
    console.log(type);
    type=='id'? url = `${Global.baseURL}cases/deleteall` : url = `${Global.baseURL}cases/statusall`
    console.log(url);
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(url,{
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json',
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          },

        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            console.log(error);
            callBack(error)
          }
        )
      }
    })
  }



  static getEmployees(callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}users`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static assign(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases/assign`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }




  static filter(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}cases/filters`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }




  static getReports(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      // console.log(value);
      if (value) {
        fetch(`http://165.227.137.192/api/reports`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }


  static getCasesForToday(callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}casestoday/${JSON.parse(value).user.id}`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }

  static getSurveyReports(callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}surveyreports`,{
          method: 'POST',
          body: JSON.stringify({
            user_id: JSON.parse(value).user.id
          }),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static getCasesReports(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}casesreports`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static addComment(data, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}case-comments`,{
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json',
            // 'content-type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }



  static getRelatedComment(id, callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      console.log(`${Global.baseURL}case-comments?case_id=${id}`);
      if (value) {
        fetch(`${Global.baseURL}case-comments?case_id=${id}`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }


  static getAboutUsText(callBack) {
    AsyncStorage.getItem('userData').then((value)=>{
      if (value) {
        fetch(`${Global.baseURL}about`,{
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(value).token}`
          }
        })
        .then(res => res.json())
        .then(
          (response) =>{
            callBack(response)
          },
          (error) => {
            callBack(error)
          }
        )
      }
    })
  }


static toggleNotification(data, callBack) {
  AsyncStorage.getItem('userData').then((value)=>{
    if (value) {
      fetch(`${Global.baseURL}user/notifiy/status`,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(value).token}`
        }
      })
      .then(res => res.json())
      .then(
        (response) =>{
          callBack(response)
        },
        (error) => {
          callBack(error)
        }
      )
    }
  })
}


static getSurveytype(callBack) {
  AsyncStorage.getItem('userData').then((value)=>{
    if (value) {
      fetch(`${Global.baseURL}surveytype`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(value).token}`
        }
      })
      .then(res => res.json())
      .then(
        (response) =>{
          callBack(response)
        },
        (error) => {
          callBack(error)
        }
      )
    }
  })
}



static logout(callBack) {
  AsyncStorage.getItem('userData').then((value)=>{
    if (value) {
      fetch(`${Global.baseURL}logout`,{
        method: 'POST',
        // body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(value).token}`
        }
      })
      .then(res => res.json())
      .then(
        (response) =>{
          callBack(response)
        },
        (error) => {
          callBack(error)
        }
      )
    }
  })
}


static sendFeedback(data, callBack) {
  AsyncStorage.getItem('userData').then((value)=>{
    if (value) {
      fetch(`${Global.baseURL}send/feedback`,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(value).token}`
        }
      })
      .then(res => res.json())
      .then(
        (response) =>{
          callBack(response)
        },
        (error) => {
          callBack(error)
        }
      )
    }
  })
}

static getTripadvisor(callBack) {
  AsyncStorage.getItem('userData').then((value)=>{
    if (value) {
      fetch(`${Global.baseURL}tripadvisor`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(value).token}`
        }
      })
      .then(res => res.json())
      .then(
        (response) =>{
          callBack(response)
        },
        (error) => {
          callBack(error)
        }
      )
    }
  })
}




}



export default Services;
