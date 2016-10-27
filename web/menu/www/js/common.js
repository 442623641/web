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
};
function findPosition( oElement )  
{  
  var x2 = 0;  
  var y2 = 0;  
  var width = oElement.offsetWidth;  
  var height = oElement.offsetHeight;  
  //alert(width + "=" + height);  
  if( typeof( oElement.offsetParent ) != 'undefined' )  
  {  
    for( var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent )  
    {  
      posX += oElement.offsetLeft;  
      posY += oElement.offsetTop;       
    }  
    x2 = posX + width;  
    y2 = posY + height;  
    return [ posX, posY ,x2, y2];  
     
    } else{  
      x2 = oElement.x + width;  
      y2 = oElement.y + height;  
      return [ oElement.x, oElement.y, x2, y2];  
  }  
}  
// var tl = new TimelineLite(); 
// tl.staggerFrom(".topics", 3, {
//   css:{transform:"scale(0)",top:"60%",left:"50%"},ease:Elastic.easeOut
// }, 0.3);


// var js = document.getElementById("js");
// var sass = document.getElementById("sass");
// var php = document.getElementById("php");
// var css3 = document.getElementById("css3");
// var hmtl5 = document.getElementById("html5");
// var topics = document.getElementsByClassName("topics");


// js.addEventListener("mouseover",jsretina,false);
// js.addEventListener("touchstart",jsretina,false);
// html5.addEventListener("mouseover",html5retina,false);
// html5.addEventListener("touchstart",html5retina,false);
// sass.addEventListener("mouseover",sassretina,false);
// sass.addEventListener("touchstart",sassretina,false);
// php.addEventListener("mouseover",phpretina,false);
// php.addEventListener("touchstart",phpretina,false);
// css3.addEventListener("mouseover",css3retina,false);
// css3.addEventListener("touchstart",css3retina,false);

// function jsretina(event) {
// 	TweenMax.to("#retina", 0.2, {left:"51%",top:"59.5%"});
// }

// function html5retina(event) {
// 	TweenMax.to("#retina", 0.2, {left:"49%",top:"59.5%"});
// }

// function css3retina(event) {
// 	TweenMax.to("#retina", 0.2, {left:"49%",top:"60.5%"});
// }

// function phpretina(event) {
// 	TweenMax.to("#retina", 0.2, {left:"51%",top:"60.5%"});
// }

// function sassretina(event) {
// 	TweenMax.to("#retina", 0.2, {left:"50%",top:"59%"});
// }


// for(var i=0; i< topics.length; i++){
// 	topics[i].addEventListener("mouseout",retinaout);
// }
// function retinaout(event) {
// 		TweenMax.to("#retina", 0.2, {left:"50%",top:"60%"});	
// }