// var app = angular.module('app', [
//     'ngRoute',
//     'ngCookies',
//     'home',
//     // 'signIn',
//     // 'register',
//     // 'todoManager'
// ])
 angular.module('app', ['ngRoute', 'app.route','app.controllers','app.directives','ngCookies', 'ngResource'])
// app.run(['$http', '$cookies', '$cookieStore', function ($http, $cookies, $cookieStore) {
//     //If a token exists in the cookie, load it after the app is loaded, so that the application can maintain the authenticated state.
//     $http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get('_Token');
//     $http.defaults.headers.common.RefreshToken = $cookieStore.get('_RefreshToken');
// }])


//GLOBAL FUNCTIONS - pretty much a root/global controller.
//Get username on each page
//Get updated token on page change.
//Logout available on each page.
.run(['$rootScope', '$http', '$cookies', '$cookieStore', function ($rootScope, $http, $cookies, $cookieStore) {

    // $rootScope.logout = function () {
        
    //     $http.post('/api/Account/Logout')
    //         .success(function (data, status, headers, config) {
    //             $http.defaults.headers.common.Authorization = null;
    //             $http.defaults.headers.common.RefreshToken = null;
    //             $cookieStore.remove('_Token');
    //             $cookieStore.remove('_RefreshToken');
    //             $rootScope.username = '';
    //             $rootScope.loggedIn = false;
    //             window.location = '#/signin';
    //         });

    // }

    // $rootScope.$on('$locationChangeSuccess', function (event) {
    //     if ($http.defaults.headers.common.RefreshToken != null) {
    //         var params = "grant_type=refresh_token&refresh_token=" + $http.defaults.headers.common.RefreshToken;
    //         $http({
    //             url: '/Token',
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //             data: params
    //         })
    //         .success(function (data, status, headers, config) {
    //             $http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
    //             $http.defaults.headers.common.RefreshToken = data.refresh_token;

    //             $cookieStore.put('_Token', data.access_token);
    //             $cookieStore.put('_RefreshToken', data.refresh_token);

    //             $http.get('/api/WS_Account/GetCurrentUserName')
    //                 .success(function (data, status, headers, config) {
    //                     if (data != "null") {
    //                         $rootScope.username = data.replace(/["']{1}/gi, "");//Remove any quotes from the username before pushing it out.
    //                         $rootScope.loggedIn = true;
    //                     }
    //                     else
    //                         $rootScope.loggedIn = false;
    //                 });


    //         })
    //         .error(function (data, status, headers, config) {
    //             $rootScope.loggedIn = false;
    //         });
    //     }
    // });
}]);



// .config(function($stateProvider, $urlRouterProvider) {

//   // Ionic uses AngularUI Router which uses the concept of states
//   // Learn more here: https://github.com/angular-ui/ui-router
//   // Set up the various states which the app can be in.
//   // Each state's controller can be found in controllers.js
//   $stateProvider

//   // setup an abstract state for the tabs directive
//     .state('tab', {
//     url: '/tab',
//     abstract: true,
//     templateUrl: 'templates/tabs.html'
//   })

//   // Each tab has its own nav history stack:

//   .state('tab.dash', {
//     url: '/dash',
//     views: {
//       'tab-dash': {
//         templateUrl: 'templates/tab-dash.html',
//         controller: 'DashCtrl'
//       }
//     }
//   })

//   .state('tab.chats', {
//       url: '/chats',
//       views: {
//         'tab-chats': {
//           templateUrl: 'templates/tab-chats.html',
//           controller: 'ChatsCtrl'
//         }
//       }
//     })
//     .state('tab.chat-detail', {
//       url: '/chats/:chatId',
//       views: {
//         'tab-chats': {
//           templateUrl: 'templates/chat-detail.html',
//           controller: 'ChatDetailCtrl'
//         }
//       }
//     })

//   .state('tab.account', {
//     url: '/account',
//     views: {
//       'tab-account': {
//         templateUrl: 'templates/tab-account.html',
//         controller: 'AccountCtrl'
//       }
//     }
//   });

//   // if none of the above states are matched, use this as the fallback
//   $urlRouterProvider.otherwise('/tab/dash');

// });

