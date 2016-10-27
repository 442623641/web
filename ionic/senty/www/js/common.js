String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}    
function waves(){
    var paths = document.querySelectorAll('svg path');
    paths = Array.prototype.slice.call(paths);
    var props = {
      duration: 14000,
      fill: 'both',
      easing: 'ease-in-out',
      iterations: Infinity,
      direction: 'alternate'
    }
    var players = [];

    players[0] = paths[0].animate([
      {transform: 'translate(-80px, 5px)'},
      {transform: 'translate(80px, 0px)'},
    ], props);
    players[1] = paths[1].animate([
      {transform: 'translate(80px, 10px)'},
      {transform: 'translate(-80px, 0px)'},
    ], props);
    players[2] = paths[2].animate([
      {transform: 'translate(-20px, 0)'},
      {transform: 'translate(-80px, 10px)'},
    ], props);

    players[0].playbackRate = 1.2;
    players[2].playbackRate = .82;
}
function waves1(){
  TAU = Math.PI * 2;
  density = 1;
  speed = 1;
  res = 0.005; // percentage of screen per x segment
  outerScale = 0.05 / density;
  inc = 0;

  c = document.getElementsByTagName('canvas')[0];
  ctx = c.getContext('2d');

  var grad = ctx.createLinearGradient(0, 0, 0, c.height * 4);
  grad.addColorStop(0, 'rgba(223, 191, 32, 1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  loop();
}

function loop1() {
  inc -= speed;
  drawWave();
  requestAnimationFrame(loop);
}

function drawWave1() {
  var w = c.offsetWidth;
  var h = c.offsetHeight;
  var cx = w * 0.5;
  var cy = h * 0.2;
  ctx.clearRect(0, 0, w, h);
  var segmentWidth = w * res;
  ctx.fillStyle = '#53cac3';
  ctx.beginPath();
  ctx.moveTo(0, cy);
  for (var i = 0, endi = 1 / res; i <= endi; i++) {
    var _y = cy + Math.sin((i + inc) * TAU * res * density) * cy * Math.sin(i * TAU * res * density * outerScale);
    var _x = i * segmentWidth;
    ctx.lineTo(_x, _y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
}
      //# sourceURL=pen.js
    
