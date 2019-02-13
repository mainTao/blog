/*! iFrame Resizer (iframeSizer.min.js ) - v3.6.3 - 2018-10-28
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2018 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!function(a){"use strict";function b(a,b,c){"addEventListener"in window?a.addEventListener(b,c,!1):"attachEvent"in window&&a.attachEvent("on"+b,c)}function c(a,b,c){"removeEventListener"in window?a.removeEventListener(b,c,!1):"detachEvent"in window&&a.detachEvent("on"+b,c)}function d(){var a,b=["moz","webkit","o","ms"];for(a=0;a<b.length&&!P;a+=1)P=window[b[a]+"RequestAnimationFrame"];P||h("setup","RequestAnimationFrame not supported")}function e(a){var b="Host page: "+a;return window.top!==window.self&&(b=window.parentIFrame&&window.parentIFrame.getId?window.parentIFrame.getId()+": "+a:"Nested host page: "+a),b}function f(a){return M+"["+e(a)+"]"}function g(a){return R[a]?R[a].log:I}function h(a,b){k("log",a,b,g(a))}function i(a,b){k("info",a,b,g(a))}function j(a,b){k("warn",a,b,!0)}function k(a,b,c,d){!0===d&&"object"==typeof window.console&&console[a](f(b),c)}function l(a){function d(){function a(){t(U),q(V),I("resizedCallback",U)}f("Height"),f("Width"),u(a,U,"init")}function e(){var a=S.substr(N).split(":");return{iframe:R[a[0]]&&R[a[0]].iframe,id:a[0],height:a[1],width:a[2],type:a[3]}}function f(a){var b=Number(R[V]["max"+a]),c=Number(R[V]["min"+a]),d=a.toLowerCase(),e=Number(U[d]);h(V,"Checking "+d+" is in range "+c+"-"+b),e<c&&(e=c,h(V,"Set "+d+" to min value")),e>b&&(e=b,h(V,"Set "+d+" to max value")),U[d]=""+e}function g(){function b(){function a(){var a=0,b=!1;for(h(V,"Checking connection is from allowed list of origins: "+d);a<d.length;a++)if(d[a]===c){b=!0;break}return b}function b(){var a=R[V]&&R[V].remoteHost;return h(V,"Checking connection is from: "+a),c===a}return d.constructor===Array?a():b()}var c=a.origin,d=R[V]&&R[V].checkOrigin;if(d&&""+c!="null"&&!b())throw new Error("Unexpected message received from: "+c+" for "+U.iframe.id+". Message was: "+a.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return!0}function k(){return M===(""+S).substr(0,N)&&S.substr(N).split(":")[0]in R}function l(){var a=U.type in{true:1,false:1,undefined:1};return a&&h(V,"Ignoring init message from meta parent page"),a}function n(a){return S.substr(S.indexOf(":")+L+a)}function x(a){h(V,"MessageCallback passed: {iframe: "+U.iframe.id+", message: "+a+"}"),I("messageCallback",{iframe:U.iframe,message:JSON.parse(a)}),h(V,"--")}function y(){var a=document.body.getBoundingClientRect(),b=U.iframe.getBoundingClientRect();return JSON.stringify({iframeHeight:b.height,iframeWidth:b.width,clientHeight:Math.max(document.documentElement.clientHeight,window.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,window.innerWidth||0),offsetTop:parseInt(b.top-a.top,10),offsetLeft:parseInt(b.left-a.left,10),scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset})}function A(a,b){function c(){v("Send Page Info","pageInfo:"+y(),a,b)}z(c,32,b)}function B(){function a(a,b){function c(){R[f]?A(R[f].iframe,f):d()}["scroll","resize"].forEach(function(d){h(f,a+d+" listener for sendPageInfo"),b(window,d,c)})}function d(){a("Remove ",c)}function e(){a("Add ",b)}var f=V;e(),R[f]&&(R[f].stopPageInfo=d)}function C(){R[V]&&R[V].stopPageInfo&&(R[V].stopPageInfo(),delete R[V].stopPageInfo)}function D(){var a=!0;return null===U.iframe&&(j(V,"IFrame ("+U.id+") not found"),a=!1),a}function E(a){var b=a.getBoundingClientRect();return p(V),{x:Math.floor(Number(b.left)+Number(O.x)),y:Math.floor(Number(b.top)+Number(O.y))}}function F(a){function b(){O=f,G(),h(V,"--")}function c(){return{x:Number(U.width)+e.x,y:Number(U.height)+e.y}}function d(){window.parentIFrame?window.parentIFrame["scrollTo"+(a?"Offset":"")](f.x,f.y):j(V,"Unable to scroll to requested position, window.parentIFrame not found")}var e=a?E(U.iframe):{x:0,y:0},f=c();h(V,"Reposition requested from iFrame (offset x:"+e.x+" y:"+e.y+")"),window.top!==window.self?d():b()}function G(){!1!==I("scrollCallback",O)?q(V):r()}function H(a){function b(){var a=E(f);h(V,"Moving to in page link (#"+d+") at x: "+a.x+" y: "+a.y),O={x:a.x,y:a.y},G(),h(V,"--")}function c(){window.parentIFrame?window.parentIFrame.moveToAnchor(d):h(V,"In page link #"+d+" not found and window.parentIFrame not found")}var d=a.split("#")[1]||"",e=decodeURIComponent(d),f=document.getElementById(e)||document.getElementsByName(e)[0];f?b():window.top!==window.self?c():h(V,"In page link #"+d+" not found")}function I(a,b){return m(V,a,b)}function J(){switch(R[V]&&R[V].firstRun&&Q(),U.type){case"close":R[V].closeRequestCallback?m(V,"closeRequestCallback",R[V].iframe):o(U.iframe);break;case"message":x(n(6));break;case"scrollTo":F(!1);break;case"scrollToOffset":F(!0);break;case"pageInfo":A(R[V]&&R[V].iframe,V),B();break;case"pageInfoStop":C();break;case"inPageLink":H(n(9));break;case"reset":s(U);break;case"init":d(),I("initCallback",U.iframe);break;default:d()}}function K(a){var b=!0;return R[a]||(b=!1,j(U.type+" No settings for "+a+". Message was: "+S)),b}function P(){for(var a in R)v("iFrame requested init",w(a),document.getElementById(a),a)}function Q(){R[V]&&(R[V].firstRun=!1)}var S=a.data,U={},V=null;"[iFrameResizerChild]Ready"===S?P():k()?(U=e(),V=T=U.id,R[V]&&(R[V].loaded=!0),!l()&&K(V)&&(h(V,"Received: "+S),D()&&g()&&J())):i(V,"Ignored: "+S)}function m(a,b,c){var d=null,e=null;if(R[a]){if("function"!=typeof(d=R[a][b]))throw new TypeError(b+" on iFrame["+a+"] is not a function");e=d(c)}return e}function n(a){var b=a.id;delete R[b]}function o(a){var b=a.id;h(b,"Removing iFrame: "+b);try{a.parentNode&&a.parentNode.removeChild(a)}catch(c){}m(b,"closedCallback",b),h(b,"--"),n(a)}function p(b){null===O&&(O={x:window.pageXOffset!==a?window.pageXOffset:document.documentElement.scrollLeft,y:window.pageYOffset!==a?window.pageYOffset:document.documentElement.scrollTop},h(b,"Get page position: "+O.x+","+O.y))}function q(a){null!==O&&(window.scrollTo(O.x,O.y),h(a,"Set page position: "+O.x+","+O.y),r())}function r(){O=null}function s(a){function b(){t(a),v("reset","reset",a.iframe,a.id)}h(a.id,"Size reset requested by "+("init"===a.type?"host page":"iFrame")),p(a.id),u(b,a,"reset")}function t(a){function b(b){if(!a.id)return void h("undefined","messageData id not set");a.iframe.style[b]=a[b]+"px",h(a.id,"IFrame ("+e+") "+b+" set to "+a[b]+"px")}function c(b){J||"0"!==a[b]||(J=!0,h(e,"Hidden iFrame detected, creating visibility listener"),A())}function d(a){b(a),c(a)}var e=a.iframe.id;R[e]&&(R[e].sizeHeight&&d("height"),R[e].sizeWidth&&d("width"))}function u(a,b,c){c!==b.type&&P?(h(b.id,"Requesting animation frame"),P(a)):a()}function v(a,b,c,d,e){function f(){var e=R[d]&&R[d].targetOrigin;h(d,"["+a+"] Sending msg to iframe["+d+"] ("+b+") targetOrigin: "+e),c.contentWindow.postMessage(M+b,e)}function g(){j(d,"["+a+"] IFrame("+d+") not found")}function i(){c&&"contentWindow"in c&&null!==c.contentWindow?f():g()}function k(){function a(){!R[d]||R[d].loaded||l||(l=!0,j(d,"IFrame has not responded within "+R[d].warningTimeout/1e3+" seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."))}e&&R[d]&&R[d].warningTimeout&&(R[d].msgTimeout=setTimeout(a,R[d].warningTimeout))}var l=!1;d=d||c.id,R[d]&&(i(),k())}function w(a){return a+":"+R[a].bodyMarginV1+":"+R[a].sizeWidth+":"+R[a].log+":"+R[a].interval+":"+R[a].enablePublicMethods+":"+R[a].autoResize+":"+R[a].bodyMargin+":"+R[a].heightCalculationMethod+":"+R[a].bodyBackground+":"+R[a].bodyPadding+":"+R[a].tolerance+":"+R[a].inPageLinks+":"+R[a].resizeFrom+":"+R[a].widthCalculationMethod}function x(c,d){function e(){function a(a){1/0!==R[y][a]&&0!==R[y][a]&&(c.style[a]=R[y][a]+"px",h(y,"Set "+a+" = "+R[y][a]+"px"))}function b(a){if(R[y]["min"+a]>R[y]["max"+a])throw new Error("Value for min"+a+" can not be greater than max"+a)}b("Height"),b("Width"),a("maxHeight"),a("minHeight"),a("maxWidth"),a("minWidth")}function f(){var a=d&&d.id||U.id+H++;return null!==document.getElementById(a)&&(a+=H++),a}function g(a){return T=a,""===a&&(c.id=a=f(),I=(d||{}).log,T=a,h(a,"Added missing iframe ID: "+a+" ("+c.src+")")),a}function i(){switch(h(y,"IFrame scrolling "+(R[y]&&R[y].scrolling?"enabled":"disabled")+" for "+y),c.style.overflow=!1===(R[y]&&R[y].scrolling)?"hidden":"auto",R[y]&&R[y].scrolling){case"omit":break;case!0:c.scrolling="yes";break;case!1:c.scrolling="no";break;default:c.scrolling=R[y]?R[y].scrolling:"no"}}function k(){"number"!=typeof(R[y]&&R[y].bodyMargin)&&"0"!==(R[y]&&R[y].bodyMargin)||(R[y].bodyMarginV1=R[y].bodyMargin,R[y].bodyMargin=R[y].bodyMargin+"px")}function l(){var a=R[y]&&R[y].firstRun,b=R[y]&&R[y].heightCalculationMethod in Q;!a&&b&&s({iframe:c,height:0,width:0,type:"init"})}function m(){Function.prototype.bind&&R[y]&&(R[y].iframe.iFrameResizer={close:o.bind(null,R[y].iframe),removeListeners:n.bind(null,R[y].iframe),resize:v.bind(null,"Window resize","resize",R[y].iframe),moveToAnchor:function(a){v("Move to anchor","moveToAnchor:"+a,R[y].iframe,y)},sendMessage:function(a){a=JSON.stringify(a),v("Send Message","message:"+a,R[y].iframe,y)}})}function p(d){function e(){v("iFrame.onload",d,c,a,!0),l()}b(c,"load",e),v("init",d,c,a,!0)}function q(a){if("object"!=typeof a)throw new TypeError("Options is not an object")}function r(a){for(var b in U)U.hasOwnProperty(b)&&(R[y][b]=a.hasOwnProperty(b)?a[b]:U[b])}function t(a){return""===a||"file://"===a?"*":a}function u(a){a=a||{},R[y]={firstRun:!0,iframe:c,remoteHost:c.src.split("/").slice(0,3).join("/")},q(a),r(a),R[y]&&(R[y].targetOrigin=!0===R[y].checkOrigin?t(R[y].remoteHost):"*")}function x(){return y in R&&"iFrameResizer"in c}var y=g(c.id);x()?j(y,"Ignored iFrame, already setup."):(u(d),i(),e(),k(),p(w(y)),m())}function y(a,b){null===S&&(S=setTimeout(function(){S=null,a()},b))}function z(a,b,c){V[c]||(V[c]=setTimeout(function(){V[c]=null,a()},b))}function A(){function a(){function a(a){function b(b){return"0px"===(R[a]&&R[a].iframe.style[b])}function c(a){return null!==a.offsetParent}R[a]&&c(R[a].iframe)&&(b("height")||b("width"))&&v("Visibility change","resize",R[a].iframe,a)}for(var b in R)a(b)}function b(b){h("window","Mutation observed: "+b[0].target+" "+b[0].type),y(a,16)}function c(){var a=document.querySelector("body"),c={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0};new d(b).observe(a,c)}var d=window.MutationObserver||window.WebKitMutationObserver;d&&c()}function B(a){function b(){D("Window "+a,"resize")}h("window","Trigger event: "+a),y(b,16)}function C(){function a(){D("Tab Visable","resize")}"hidden"!==document.visibilityState&&(h("document","Trigger event: Visiblity change"),y(a,16))}function D(a,b){function c(a){return R[a]&&"parent"===R[a].resizeFrom&&R[a].autoResize&&!R[a].firstRun}for(var d in R)c(d)&&v(a,b,document.getElementById(d),d)}function E(){b(window,"message",l),b(window,"resize",function(){B("resize")}),b(document,"visibilitychange",C),b(document,"-webkit-visibilitychange",C),b(window,"focusin",function(){B("focus")}),b(window,"focus",function(){B("focus")})}function F(){function b(a,b){function c(){if(!b.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==b.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+b.tagName+">")}b&&(c(),x(b,a),e.push(b))}function c(a){a&&a.enablePublicMethods&&j("enablePublicMethods option has been removed, public methods are now always available in the iFrame")}var e;return d(),E(),function(d,f){switch(e=[],c(d),typeof f){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(f||"iframe"),b.bind(a,d));break;case"object":b(d,f);break;default:throw new TypeError("Unexpected data type ("+typeof f+")")}return e}}function G(a){a.fn?a.fn.iFrameResize||(a.fn.iFrameResize=function(a){function b(b,c){x(c,a)}return this.filter("iframe").each(b).end()}):i("","Unable to bind to jQuery, it is not fully loaded.")}if("undefined"!=typeof window){var H=0,I=!1,J=!1,K="message",L=K.length,M="[iFrameSizer]",N=M.length,O=null,P=window.requestAnimationFrame,Q={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},R={},S=null,T="Host Page",U={autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,inPageLinks:!1,enablePublicMethods:!0,heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,warningTimeout:5e3,tolerance:0,widthCalculationMethod:"scroll",closedCallback:function(){},initCallback:function(){},messageCallback:function(){j("MessageCallback function not defined")},resizedCallback:function(){},scrollCallback:function(){return!0}},V={};window.jQuery&&G(window.jQuery),"function"==typeof define&&define.amd?define([],F):"object"==typeof module&&"object"==typeof module.exports?module.exports=F():window.iFrameResize=window.iFrameResize||F()}}();
//# sourceMappingURL=iframeResizer.map