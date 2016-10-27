
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['lokijs','ionic', 'starter.controllers','ngCordova','services','directives'])
.constant('url', {
  'menu_development':'http://localhost:8100/magical/index.php/{0}/{1}/{2}/{3}',
  'menu_release':'http://139.196.8.187/magical/index.php/{0}/{1}/{2}/{3}',
})
.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
  noBackdrop:true

})

.run(function($ionicPlatform,url,MenusDbService) {
    $ionicPlatform.ready(function() {
      if(!ionic.Platform.isWebView()){
        // development
        url.menu=url.menu_development;
      }else{
        url.menu=url.menu_release;
    }
    // Initialize the database.
    MenusDbService.initDB();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    //Creating a database 
    db = new loki('menu.db');
    //Creating a table 
    menuTable = db.getCollection('menu');
    menuTable||(menuTable=db.addCollection('menu'));
  });
})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');        
  $ionicConfigProvider.platform.android.views.transition('android');

  $stateProvider

  .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.recipes', {
      url: '/playlists/:shopID',
      views: {
        'menuContent': {
          templateUrl: 'templates/recipes.html',
          controller: 'RecipesCtrl'
        }
      }
    })
    .state('app.setup', {
      url: '/playlists/:shopID/:tag',
      views: {
        'menuContent': {
          templateUrl: 'templates/setup.html',
          controller: 'SetupCtrl'
        }
      }
    })
    
  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
  // $ionicConfigProvider.scrolling.jsScrolling(false);
});
