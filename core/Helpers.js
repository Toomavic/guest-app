import NavigationService from "./NavigationService"
//goToLogin Function on different js :
export function goToLogin(){
  NavigationService.navigate("authStack");
}

export function goToError(){
  NavigationService.navigate("Error");
}
export function goTo(roureName, params){
  NavigationService.navigate(roureName, params);
  // alert(roureName)
  // NavigationService.navigate({
  //   routeName: roureName,
  //   // params:params,
  //   key: Math.random () * 10000
  // })

  // NavigationService.navigate ({ key: 'rrrr', routeName: roureName, params: params })
}
