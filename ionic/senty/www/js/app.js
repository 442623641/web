// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('app', ['ionic', 'ionic-toast','controllers', 
  'services','directives'])
//'monospaced.elastic'
.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
  noBackdrop:true

})

.constant('url', {
  // 'logout':'http://36.7.150.152:22016/Do.ashx?userName={0}&password={1}&cls=User&fun=Login',
  // 'login':'http://36.7.150.152:22016/Do.ashx?userName={0}&password={1}&cls=User&fun=Login',
  // 'keys':'http://36.7.150.152:22016/Do.ashx?cls=Senty&fun=List&userID={0}',
  'senty_release':'http://36.7.150.152:22016/Do.ashx',
  'senty_development':'http://localhost:8100/Do.ashx',
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.run(function($ionicPlatform,$rootScope,url,localStorageService,Session,AUTH_EVENTS,Keys,Push) {
  //check environment 
  if(!ionic.Platform.isWebView()){
    // development
    url.senty=url.senty_development;
  }else{
    url.senty=url.senty_release;
  }
  //url.senty=url.senty_release;
  // push notification callback
  // if (ionic.Platform.isAndroid()) {  
  //   StatusBar.backgroundColorByHexString("#53cac3");  
  // }
  // var notificationCallback = function(data) {
  //   console.log('received data :' + data);
  //   var notification = angular.fromJson(data);
  //   //app 是否处于正在运行状态
  //   var isActive = notification.notification;

  //   // here add your code
  //   //ios
  //   if (ionic.Platform.isIOS()) {
  //     window.alert(notification);
  //   } else {
  //   //非 ios(android)
  //   }
  // };
    
    //$cordovaStatusbar.styleColor('#53cac3');  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
 

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
     
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //alert(1111);
      StatusBar.backgroundColorByHexString("#53cac3");
      StatusBar.styleLightContent();

    }
    //初始化push
    //Push.init(notificationCallback);
    //设置别名
    //Push.setAlias("12345678");

    // //初始化用户信息
    // var user=localStorageService.get("user");
    // Session.setKeys(localStorageService.get("lastKeys"));
    // if(!!user&&user.token){
    //   Session.create(user);
    //   Keys.getLast(user.userID);
    // }
    //$state.go('tab.negatives');
  });
   
});