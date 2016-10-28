angular.module('app.directives', [])
.directive('countCard', function() {
    return {
        restrict: 'E',
        scope:{
            // scrollToTop:'&?',
            // show:'@?',
        },
        replace:true,
        template: '<div class="col-lg-3 col-sm-6"><section class="panel"><div class="symbol {{background}}">'+
                  '<i class="fa {{icon}}"></i></div><div class="value"><h1 class="count"></h1>'+
                  '<p>{{title}}</p></div></section></div>',
        replace: true,
        link: function($scope, element, attrs) {
          $scope.icon=attrs.icon;
          $scope.background=attrs.background;
          $scope.title=attrs.title;
          var countUp =function countUp(count)
          {
              var div_by = 100,
                  speed = Math.round(count / div_by),
                  $display =$(element).find('.count'),
                  run_count = 1,
                  int_speed =12;

              var int = setInterval(function() {
                  if(run_count < div_by){
                      $display.text(speed * run_count);
                      run_count++;
                  } else if(parseInt($display.text()) < count) {
                      var curr_count = parseInt($display.text()) + 1;
                      $display.text(curr_count);
                  } else {
                      clearInterval(int);
                  }
              }, int_speed);
          }
          countUp(attrs.count);
           
        }
    };
})
.directive('myMap', function() {
   return {
        restrict: 'E',
        scope:{},
        replace:true,
        template: '<div><div class="form-group">'+
                  '<label class="col-sm-4 control-label" for="suggestId">输入地理名称可快速定位</label>'+
                  '<div class="col-sm-8"><input type="text" class="form-control input-sm" id="suggestId"/></div>'+
                  '<div id="searchResultPanel" class="col-sm-8" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;">{{address}}</div>'+
                  '</div>'+
                  '<div class="form-group" id="l-map" style="height:50vh"></div></div>',
        link: function($scope) {
          // 百度地图API功能
            $('.anchorBL').remove();
            function G(id) {
              return document.getElementById(id);
            }
            $scope.address='蜀山区金寨路217号';

            var map = new BMap.Map("l-map");
            //map.centerAndZoom($scope.address,18);                   // 初始化地图,设置城市和地图级别。
            map.centerAndZoom(new BMap.Point(117.278131,31.852094), 18);
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var geoc = new BMap.Geocoder();
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : "suggestId"
                ,"location" : map
              });

              ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
              var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                  value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }    
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                
                value = "";
                if (e.toitem.index > -1) {
                  _value = e.toitem.value;
                  value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }    
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
              });

              var myValue=$scope.address;
              ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
              var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                
                setPlace();
              });

              function setPlace(){
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun(){
                  var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                  map.centerAndZoom(pp, 19);
                  var marker=new BMap.Marker(pp);
                  map.addOverlay(marker);    //添加标注
                  marker.enableDragging();
                  marker.addEventListener('dragend',function(){
                    var p=marker.getPosition();       //获取marker的位置
                    //var pt = e.point;
                    geoc.getLocation(p, function(rs){
                      var addComp = rs.addressComponents;
                      $scope.address=addComp.province  + addComp.city  + addComp.district + addComp.street  + addComp.streetNumber;
                      $scope.code=p;
                      //alert(addComp.province  + addComp.city  + addComp.district + addComp.street  + addComp.streetNumber);
                    });
                    //alert("位置" + p.lng + "," + p.lat);
                  })
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                  onSearchComplete: myFun
                });
                local.search(myValue);
              }
            setPlace();

         }
      }
});