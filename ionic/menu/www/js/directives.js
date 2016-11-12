angular.module('directives', [])
.directive('scrollWatch', function($rootScope) {
  return function(scope, $scroller, attr) {
    var start = 0;
    var threshold = 150;
    
    $scroller.bind('scroll', function(e) {
      if(e.detail.scrollTop - start > threshold) {
        $rootScope.slideHeader = true;
      } else {
        $rootScope.slideHeader = false;
      }
      if ($rootScope.slideHeaderPrevious >= e.detail.scrollTop - start) {
        $rootScope.slideHeader = false;
      }
      $rootScope.slideHeaderPrevious = e.detail.scrollTop - start;
      $rootScope.$apply();
    });
  };
})
.directive('scrollTopButton', function($ionicScrollDelegate,$rootScope) {
    return {
        restrict: 'E',
        scope:{
            scrollToTop:'&?',
            show:'@?',
        },
        replace:true,
        template: '<ul id="floating-button" style="bottom:60px" ng-init="show=false"'+
                    ' ng-hide="!show" ng-click="scrollToTop()">' +
                    '<li style="background: rgba(0,0,0,0);">' +
                    '<i class="icon menu-icon ion-ios-arrow-thin-up" style="color:#53cac3"></i>' +
                    '</li></ul>',
        replace: true,
        link: function(scope, element, attrs) {
            scope.scrollToTop=function() {
                if(attrs.scroll){
                    $ionicScrollDelegate.$getByHandle(attrs.scroll).scrollTop(true);
                }else{
                    $ionicScrollDelegate.scrollTop(true);
                }
                scope.show=false;  //hide the button when reached top
            }
            scope.start=0;

            $rootScope.getScrollPosition = function(scroll) {
                var moveData=0;
                
                 //if(scroll!=undefined){
                moveData=$ionicScrollDelegate.$getByHandle(scroll).getScrollPosition().top;
                // }else{
                //     moveData = $ionicScrollDelegate.getScrollPosition().top;
                // }
                //$rootScope.hideNavHeader=moveData>scope.start;
                // console.log(moveData);
                (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')&&
                (scope.$apply(function(){
                  scope.show=moveData>150;
                                            
                      // if(moveData>150){
                      //   scope.show=true;
                      // }else{
                      //   scope.show=false;
                      // }
                    })); //apply 
                }
           //getScrollPosition 
        }
    };
})
.directive('elasticImage', function($ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $scroller, $attr) {
      var image = document.getElementById($attr.elasticImage);
      var imageHeight = image.offsetHeight;
      $scroller.bind('scroll', function(e) {
        var scrollTop = e.detail.scrollTop;
        var newImageHeight = imageHeight - scrollTop;
        if (newImageHeight < 0) {
          newImageHeight = 0;
        }
        image.style.height = newImageHeight + 'px';
      });
    }
  }
});