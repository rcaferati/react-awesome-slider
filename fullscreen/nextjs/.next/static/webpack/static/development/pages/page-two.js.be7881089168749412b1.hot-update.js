webpackHotUpdate("static/development/pages/page-two.js",{

/***/ "./components/fullpage/fullpage.js":
/*!*****************************************!*\
  !*** ./components/fullpage/fullpage.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-slider */ "./node_modules/react-awesome-slider/dist/index.js");
/* harmony import */ var react_awesome_slider__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_awesome_slider_dist_custom_animations_cube_animation_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-awesome-slider/dist/custom-animations/cube-animation.css */ "./node_modules/react-awesome-slider/dist/custom-animations/cube-animation.css");
/* harmony import */ var react_awesome_slider_dist_custom_animations_cube_animation_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_custom_animations_cube_animation_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_awesome_slider_dist_custom_animations_fall_animation_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-awesome-slider/dist/custom-animations/fall-animation.css */ "./node_modules/react-awesome-slider/dist/custom-animations/fall-animation.css");
/* harmony import */ var react_awesome_slider_dist_custom_animations_fall_animation_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_custom_animations_fall_animation_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "./node_modules/react-awesome-slider/dist/navigation.js");
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _media__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./media */ "./components/fullpage/media.js");
/* harmony import */ var _startup_startup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../startup/startup */ "./components/startup/startup.js");
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/fullpage/fullpage.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;






 // DATA/MEDIA

var Slider = Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_4__["withNavigationHandlers"])(react_awesome_slider__WEBPACK_IMPORTED_MODULE_1___default.a);
/* harmony default export */ __webpack_exports__["default"] = (Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_4__["withNavigationContext"])(function (_ref) {
  var fullpage = _ref.fullpage;
  var isFirstLoad = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(true);
  console.log(navigation);
  return __jsx(Slider, {
    startupScreen: __jsx(_startup_startup__WEBPACK_IMPORTED_MODULE_6__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      },
      __self: this
    }),
    startupDelay: 750,
    animation: "cubeAnimation",
    className: "awesome-slider",
    onTransitionEnd: function onTransitionEnd() {
      // HANDLE THE PAGE ELEMENTS ANIMATION ON FIRST TRANSITION END
      if (isFirstLoad.current === true) {
        document.querySelector('body').classList.add('visible');
      }
    },
    media: _media__WEBPACK_IMPORTED_MODULE_5__["media"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  });
}));

/***/ })

})
//# sourceMappingURL=page-two.js.be7881089168749412b1.hot-update.js.map