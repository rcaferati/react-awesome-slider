!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("prop-types")):"function"==typeof define&&define.amd?define(["react","prop-types"],t):"object"==typeof exports?exports["react-awesome-button"]=t(require("react"),require("prop-types")):e["react-awesome-button"]=t(e.React,e.PropTypes)}(window,(function(__WEBPACK_EXTERNAL_MODULE__0__,__WEBPACK_EXTERNAL_MODULE__1__){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(s,o,function(t){return e[t]}.bind(null,o));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports=__WEBPACK_EXTERNAL_MODULE__0__},function(e,t){e.exports=__WEBPACK_EXTERNAL_MODULE__1__},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],s=!0,o=!1,r=void 0;try{for(var a,i=e[Symbol.iterator]();!(s=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);s=!0);}catch(e){o=!0,r=e}finally{try{!s&&i.return&&i.return()}finally{if(o)throw r}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}();t.serialize=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"&";return Object.entries(e).map((function(e){var t=s(e,2);return t[0]+"="+t[1]})).join(t)},t.classToModules=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];if(!t)return e.join(" ").trim();var n=[],s=e.length;for(;s--;)t[e[s]]&&n.push(t[e[s]]);return n},t.getClassName=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments[1];if(t)return t[e]||e;return e};t.MediaLoader=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),"undefined"!=typeof window&&(this.image=new Image,this.resolve=null,this.video=document.createElement("video"),this.events())}return o(e,[{key:"events",value:function(){var e=this;this.video.addEventListener("loadeddata",(function(){return e.resolve&&e.resolve(!0)})),this.video.addEventListener("loadeddata",(function(){return e.resolve&&e.resolve(!1)})),this.image.onload=function(){return e.resolve&&e.resolve(!0)},this.image.onerror=function(){return e.resolve&&e.resolve(!1)}}},{key:"load",value:function(e){var t=this;return new Promise((function(n){e||n(!0),t.resolve=n,t.loading=!0,t.ended=!1,e.match(/\.(mp4|webm)/i)&&t.video.setAttribute("src",e),e.match(/\.(png|jp(e)?g|gif|webp)/i)&&(t.image.src=e,(t.image.width>0||t.image.height>0)&&n(!0))}))}}]),e}()},function(e,t,n){e.exports=n(4)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,o=n(5),r=(s=o)&&s.__esModule?s:{default:s};t.default=r.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}(),r=f(n(0)),a=(f(n(1)),n(6)),i=n(2),l=n(7),c=f(n(8)),u=f(n(9)),d=f(n(10));function f(e){return e&&e.__esModule?e:{default:e}}var m="aws-sld",p=new i.MediaLoader,h=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.clickNext=function(){n.transitionRequest("next");var e=null===n.index?0:n.index+1;n.goTo({index:e,direction:!0})},n.clickPrev=function(){n.transitionRequest("prev"),n.goTo({index:n.index-1,direction:!1})},n.touchStart=function(e){if(!n.animating&&null!==n.index){var t=e.nativeEvent;n.touchStartPoint=t.touches[0].clientX}},n.touchMove=function(e){if(!n.animating&&n.touchStartPoint){var t=e.nativeEvent,s=t.touches[0].clientX-n.touchStartPoint,o=n[n.active],r=n[n.loader],a=!(s>0),i=Math.abs(s);!1!==n.touchEnabled?i>=10&&(!1===n.loading?n.goTo({index:a?n.index+1:n.index-1,direction:a,touch:!0}):!0===n.direction?(s+=10,Math.abs(s)>o.offsetWidth?s=-o.offsetWidth:s>0&&(s=0),o.style.transform="translate3d("+s+"px, 0, 0)",r.style.transform="translate3d(calc(100% + "+s+"px), 0, 0)"):(s-=10,Math.abs(s)>o.offsetWidth?s=o.offsetWidth:s<0&&(s=0),o.style.transform="translate3d("+s+"px, 0, 0)",r.style.transform="translate3d(calc(-100% + "+s+"px), 0, 0)")):i>20&&(n.touchEnabled=!0,n.touchStartPoint=t.touches[0].clientX)}},n.touchEnd=function(){!n.animating&&n.touchStartPoint&&n.loading&&(n.touchStartPoint=null,n.animating=!0,n.touchEnabled=!1,n.animateMobileEnd((function(){n.index=n.nextIndex,n.setState({index:n.index}),n.props.onTransitionEnd&&n.props.onTransitionEnd(s({},n.getInfo())),n.animating=!1,n.loading=!1,n.unchargeIndex()})))},n.bulletClick=function(e){var t=e.currentTarget,s=parseInt(t.getAttribute("data-index"),10);n.goTo({index:s,direction:!(n.index>s)},(function(){(0,a.onceNextCssLayout)().then((function(){t.classList.add(n.classNames.bulletsLoading)}))}))},n.rootElement=e.rootElement||m,n.boxA=null,n.boxB=null,n.loaded=[],n.active="boxA",n.loader="boxB",n.nextIndex=null,n.loading=!1,n.media=null,n.started=!1,n.touchEnabled=!1,n.setupStartup(e),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){this.boxA.classList.add(this.classNames.active),this.props.startupScreen&&(this.buttons.element.classList.add(this.classNames.controlsActive),!0===this.props.startup&&this.startup()),this.props.onFirstMount&&this.props.onFirstMount(s({},this.getInfo()))}},{key:"componentWillReceiveProps",value:function(e){if(this.checkChildren(e),this.setupClassNames(e.cssModule),e.name===this.props.name)if(!0!==e.startup||!1!==this.started)if(e.selected===this.props.selected)this.refreshSlider();else{var t=e.selected,n=!0===e.infinite&&0===t||!(this.index>t);this.goTo({index:t,direction:n})}else this.startup();else this.resetSlider(e.selected)}},{key:"getRootClassName",value:function(){var e=this.props,t=e.fillParent,n=e.infinite,s=e.className,o=e.organicArrows,r=e.disabled,a=e.cssModule;return(0,l.getRootClassName)({cssModule:a,disabled:r,organicArrows:o,className:s,infinite:n,fillParent:t,rootElement:this.rootElement,current:this.state.index,total:this.media.length})}},{key:"setupStartup",value:function(e){this.checkChildren(e),this.setupClassNames(e.cssModule),e.startupScreen?(this.index=null,this.state={index:this.index,boxA:{className:this.classNames.startUp,children:e.startupScreen},boxB:null}):(this.started=!0,this.index=this.props.selected,this.state={index:this.index,boxA:this.media[this.index]||null,boxB:null})}},{key:"getInfo",value:function(){return{slides:this.media.length,currentIndex:this.index,currentSlide:this[this.active],element:this.slider}}},{key:"getBar",value:function(){if(!document)return{};var e=document.createElement("div");return e.className=this.classNames.bar,e}},{key:"setupClassNames",value:function(e){this.classNames=(0,l.setupClassNames)(this.rootElement,e)}},{key:"refreshSlider",value:function(){if(!0!==this.loading&&!1!==this.props.startup){var e=this.index;this.setState({index:e,boxA:this.media[e],boxB:this.media[e]})}}},{key:"startup",value:function(){var e=this;this.started=!0,setTimeout((function(){(0,a.onceNextCssLayout)().then((function(){e.goTo({index:e.props.selected,direction:!0,touch:!1})}))}),125)}},{key:"resetSlider",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.index=t,this.setState({index:t,boxA:this.media[t],boxB:this.media[t]},(function(){e.props.onResetSlider&&e.props.onResetSlider(s({},e.getInfo()))}))}},{key:"checkChildren",value:function(e){e.children?e.children===this.props.children&&this.media||(this.media=(0,l.transformChildren)(e.children)):e.media!==this.props.media&&(this.media=e.media)}},{key:"loadContent",value:function(e,t){var n=this;return new Promise((function(s){if(!n.loaded.includes(t)&&t){var o=n.getBar();e.appendChild(o),(0,a.onceNextCssLayout)().then((function(){(0,a.onceNextCssLayout)().then((function(){o.classList.add(n.classNames.barActive)})),p.load(t).then((function(){n.loaded.push(t),(0,a.onceNextCssLayout)().then((function(){(0,a.onceTransitionEnd)(o).then((function(){s(o)})),o.classList.add(n.classNames.barEnd)}))}))}))}else s(null)}))}},{key:"startAnimationMobile",value:function(){var e=this.direction,t=this[this.active],n=this[this.loader],o=e?this.classNames.contentMoveRight:this.classNames.contentMoveLeft,r=e?this.classNames.contentMoveLeft:this.classNames.contentMoveRight;this.props.onTransitionStart&&this.props.onTransitionStart(s({},this.getInfo(),{nextSlide:this[this.loader],nextIndex:this.nextIndex}));var a=t.querySelector("."+this.classNames.content);a.classList.add(r),a.classList.add(this.classNames.contentExit);var i=n.querySelector("."+this.classNames.content);i.classList.add(o),i.classList.add(this.classNames.contentStatic)}},{key:"animateMobileEnd",value:function(e){var t=this,n=this.direction,s=this[this.active],o=this[this.loader],r=n?this.classNames.moveLeft:this.classNames.moveRight,i=n?this.classNames.contentMoveRight:this.classNames.contentMoveLeft,l=n?this.classNames.contentMoveLeft:this.classNames.contentMoveRight,c=o.querySelector("."+this.classNames.content),u=s.querySelector("."+this.classNames.content);c.classList.remove(this.classNames.contentStatic),o.classList.add(this.classNames.animatedMobile),s.classList.add(this.classNames.animatedMobile),(0,a.onceNextCssLayout)().then((function(){o.style.transform="translate3d(0, 0, 0)",s.style.transform="translate3d("+(t.direction?"-":"")+"100%, 0, 0)",(0,a.onceTransitionEnd)(s).then((function(){t.loading&&(o.classList.add(t.classNames.active),s.classList.remove(t.classNames.active),s.classList.remove(r),o.classList.remove(t.classNames.animatedMobile),s.classList.remove(t.classNames.animatedMobile),u.classList.remove(l),u.classList.remove(t.classNames.contentExit),c.classList.remove(i),setTimeout((function(){(0,a.onceNextCssLayout)().then((function(){t.buttons.element.classList.remove(t.classNames.controlsActive)}))}),t.props.controlsReturnDelay),t.activeArrow&&(t.activeArrow.classList.remove(t.activeArrowClass),t.activeArrow=null,t.activeArrowClass=null),t.active="boxA"===t.active?"boxB":"boxA",t.loader="boxA"===t.active?"boxB":"boxA",e&&e())}))}))}},{key:"runAnimation",value:function(e){var t=this,n=e.active,s=e.media,o=e.contentExitMoveClass,r=e.contentEnterMoveClass,i=e.activeContentElement,l=e.loaderContentElement,c=e.loader,u=e.loaderPosition,d=e.exitPosition,f=e.callback,m=e.transitionDelay;this.loadContent(n,s.url).then((function(e){i.classList.add(o),i.classList.add(t.classNames.contentExit),l.classList.add(r),l.classList.add(t.classNames.contentStatic),setTimeout((function(){(0,a.onceNextCssLayout)().then((function(){l.classList.remove(t.classNames.contentStatic),n.classList.add(t.classNames.exit),c.classList.add(u),n.classList.add(d),(0,a.onceAnimationEnd)(n).then((function(){c.classList.add(t.classNames.active),c.classList.remove(u),n.classList.remove(t.classNames.active),n.classList.remove(d),n.classList.remove(t.classNames.exit),i.classList.remove(o),i.classList.remove(t.classNames.contentExit),l.classList.remove(r),e&&n.removeChild(e),setTimeout((function(){(0,a.onceNextCssLayout)().then((function(){t.buttons.element.classList.remove(t.classNames.controlsActive)}))}),t.props.controlsReturnDelay),t.activeArrow&&(0,a.onceNextCssLayout)().then((function(){t.activeArrow.classList.remove(t.activeArrowClass),t.activeArrow=null,t.activeArrowClass=null})),t.active="boxA"===t.active?"boxB":"boxA",t.loader="boxA"===t.active?"boxB":"boxA",f&&f()}))}))}),m)}))}},{key:"startAnimation",value:function(e,t,n){var o=this.props.transitionDelay,r=this[this.active],a=this[this.loader],i=e?this.classNames.moveRight:this.classNames.moveLeft,l=e?this.classNames.moveLeft:this.classNames.moveRight,c=e?this.classNames.contentMoveRight:this.classNames.contentMoveLeft,u=e?this.classNames.contentMoveLeft:this.classNames.contentMoveRight,d=r.querySelector("."+this.classNames.content),f=a.querySelector("."+this.classNames.content);r.style.removeProperty("transform"),a.style.removeProperty("transform"),this.props.onTransitionStart&&this.props.onTransitionStart(s({},this.getInfo(),{nextSlide:this[this.loader],nextIndex:this.nextIndex}));var m={active:r,media:t,contentExitMoveClass:u,contentEnterMoveClass:c,activeContentElement:d,loaderContentElement:f,loader:a,loaderPosition:i,exitPosition:l,callback:n,transitionDelay:o};this.runAnimation(m)}},{key:"goTo",value:function(e){var t=this,n=e.index,o=e.direction,r=e.touch,i=void 0!==r&&r;!0!==this.loading&&n!==this.index&&(this.loading=!0,this.direction=o,!1===i?this.activateArrows(o,(function(){t.chargeIndex(n,(function(e){t.renderedLoader=!0,t.startAnimation(o,e,(function(){t.index=t.nextIndex,t.setState({index:t.index}),t.props.onTransitionEnd&&t.props.onTransitionEnd(s({},t.getInfo())),(0,a.onceNextCssLayout)().then((function(){t.loading=!1}))}))}))})):this.chargeIndex(n,(function(){t.activateArrows(o),t.startAnimationMobile()})))}},{key:"chargeIndex",value:function(e,t){this.nextIndex=e>this.media.length-1?0:e<0?this.media.length-1:e;var n={},o=this.media[this.nextIndex];n[this.loader]=s({loader:!0},o),this.setState(n,(function(){t(o)}))}},{key:"unchargeIndex",value:function(){var e={};e[this.loader]=null,this.setState(e,(function(){}))}},{key:"activateArrows",value:function(e,t){var n=e?this.buttons.next:this.buttons.prev,s=e?"right":"left";this.activeArrow=n.querySelector("span"),this.activeArrow?(this.activeArrowClass=(0,i.getClassName)(this.rootElement+"__controls__arrow-"+s+"--active",this.props.cssModule),(0,a.onceTransitionEnd)(this.activeArrow,{tolerance:null===this.index?0:2}).then((function(){t&&t()})),this.buttons.element.classList.add(this.classNames.controlsActive),this.activeArrow.classList.add(this.activeArrowClass)):t()}},{key:"transitionRequest",value:function(e){this.props.onTransitionRequest&&this.props.onTransitionRequest(s({eventName:e},this.getInfo()))}},{key:"renderBox",value:function(e){var t=this;return r.default.createElement("div",{ref:function(n){t["box"+e]=n},className:this.classNames.box,onTouchStart:this.touchStart,onTouchMove:this.touchMove,onTouchEnd:this.touchEnd},this.state["box"+e]&&r.default.createElement(d.default,{media:this.state["box"+e],className:this.classNames.content}))}},{key:"render",value:function(){var e=this,t=this.props,n=t.cssModule,s=t.organicArrows,o=t.bullets,a=t.style,i=this.rootElement;return r.default.createElement("div",{ref:function(t){e.slider=t},className:this.getRootClassName(),style:a},r.default.createElement("div",{ref:function(t){e.wrapper=t},className:this.classNames.wrapper},r.default.createElement("div",{ref:function(t){e.container=t},className:this.classNames.container},this.renderBox("A"),this.renderBox("B")),r.default.createElement(u.default,{rootElement:i,cssModule:n,onMount:function(t){e.buttons=t},onNext:this.clickNext,onPrev:this.clickPrev,organicArrows:s})),o&&r.default.createElement(c.default,{cssModule:n,rootElement:i,media:this.media,selected:this.state.index,onClick:function(t){e.transitionRequest("bullet"),e.goTo(t)}}))}}]),t}(r.default.Component);h.defaultProps={startup:!0,children:null,className:null,controlsReturnDelay:0,cssModule:null,disabled:!1,infinite:!0,media:[],bullets:!0,fillParent:!1,name:"awesome-slider",onFirstMount:null,onResetSlider:null,onTransitionEnd:null,onTransitionStart:null,onTransitionRequest:null,organicArrows:!0,rootElement:m,selected:0,startupScreen:null,style:{},transitionDelay:0},t.default=h},function(module,exports,__webpack_require__){var factory;window,factory=function(){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(s,o,function(t){return e[t]}.bind(null,o));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="./src/index.js")}({"./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: setCssEndEvent, beforeCssLayout, beforeNextCssLayout, beforeFutureCssLayout, onceNextCssLayout, onceTransitionEnd, onceAnimationEnd */function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCssEndEvent", function() { return setCssEndEvent; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeCssLayout", function() { return beforeCssLayout; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeNextCssLayout", function() { return beforeNextCssLayout; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeFutureCssLayout", function() { return beforeFutureCssLayout; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onceNextCssLayout", function() { return onceNextCssLayout; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onceTransitionEnd", function() { return onceTransitionEnd; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onceAnimationEnd", function() { return onceAnimationEnd; });\nfunction recursiveAnimationFrame(frames, callback) {\n  if (window && frames && Number.isInteger(frames) && frames > 0) {\n    window.requestAnimationFrame(() => {\n      recursiveAnimationFrame(frames - 1, callback);\n    });\n    return;\n  }\n  callback();\n}\n\nfunction setCssEndEvent(element, type, { tolerance = 0, propertyName } = {}) {\n  return new Promise(resolve => {\n    if (!element) {\n      resolve(false);\n      return;\n    }\n    let eventName = null;\n    const capitalized = type.charAt(0).toUpperCase() + type.slice(1);\n    let run = 0;\n    function end(event) {\n      const target = event.srcElement || event.target;\n      if (target === element) {\n        if (run >= tolerance) {\n          if (propertyName && propertyName !== event.propertyName) {\n            return;\n          }\n          element.removeEventListener(eventName, end);\n          resolve(event);\n        }\n        run += 1;\n      }\n    }\n    if (element.style[`Webkit${capitalized}`] !== undefined) {\n      eventName = `webkit${capitalized}End`;\n    }\n    if (element.style.OTransition !== undefined) {\n      eventName = `o${type}End`;\n    }\n    if (element.style[type] !== undefined) {\n      eventName = `${type}end`;\n    }\n    if (element.clearCssEndEvent) {\n      element.clearCssEndEvent();\n    }\n    element.clearCssEndEvent = function () {\n      element.removeEventListener(eventName, end);\n    };\n    element.addEventListener(eventName, end);\n  });\n}\n\nfunction beforeCssLayout(callback) {\n  window && window.requestAnimationFrame(callback);\n}\n\nfunction beforeNextCssLayout(callback) {\n  window && window.requestAnimationFrame(() => {\n    window.requestAnimationFrame(callback);\n  });\n}\n\nfunction beforeFutureCssLayout(frames, callback) {\n  recursiveAnimationFrame(frames + 1, callback);\n}\n\nfunction onceNextCssLayout() {\n  return new Promise(resolve => {\n    beforeNextCssLayout(resolve);\n  });\n}\n\nfunction onceTransitionEnd(element, options = {}) {\n  return new Promise(resolve => {\n    setCssEndEvent(element, "transition", options).then(resolve);\n  });\n}\n\nfunction onceAnimationEnd(element, options = {}) {\n  return new Promise(resolve => {\n    setCssEndEvent(element, "animation", options).then(resolve);\n  });\n}\n\n//# sourceURL=webpack://wac/./src/index.js?')}})},module.exports=factory()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e};t.getRootClassName=function(e){var t,n=e.rootElement,s=e.cssModule,r=e.disabled,a=e.organicArrows,i=e.className,l=e.total,c=e.current,u=e.infinite,d=e.fillParent,f=[n];!0===a&&f.push(n+"--organic-arrows");!0===r&&f.push(n+"--disabled");d&&f.push(n+"--fill-parent");!1===u&&(0===c&&f.push(n+"--first"),c===l-1&&f.push(n+"--last"));s&&s[n]&&(f=(0,o.classToModules)(f,s));i&&(t=f).push.apply(t,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(i.split(" ")));return f.join(" ").trim().replace(/[\s]+/gi," ")},t.transformChildren=function(e){var t=[];return(e.constructor===Array?e:[e]).forEach((function(e){var n=s({},e.props);e.props["data-src"]&&(n.url=e.props["data-src"]),t.push(n)})),t},t.setupClassNames=function(e,t){return{boxA:(0,o.getClassName)(e+"__boxA",t),boxB:(0,o.getClassName)(e+"__boxB",t),box:(0,o.getClassName)(e+"__box",t),container:(0,o.getClassName)(e+"__container",t),wrapper:(0,o.getClassName)(e+"__wrapper",t),bar:(0,o.getClassName)(e+"__bar",t),barActive:(0,o.getClassName)(e+"__bar--active",t),barEnd:(0,o.getClassName)(e+"__bar--end",t),content:(0,o.getClassName)(e+"__content",t),contentStatic:(0,o.getClassName)(e+"__content--static",t),contentMoveLeft:(0,o.getClassName)(e+"__content--moveLeft",t),contentMoveRight:(0,o.getClassName)(e+"__content--moveRight",t),controlsActive:(0,o.getClassName)(e+"__controls--active",t),animated:(0,o.getClassName)(e+"--animated",t),animatedMobile:(0,o.getClassName)(e+"--animated-mobile",t),contentExit:(0,o.getClassName)(e+"__content--exit",t),exit:(0,o.getClassName)(e+"--exit",t),active:(0,o.getClassName)(e+"--active",t),moveLeft:(0,o.getClassName)(e+"--moveLeft",t),moveRight:(0,o.getClassName)(e+"--moveRight",t),startUp:(0,o.getClassName)(e+"__startUp",t),bulletsLoading:(0,o.getClassName)(e+"__bullets--loading",t)}};var o=n(2)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}(),o=a(n(0)),r=(a(n(1)),n(2));function a(e){return e&&e.__esModule?e:{default:e}}var i=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.bulletClick=function(e){var t=e.currentTarget;t.classList.add((0,r.getClassName)(n.rootElement+"__bullets--loading",n.props.cssModule));var s=parseInt(t.getAttribute("data-index"),10),o=!(n.props.selected>s);n.props.onClick({index:s,direction:o})},n.rootElement=e.rootElement,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"renderBullets",value:function(){var e=this,t=this.props,n=t.cssModule,s=t.selected;return this.props.media.map((function(t,a){var i=a===s?(0,r.getClassName)(e.rootElement+"__bullets--active",n):null;return o.default.createElement("button",{key:"bullet-"+a,"data-index":a,onClick:e.bulletClick,className:i},a)}))}},{key:"render",value:function(){var e=this.props,t=e.cssModule,n=e.rootElement;return o.default.createElement("nav",{className:(0,r.getClassName)(n+"__bullets",t)},this.renderBullets())}}]),t}(o.default.Component);i.defaultProps={cssModule:null,selected:0},t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}(),o=a(n(0)),r=(a(n(1)),n(2));function a(e){return e&&e.__esModule?e:{default:e}}var i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"componentDidMount",value:function(){this.props.onMount({element:this.controls,next:this.next,prev:this.prev})}},{key:"render",value:function(){var e=this,t=this.props,n=t.rootElement,s=t.cssModule,a=t.organicArrows,i=t.onNext,l=t.onPrev;return o.default.createElement("div",{ref:function(t){e.controls=t},className:(0,r.getClassName)(n+"__controls",s)},o.default.createElement("button",{ref:function(t){e.next=t},className:(0,r.getClassName)(n+"__next",s),onClick:i},a&&o.default.createElement("span",{className:(0,r.getClassName)(n+"__controls__arrow-right",s)})),o.default.createElement("button",{ref:function(t){e.prev=t},className:(0,r.getClassName)(n+"__prev",s),onClick:l},a&&o.default.createElement("span",{className:(0,r.getClassName)(n+"__controls__arrow-left",s)})))}}]),t}(o.default.Component);i.defaultProps={cssModule:null,organicArrows:!0},t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var s=t[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,n,s){return n&&e(t.prototype,n),s&&e(t,s),t}}(),o=r(n(0));r(n(1));function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var i=function(e){function t(){var e,n,s;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,r=Array(o),i=0;i<o;i++)r[i]=arguments[i];return n=s=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),s.state={},a(s,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),s(t,[{key:"render",value:function(){var e=this.props,t=e.media,n=e.className,s=null;return t.url&&(s=t.url.match(/\.(mp4|webm)/)?o.default.createElement("video",{title:t.title,src:t.url,type:"video/mp4",controls:!0}):o.default.createElement("img",{alt:t.alt||t.title||null,src:t.url})),o.default.createElement("div",{className:n,style:t.style||null},s,t.children&&o.default.createElement("div",{className:t.className||null},t.children))}}]),t}(o.default.Component);t.default=i}])}));