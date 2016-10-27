angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$ionicLoading,MenusDbService,$ionicSideMenuDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.appName="扫了吗";
  $scope.loginData = {};
  $scope.token=false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });
  // $ionicModal.fromTemplateUrl('templates/purchases.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.purchaseModal = modal;
  // });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $scope.token=true;
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  // $scope.openPurchaseModal=function(){
  //   $scope.$broadcast('openPurchaseModal');
  // }

  $scope.$on('$destroy', function() {
     //$scope.purchaseModal.remove();
     $scope.loginModal.remove();
  });
  $scope.openLink=function(url,type){
    event.preventDefault();
    type=type?type:'_system';
    cordova.InAppBrowser.open(url, type, 'location=yes');
  }
  $scope.loadingHide=function(){
    $ionicLoading.hide();
  }
  $scope.loadingShow=function(){
    $ionicLoading.show();
  }
  $scope.touch=function(id){
    var obj=document.getElementById(id);
    obj.removeEventListener("touchmove", false,false);
    obj.addEventListener("touchmove", touchMove, false);
    
    function touchMove(event) {
      var contentHandle=$ionicSideMenuDelegate;
      var p=1;
      if(contentHandle.isOpen()){
        var p=1-contentHandle.getOpenRatio()/5;
        //obj.style.zoom=1-p;
      }
      obj.style.webkitTransform="scale("+p+")";
    }
  }
})

.controller('PlaylistsCtrl', function($scope,$cordovaBarcodeScanner) {
  //$scope.touch('id1');
  var tl = new TimelineLite(); 
  tl.staggerFrom(".topics", 3, {
    css:{transform:"scale(0)",top:"60%",left:"50%"},ease:Elastic.easeOut
  }, 0.3);


  var js = document.getElementById("js");
  var sass = document.getElementById("sass");
  var php = document.getElementById("php");
  var css3 = document.getElementById("css3");
  var hmtl5 = document.getElementById("html5");
  var topics = document.getElementsByClassName("topics");


  //js.addEventListener("mouseover",jsretina,false);
  js.addEventListener("touchstart",jsretina,false);
  //html5.addEventListener("mouseover",html5retina,false);
  html5.addEventListener("touchstart",html5retina,false);
  //sass.addEventListener("mouseover",sassretina,false);
  sass.addEventListener("touchstart",sassretina,false);
  //php.addEventListener("mouseover",phpretina,false);
  php.addEventListener("touchstart",phpretina,false);
  //css3.addEventListener("mouseover",css3retina,false);
  css3.addEventListener("touchstart",css3retina,false);

  function jsretina(event) {
    TweenMax.to("#retina", 0.2, {left:"51%",top:"59.5%"});
  }

  function html5retina(event) {
    TweenMax.to("#retina", 0.2, {left:"49%",top:"59.5%"});
  }

  function css3retina(event) {
    TweenMax.to("#retina", 0.2, {left:"49%",top:"60.2%"});
  }

  function phpretina(event) {
    TweenMax.to("#retina", 0.2, {left:"51%",top:"60.2%"});
  }

  function sassretina(event) {
    TweenMax.to("#retina", 0.2, {left:"50%",top:"59%"});
  }


  for(var i=0; i< topics.length; i++){
    topics[i].addEventListener("mouseout",retinaout);
  }
  function retinaout(event) {
      TweenMax.to("#retina", 0.2, {left:"50%",top:"60%"});  
  }
  $scope.openRecipes= function() {
    //$scope.recipesModal.hide();
    $state.go("app.recipes",{shopID:"2004"},{reload:true});
  };
  $scope.scanBarcode = function() {
      //$scope.$broadcast('openRecipesModal');
      //$scope.$emit('openRecipesModal');
      //return;
      $cordovaBarcodeScanner.scan().then(function(imageData) {
      //$scope.openLink(imageData.text);
      //$scope.openRecipesModal();
      //$scope.$broadcast('openRecipesModal');
      //$scope.$emit('openRecipesModal');
      $state.go("app.recipes",{shopID:"2004"},{reload:true});
      console.log("Barcode Format -> " + imageData.format);
      console.log("Cancelled -> " + imageData.cancelled);
    }, function(error) {
      alert(error);
      console.log("An error happened -> " + error);
    });
  }
})
// .controller('RecipesCtrl', function($scope, $stateParams) {
  
// })
.controller("SearchCtrl", function($scope) {
  
})
.controller('LoginCtrl', function($scope,localStorageService) {

    $scope.message = "";
    localStorageService.update('rememberUser',{username:'Leo',password:'123456'});
    //rememberUser
    var reuser=localStorageService.get("rememberUser");
    //alert(JSON.stringify(reuser));
    $scope.user = {};
    if(reuser){
      $scope.user.username=reuser.username;
      $scope.user.password=reuser.password;
    }
    $scope.login = function() {
      //AuthService.login($scope.user);
      ($scope.user.username!=reuser.username||$scope.user.password!=reuser.password)&&
      ($scope.message='用户名或密码错误');
      $scope.loadingShow();
      $scope.message||$scope.doLogin();
      $scope.loadingHide();
      //$scope.doLogin();

    };
    // $scope.logout = function() {
    //   AuthService.logout();
    // };

    // $scope.$on(AUTH_EVENTS.loginFailed, function(e, mess) {
    //   $scope.message=mess;
    // });
    
});
