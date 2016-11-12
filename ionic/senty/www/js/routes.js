app.config(function($stateProvider, $urlRouterProvider,USER_ROLES,$httpProvider,$ionicConfigProvider) {
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');        
  $ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
  })

  .state('tab.negatives', {
      url: '/negatives',
      views: {
        'tab-negatives': {
          templateUrl: 'templates/tab-negatives.html',
          controller: 'NegativesCtrl',
        }
      },
      data: {authorizedRoles: USER_ROLES.admin}
  })
  .state('tab.keys', {
      url: '/keys',
      views: {
        'tab-keys': {
          templateUrl: 'templates/tab-keys.html',
          controller: 'KeysCtrl',
        }
      },
      data: {authorizedRoles: USER_ROLES.admin}
  })

  .state('tab.person', {
    url: '/person',
    views: {
      'tab-person': {
        templateUrl: 'templates/tab-person.html',
        controller: 'PersonCtrl',
      }
    },
    data: {authorizedRoles: USER_ROLES.admin}
  })
  .state('tab.result', {
      url: '/result/:Title/:Key',
      cache:false, 
      views: {
        'tab-keys': {
          templateUrl: 'templates/result.html',
          controller: 'ResultCtrl'
        }
      },
      data: {authorizedRoles: USER_ROLES.admin}
  })

  .state('tab.senty', {
      url: '/senty',
      views: {
        'tab-senty': {
          templateUrl: 'templates/tab-senty.html',
          controller: 'SentyCtrl',
        }
      },
      data: {authorizedRoles: USER_ROLES.admin}
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('tab/negatives');
  $ionicConfigProvider.scrolling.jsScrolling(false);
  //$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  //$httpProvider.interceptors.push('httpInterceptor');

});