angular.module('directives', [])

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

            $rootScope.getScrollPosition = function(scroll) {
                var moveData=0;
                 if(scroll!=undefined){
                    moveData=$ionicScrollDelegate.$getByHandle(scroll).getScrollPosition().top;
                }else{
                    moveData = $ionicScrollDelegate.getScrollPosition().top;
                }
                // console.log(moveData);
                (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')&&
                (scope.$apply(function(){
                        if(moveData>150){
                            scope.show=true;
                        }else{
                            scope.show=false;
                        }
                    })); //apply 
                }
           //getScrollPosition 
        }
    };
})

.directive('searchbar',function () {
	return {
		require: ['?KeysCtrl'],
		restrict: 'EA',
		scope:{ngModel:'='},
		replace: true,
		template: '<ion-nav-buttons side="right">'+
						'<div class="searchBar">'+
							'<div class="searchTxt item-input-inset bar" ng-if="ngModel.show">'+
						  		'<label class="item-input-wrapper">'+
						  		'<i class="ion-ios-search placeholder-icon"></i>'+
						  		'<input ng-focus="ngModel.show" type="search" placeholder="搜索内容" ng-model="ngModel.txt"/></label>'+
						  		/*'<div class="bgtxt">'+
						  			'<input type="text" placeholder="输入搜索内容" ng-model="ngModel.txt">'+
						  		'</div>'+*/
					  		'</div>'+
						  	'<i class="icon placeholder-icon ion-ios-search" style="color: #F8F8F8;" ng-click="ngModel.show&&toggle(ngModel.txt);ngModel.txt=\'\';ngModel.show=!ngModel.show;"></i>'+
						'</div>'+
					'</ion-nav-buttons>',
		link:function(scope,element, attrs){  
		           // angular.element(element[0].getElementsByTagName("input")[0]).onkeyup = function(e){  
		           //     if(this.value&&e.code==13){  
		           //         alert(1111);
		           //     }  
		           // };
		     //       element.bind('mouseleave',function(){
					  //   alert(1111);
				   // });
		           element.find('input').onkeyup = function(e){  
		               if(this.value&&e.code==13){  
		                   alert(1111);
		               }  
		           };
		       },		
	}
})
.directive('ionAffix', ['$ionicPosition', '$compile', function ($ionicPosition, $compile) {

        // keeping the Ionic specific stuff separated so that they can be changed and used within an other context

        // see https://api.jquery.com/closest/ and http://ionicframework.com/docs/api/utility/ionic.DomUtil/
        function getParentWithClass(elementSelector, parentClass) {
            return angular.element(ionic.DomUtil.getParentWithClass(elementSelector[0], parentClass));
        }

        // see http://underscorejs.org/#throttle
        function throttle(theFunction) {
            return ionic.Utils.throttle(theFunction);
        }

        // see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        // see http://ionicframework.com/docs/api/utility/ionic.DomUtil/
        function requestAnimationFrame(callback) {
            return ionic.requestAnimationFrame(callback);
        }

        // see https://api.jquery.com/offset/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        function offset(elementSelector) {
            return $ionicPosition.offset(elementSelector);
        }

        // see https://api.jquery.com/position/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        function position(elementSelector) {
            return $ionicPosition.position(elementSelector);
        }

        function applyTransform(element, transformString) {
            // do not apply the transformation if it is already applied
            if (element.style[ionic.CSS.TRANSFORM] == transformString) {
            }
            else {
                element.style[ionic.CSS.TRANSFORM] = transformString;
            }
        }

        function translateUp(element, dy, executeImmediately) {
            var translateDyPixelsUp = dy == 0 ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, -' + dy + 'px, 0px)';
            // if immediate execution is requested, then just execute immediately
            // if not, execute in the animation frame.
            if (executeImmediately) {
                applyTransform(element, translateDyPixelsUp);
            }
            else {
                // see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
                // see http://ionicframework.com/docs/api/utility/ionic.DomUtil/
                requestAnimationFrame(function () {
                    applyTransform(element, translateDyPixelsUp);
                });
            }
        }

        var CALCULATION_THROTTLE_MS = 500;

        return {
            // only allow adding this directive to elements as an attribute
            restrict: 'A',
            // we need $ionicScroll for adding the clone of affix element to the scroll container
            // $ionicScroll.element gives us that
            require: '^$ionicScroll',
            link: function ($scope, $element, $attr, $ionicScroll) {
                // get the affix's container. element will be affix for that container.
                // affix's container will be matched by "affix-within-parent-with-class" attribute.
                // if it is not provided, parent element will be assumed as the container
                var $container;
                if ($attr.affixWithinParentWithClass) {
                    $container = getParentWithClass($element, $attr.affixWithinParentWithClass);
                    if (!$container) {
                        $container = $element.parent();
                    }
                }
                else {
                    $container = $element.parent();
                }

                var scrollMin = 0;
                var scrollMax = 0;
                var scrollTransition = 0;
                // calculate the scroll limits for the affix element and the affix's container
                var calculateScrollLimits = function (scrollTop) {
                    var containerPosition = position($container);
                    var elementOffset = offset($element);

                    var containerTop = containerPosition.top;
                    var containerHeight = containerPosition.height;

                    var affixHeight = elementOffset.height;

                    scrollMin = scrollTop + containerTop;
                    scrollMax = scrollMin + containerHeight;
                    scrollTransition = scrollMax - affixHeight;
                };
                // throttled version of the same calculation
                var throttledCalculateScrollLimits = throttle(
                    calculateScrollLimits,
                    CALCULATION_THROTTLE_MS,
                    {trailing: false}
                );

                var affixClone = null;

                // creates the affix clone and adds it to DOM. by default it is put to top
                var createAffixClone = function () {
                    var clone = $element.clone().css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        background:'#fff',
                    });

                    // if directive is given an additional CSS class to apply to the clone, then apply it
                    if ($attr.affixClass) {
                        clone.addClass($attr.affixClass);
                    }
                    clone.children('div').css({opacity:1});
                    // remove the directive matching attribute from the clone, so that an affix is not created for the clone as well.
                    clone.removeAttr('ion-affix').removeAttr('data-ion-affix').removeAttr('x-ion-affix');
					//clone.attr('ng-model',"currentTitle");
					//clone.attr('ng-click',"change('111')");
					//clone.find('.ion-affix-shown').css('diaplay','block');
                    angular.element($ionicScroll.element).append(clone);

                    // compile the clone so that anything in it is in Angular lifecycle.
                    $compile(clone)($scope);

                    return clone;
                };

                // removes the affix clone from DOM. also deletes the reference to it in the memory.
                var removeAffixClone = function () {
                    if (affixClone)
                        affixClone.remove();
                    affixClone = null;
                };

                $scope.$on("$destroy", function () {
                    // 2 important things on destroy:
                    // remove the clone
                    // unbind the scroll listener
                    // see https://github.com/aliok/ion-affix/issues/1
                    removeAffixClone();
                    angular.element($ionicScroll.element).off('scroll');
                });


                angular.element($ionicScroll.element).on('scroll', function (event) {
                    var scrollTop = (event.detail || event.originalEvent && event.originalEvent.detail).scrollTop;
                    // when scroll to top, we should always execute the immediate calculation.
                    // this is because of some weird problem which is hard to describe.
                    // if you want to experiment, always use the throttled one and just click on the page
                    // you will see all affix elements stacked on top
                    if (scrollTop == 0) {
                        calculateScrollLimits(scrollTop);
                    }
                    else {
                        throttledCalculateScrollLimits(scrollTop);
                    }

                    // when we scrolled to the container, create the clone of element and place it on top
                    if (scrollTop >= scrollMin && scrollTop <= scrollMax) {

                        // we need to track if we created the clone just now
                        // that is important since normally we apply the transforms in the animation frame
                        // but, we need to apply the transform immediately when we add the element for the first time. otherwise it is too late!
                        var cloneCreatedJustNow = false;
                        if (!affixClone) {
                            affixClone = createAffixClone();
                            cloneCreatedJustNow = true;
                        }

                        // if we're reaching towards the end of the container, apply some nice translation to move up/down the clone
                        // but if we're reached already to the container and we're far away than the end, move clone to top
                        if (scrollTop > scrollTransition) {
                            translateUp(affixClone[0], Math.floor(scrollTop - scrollTransition), cloneCreatedJustNow);
                        } else {
                            translateUp(affixClone[0], 0, cloneCreatedJustNow);
                        }
                    } else {
                        removeAffixClone();
                    }
                });
            }
        }
    }])
 .directive('ionFloatingButton', function () {

     return {
         restrict: 'E',
         scope: {
             click: '&?',
             //buttonColor: '@?',
             //buttonClass: '@?',
             icon: '@?',
             //iconColor: '@?',
             //hasFooter: '=?'
            },
            template: '<ul id="floating-button" style="bottom:60px"'+
                    'ng-click="click()">' +
                    '<li style="background: rgba(0,0,0,0);">' +
                    '<i class="icon menu-icon ion-ios-arrow-thin-up" style="color:#53cac3" ng-class="{ \'{{icon}}\' : true}"></i>' +
                    '</li></ul>',
            // template: '<ul id="floating-button" ng-style="{\'bottom\' : \'{{bottomValue}}\' }">' +
            //          '<li ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
            //          '<a ng-click="click()"><i class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i></a>' +
            //          '</li>' +
            //          '</ul>',
         replace: true,
         transclude: true,
         controller: function ($scope) {
             //$scope.buttonColor = $scope.buttonColor || '#2AC9AA';
             $scope.icon = $scope.icon || 'ion-plus';
             //$scope.iconColor = $scope.iconColor || '#fff';
             //$scope.hasFooter = $scope.hasFooter || false;
             //if ($scope.hasFooter) {
             //    $scope.bottomValue = '60px';
             //} else {
             //    $scope.bottomValue = '20px';
             //}
         }
     };
 })
 .directive('ionFliterBar', function() {
    return {
        restrict: 'E',
        template: '<div class="tabs-striped tabs-top tabs-background-light tabs-color-senty">'+
    '<div class="tabs">'+
      '<a class="tab-item ion-arrow-down-b icon-right button button-small icon no-border"'+
      'ng-class="{\'active\': fliter==1}" '+
      'ng-click="showFliter(1)">匹配</a>'+
      '<a  class="tab-item ion-arrow-down-b icon-right button button-small icon no-border"'+
      'ng-class="{\'active\':fliter==2}"'+
      'ng-click="showFliter(2)">区域</a>'+
      '<a class="tab-item ion-arrow-down-b icon-right button button-small icon no-border" '+
      'ng-class="{\'active\': fliter==3}" '+
      'ng-click="showFliter(3)">类型</a>'+
      '<a class="tab-item ion-arrow-down-b icon-right button button-small icon no-border"'+ 
      'ng-class="{\'active\': fliter==4}"'+ 
      'ng-click="showFliter(4)">时间</a>'+
    '</div>'+
    '<div class="fliter" ng-class="{\'active\':fliter}">'+
        '<section ng-if="fliter==1">'+
        '<div class="button-bar">'+
            '<a class="button button-clear button-small button-dark" ng-click="search.q(\'\',\'全部\')"'+
            'ng-class="{\'button-senty\':search.qName==\'全部\'}">全部</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.q(\'title\',\'标题\')"'+
            'ng-class="{\'button-senty\':search.qName==\'标题\'}">标题</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.q(\'content\',\'内容\')"'+
            'ng-class="{\'button-senty\':search.qName==\'内容\'}">内容</a>'+
         '</div>'+
         '</section>'+
         '<section ng-if="fliter==2">'+
         '<div class="button-bar">'+
            '<a class="button button-small button-dark button-clear"'+ 
            'ng-click="search.location(\'\');" '+
            'ng-class="{\'button-senty\':search.locationName==\'全部\'}">全部</a>'+
            '<a class="button button-small button-dark button-clear"'+ 
            'ng-click="search.location(1)"'+
            'ng-class="{\'button-senty\':search.locationName==\'本地\'}">本地</a>'+
            '<a class="button button-clear button-small button-dark" '+
            'ng-click="search.location(2)">外地</a>'+
            '<a class="button button-small button-dark button-clear" '+
            'ng-click="search.location(3)"'+
            'ng-class="{\'button-senty\':search.locationName==\'境外\'}">境外</a>'+
         '</div>'+
         '</section>'+
          '<section ng-if="fliter==3">'+
         '<div class="button-bar">'+
            '<a class="button button-clear button-small button-dark" '+
            'ng-click="search.fq(\'platform\',\'\')"'+
            'ng-class="{\'button-senty\':!search.fqs.platform}">全部</a>'+            
            '<a class="button button-small button-dark button-clear" ng-click="search.fq(\'platform\',1)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==1}">资讯</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',2)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==2}">论坛</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',3)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==3}">微博</a>'+
          '</div>'+
           '<div class="button-bar">'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',4)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==4}">博客</a>'+            
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',5)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==5}">QQ</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',10)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==10}">微信</a>'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',8)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==8}">邮件</a>'+
          '</div>'+
           '<div class="button-bar">'+
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',6)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==6}">元搜索</a> '+           
            '<a class="button button-clear button-small button-dark" ng-click="search.fq(\'platform\',9)"'+
            'ng-class="{\'button-senty\':search.fqs.platform==9}">图片识别</a>'+         
          '</div>'+
          '</section>'+
           '<section ng-if="fliter==4">'+
             '<div class="button-bar">'+
                '<a class="button button-clear button-small button-dark" ng-click="search.time(\'\',\'全部\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'全部\'}">全部</a>'+            
                '<a class="button button-clear button-small button-dark" ng-click="search.time(-1,\'一天内\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'一天内\'}">一天内</a>'+
                '<a class="button button-clear button-small button-dark" ng-click="search.time(-2,\'2天内\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'2天内\'}">2天内</a>'+
              '</div>'+
               '<div class="button-bar">'+
                '<a class="button button-clear button-small button-dark" ng-click="search.time(-3,\'3天内\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'3天内\'}">3天内</a>  '+          
                '<a class="button button-clear button-small button-dark" ng-click="search.time(-7,\'一周内\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'一周内\'}">一周内</a>'+
                '<a class="button button-clear button-small button-dark" ng-click="search.time(-30,\'一个月内\')"'+
                'ng-class="{\'button-senty\':search.timeName==\'一个月内\'}">一个月内</a>  '+   
              '</div></section></div> </div>',
        replace: true
    };
})
.directive('wave',function () {
    return {
        restrict: 'EA',
        //scope:true,
        replace: true,
        template: ' <canvas class="waves" id="personCanvas"></canvas>',
        link:function($scope,element, attrs){ 
            $scope.TAU = Math.PI * 2;
            $scope.density = 1;
            $scope.speed = 1;
            $scope.res = 0.005; // percentage of screen per x segment
            $scope.outerScale = 0.05 / $scope.density;
            $scope.inc = 0;
            $scope.c = element[0];
            $scope.ctx = $scope.c.getContext('2d');
            var loop=function () {
              $scope.inc -= $scope.speed;
              drawWave();
              requestAnimationFrame(loop);
            }
            var drawWave=function () {
              var w = $scope.c.offsetWidth;
              var h = $scope.c.offsetHeight;
              var cx = w ;
              var cy = h * 0.2;
              $scope.ctx.clearRect(0, 0, w, h);
              var segmentWidth = w * $scope.res;
              $scope.ctx.fillStyle = '#53cac3';
              $scope.ctx.beginPath();
              $scope.ctx.moveTo(0, cy);
              for (var i = 0, endi = 1 / $scope.res; i <= endi; i++) {
                var _y = cy + Math.sin((i + $scope.inc) * $scope.TAU * $scope.res * $scope.density) * cy * Math.sin(i * $scope.TAU * $scope.res * $scope.density * $scope.outerScale);
                var _x = i * segmentWidth;
                $scope.ctx.lineTo(_x, _y);
              }
              $scope.ctx.lineTo(w, h);
              $scope.ctx.lineTo(0, h);
              $scope.ctx.closePath();
              $scope.ctx.fill();
            }
            var waves =(function (){
              var grad = $scope.ctx.createLinearGradient(0, 0, 0, $scope.c.height * 4);
              grad.addColorStop(0, 'rgba(223, 191, 32, 1)');
              grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              loop();
            })();
        
        }
    }
})
.directive('luna',function () {
    return {
        restrict: 'E',
        replace: true,
         scope:{
            domElement:'@?',
        },
        template: '<div style="position: absolute;"></div>',//
        link:function($scope,element, attrs){   
            var container, stats;
            var camera, controls, scene, renderer;
            var mesh, texture, geometry, material;
            var worldWidth = 128, worldDepth = 128, 
            worldHalfWidth = worldWidth / 2,worldHalfDepth = worldDepth / 2;
            var sky;
            var clock = new THREE.Clock();            
            function init() {

              //container = element[0].getElementById('container');

              camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2500);

              var cameraX = 0;
              var cameraY = 70;
              var cameraZ = 0;

              camera.position.x = cameraX;
              camera.position.y = cameraY;
              camera.position.z = cameraZ;

              scene = new THREE.Scene();
              scene.fog = new THREE.FogExp2(0x004076, 0.0006);

              // moon
              var sphereGeometry = new THREE.SphereGeometry(100, 16, 16);
              var sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shininess: 10,
                emissive: 0xFFFFFF,
                emissiveIntensity: 3
              });
              var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
              sphere.position.set(0, 450, -2450); //-2500);

              scene.add(sphere);

              // lights
              var pointMoonColor = "#FCFFB4";
              pointMoon = new THREE.PointLight(pointMoonColor, 1500, 300);
              pointMoon.position.set(0, 450, -2500);
              scene.add(pointMoon);
              // scene.add(new THREE.PointLightHelper(pointMoon, 1));

              // ambient
              var ambiColor = "#0c0c0c";
              var ambientLight = new THREE.AmbientLight(ambiColor);
              scene.add(ambientLight);

              // lights
              var pointAColor = "#FFA600";
              pointA = new THREE.PointLight(pointAColor, 50, 1);
              pointA.position.set(0, 70, 0);
              scene.add(pointA);
              scene.add(new THREE.PointLightHelper(pointA, 1));

              // right light
              var dirLightL = new THREE.DirectionalLight(0xffffff, 1);
              dirLightL.position.set(20, 0, 0);
              scene.add(dirLightL);

              // from behing
              var dirLightBehind = new THREE.DirectionalLight(0x004076, 10);
              dirLightBehind.position.set(0, 0, -500);
              scene.add(dirLightL);

              var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
              var cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000
              });
              var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
              cube.position.y = 250;
              scene.add(cube);

              geometry = new THREE.PlaneGeometry(10000, 10000, worldWidth * 2 - 1, worldDepth * 2 - 1);

              geometry.rotateX(Math.PI / 2);
              //geometry.rotation.x = Math.PI/2;

              for (var i = 0, l = geometry.vertices.length; i < l; i++) {

                geometry.vertices[i].y = 5 * Math.sin(i / 4);

              }

              material = new THREE.MeshPhongMaterial({
                color: 0x004076,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide,
                shininess: 25,
                wireframe: false
              });

              mesh = new THREE.Mesh(geometry, material);
              scene.add(mesh);

              // SKY

              // moons light

              var spotColor = "#BF93FF";
              var spotLight = new THREE.SpotLight(spotColor);
              spotLight.angle = Math.PI;
              spotLight.position.set(0, 160, -2000);
              spotLight.distance = 5000;
              spotLight.intensity = 5;
              spotLight.castShadow = true;

              spotLight.shadowCameraVisible = true;

              spotLight.target = cube;
              scene.add(spotLight);

              renderer = new THREE.WebGLRenderer();
              renderer.setClearColor(0x004076);
              //renderer.setPixelRatio( window.devicePixelRatio );
              renderer.setSize(window.innerWidth, window.innerHeight);

              //container.innerHTML = "";

              //container.appendChild(renderer.domElement);t;
            element.append(renderer.domElement);
              stats = new Stats();
              //container.appendChild( stats.dom );
              //

              //window.addEventListener('resize', onWindowResize, false);

            }

            //

           function animate() {

              requestAnimationFrame(animate);

              render();
              stats.update();

            }

            function render() {

              var delta = clock.getDelta(),
                time = clock.getElapsedTime() * 10;

              for (var i = 0, l = geometry.vertices.length; i < l; i++) {
                geometry.vertices[ i ].y = 3 * Math.sin( i / 2 + ( time + i / 3 ) / 5 );
                
                //geometry.vertices[i].y = 3 * Math.sin(i / 2 + (time + i * 0.5 / 5) / 8);


              }

              // spin sea
              mesh.rotation.y += 0.0005;

              mesh.geometry.verticesNeedUpdate = true;

              // controls.update( delta );
              renderer.render(scene, camera);

            }
            init();
            animate();
        }
    }
})
.directive('gridThingie',function () {
    return {
        restrict: 'E',
        replace: true,
         scope:{
            domElement:'@?',
        },
        template: '<div style="position: absolute;"></div>',//
        link:function($scope,element, attrs){
            var PRNG = function( exports ){
                function setSeed( seed )
                {
                    // Create a length 624 array to store the state of the generator
                    exports.MT = new Uint32Array( 624 );
                    exports.index = 0;
                    exports.MT[ 0 ] = seed;
                    for( var i = 1 ; i < 624; i++ )
                    {
                        exports.MT[ i ] = ( 1812433253 * ( exports.MT[i-1] ^ ( exports.MT[ i-1 ] >> 30  ) + i ) );
                    }
                }
                function extractNumber()
                {
                    if( exports.index == 0 ) { exports.generateNumbers() }

                    var y = exports.MT[ exports.index ];
                    y = y ^ ( y >> 11 );
                    y = y ^ ( ( y << 7 ) & 2636928640 );
                    y = y ^ ( ( y << 15 ) & 4022730752 );
                    y = y ^ ( y >> 18 );

                    exports.index = ( exports.index + 1 ) % 624;
                    return y;
                }

                function generateNumbers()
                {
                    for( var i = 0; i < 624; i++ )
                    {
                        var y = ( exports.MT[ i ] & 0x80000000 ) + ( exports.MT[( i + 1 ) % 624 ] & 0x7fffffff );
                        exports.MT[ i ] = exports.MT[ ( i + 397 ) % 624] ^ ( y >> 1 );
                        if ( y % 2 != 0 )
                        {
                            exports.MT[ i ] = exports.MT[ i ] ^ 2567483615;
                        }
                    }
                }
                exports.generateNumbers = generateNumbers;
                exports.extractNumber = extractNumber;
                function random() { return ( exports.extractNumber() / 0x7FFFFFFF ); }
                exports.setSeed = setSeed;
                exports.random = random;
                setSeed(0);
                return exports;
            }({});
            function squareDistance(v1, v2){
                var dx = (v2[0]-v1[0]);
                var dy = (v2[1]-v1[1]);
                return dx*dx + dy*dy;
            }
            function norm( t, a, b ){return ( t - a ) / ( b - a );}


            function yolo( vertices, size, _w, _h ){

                var sides = 3;
                var l = 2 * Math.sin( Math.PI / sides );
                var a = l / ( 2 * Math.tan( Math.PI / sides ) );
                var h = ( 1 + a );

                size = size || 1;
                l *= size;
                h *= size;

                var mx = 2 * Math.ceil( _w / l );
                var my = Math.ceil( _h / h );

                ctx.beginPath();
                vertices.forEach( function( v ){

                    var cell_x = Math.round( norm( v[0], 0, _w ) * mx + .5 );
                    var cell_y = Math.round( norm( v[1], 0, _h ) * my + .5 );

                    var md = Number.POSITIVE_INFINITY, d, x, y, ix, iy;
                    for( var i = cell_x - 1; i < cell_x + 1; i++ ){

                        for( var j = cell_y - 1; j < cell_y + 1; j++ ){

                            if( Math.abs( i ) % 4 == 0 && Math.abs( j ) % 4 == 0 )continue;

                            if( ( Math.abs( i ) % 2 == 1 && Math.abs( j ) % 2 == 0 )
                            ||  ( Math.abs( i ) % 2 == 0 && Math.abs( j ) % 2 == 1 ) ){

                                ix = ( i ) * l/2;
                                iy = ( j ) * h;

                                d = squareDistance( [ix,iy], v );
                                if( d < md ){
                                    md = d;
                                    x = ( i ) * l/2;
                                    y = ( j ) * h;
                                }
                            }
                        }
                    }
                    ctx.moveTo( v[0], v[1] );
                    ctx.lineTo( x, y );
                } );
                ctx.stroke();
            }




            var size = 1024;
            var canvas = document.createElement('canvas');
            canvas.style.position ="absolute";
            canvas.style.top ="0";
            canvas.style.left ="0";
            canvas.width = canvas.height = size;
            ctx = canvas.getContext('2d');
            element.append( canvas );

            //drawGrid(vertices);
            var vertices;
            function update(){

                PRNG.setSeed(3);

                var r, a, v, o;
                var count   = 20;
                var spawn   = 40;
                var offset  = 100;
                vertices = [];
                for( var i = 0; i< count; i++ ){

                    r = ( PRNG.random() - .5 ) * size / 2;
                    a = (i%2==0?-1:1) * Date.now() * 0.0001 + PRNG.random() * Math.PI * 2;
                    v = [
                        Math.cos( a ) * r,
                        Math.sin( a ) * r
                    ];
                    vertices.unshift( v );

                    for( var j = 0; j < spawn * ( .5 + PRNG.random() ); j++ ){

                        r = PRNG.random() * offset;
                        a = (j%2==0?-1:1) * Date.now() * 0.0002 + PRNG.random() * Math.PI * 2;
                        o = vertices[ 0 ];
                        v = [
                            o[0] + Math.cos( a % r ) * r,
                            o[1] + Math.sin( a % r * 2 ) * r
                        ];
                        vertices.push( v );
                    }
                }

                ctx.restore();
                ctx.save();

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                ctx.globalAlpha = 1;
                ctx.fillStyle = "#000";
                ctx.fillRect( 0,0, canvas.width, canvas.height );
                ctx.translate( canvas.width/2,canvas.height/2 );

                ctx.strokeStyle = "#FFF";

                var m = size/2;
                for( i = 8; i <= m; i *= 2 ){

                    ctx.globalAlpha = (1 - i/m) * .1;
                    yolo(  vertices, i, size, size );

                }
                requestAnimationFrame( update );
            }
            //update();
        }
    }
})

.directive('backgroundView',function () {
    return {
        restrict: 'EA',
        scope:{
            mess:'@?',
            data:'@?',
            tip:'@?',
        },
        replace: true,
        template:'<section class="no-result" ng-if="!data">'+
                '<div class="noresult"><i></i><span>{{tip}}</span><span>{{mess}}</span></div></section>',
        link:function($scope,element, attrs){
            $scope.data=attrs.len; 
            $scope.tip="正在努力加载...";
            $scope.mess=attrs.mess;
        },
        controller:function ($scope) {
            $scope.mess=="热点早知道"||($scope.tip="哎~没有找到");
        }
    }
})
.directive('select', function($timeout) {
  return {
    restrict: 'E',
    link: function(_, element) {
      element.bind('focus', function(e) {
        $timeout(function() {
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          }
        })
      });
      element.bind('blur', function(e) {
        $timeout(function() {
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
        });
      });
    }
  }
});