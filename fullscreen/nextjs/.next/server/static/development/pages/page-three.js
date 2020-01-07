module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/react-awesome-button/dist/themes/theme-c137.css":
/*!**************************************************************************************************************************!*\
  !*** /Users/rcaferati/Projects/github/react-awesome-slider/node_modules/react-awesome-button/dist/themes/theme-c137.css ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/content/content.js":
/*!***************************************!*\
  !*** ./components/content/content.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _content_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content.scss */ "./components/content/content.scss");
/* harmony import */ var _content_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_content_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/content/content.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const Content = ({
  main,
  action
}) => {
  return __jsx("div", {
    className: "content",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: undefined
  }, __jsx("div", {
    className: "content__main",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }, main), action && __jsx("div", {
    className: "content__action",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }, action));
};

/* harmony default export */ __webpack_exports__["default"] = (Content);

/***/ }),

/***/ "./components/content/content.scss":
/*!*****************************************!*\
  !*** ./components/content/content.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/fullpage/fullpage.css":
/*!******************************************!*\
  !*** ./components/fullpage/fullpage.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/fullpage/fullpage.js":
/*!*****************************************!*\
  !*** ./components/fullpage/fullpage.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-slider */ "react-awesome-slider");
/* harmony import */ var react_awesome_slider__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_awesome_slider_dist_custom_animations_fold_out_animation_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-awesome-slider/dist/custom-animations/fold-out-animation.css */ "./node_modules/react-awesome-slider/dist/custom-animations/fold-out-animation.css");
/* harmony import */ var react_awesome_slider_dist_custom_animations_fold_out_animation_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_custom_animations_fold_out_animation_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "react-awesome-slider/dist/navigation");
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _media__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./media */ "./components/fullpage/media.js");
/* harmony import */ var _startup_startup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../startup/startup */ "./components/startup/startup.js");
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/fullpage/fullpage.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;





 // DATA/MEDIA

const Slider = Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__["withNavigationHandlers"])(react_awesome_slider__WEBPACK_IMPORTED_MODULE_1___default.a);
/* harmony default export */ __webpack_exports__["default"] = (() => {
  const isFirstLoad = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(true);
  return __jsx(Slider, {
    startupScreen: __jsx(_startup_startup__WEBPACK_IMPORTED_MODULE_5__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16
      },
      __self: undefined
    }),
    startupDelay: 300,
    className: "awesome-slider",
    onTransitionEnd: () => {
      // HANDLE THE PAGE ELEMENTS ANIMATION ON FIRST TRANSITION END
      if (isFirstLoad.current === true) {
        document.querySelector('body').classList.add('visible');
      }
    },
    media: _media__WEBPACK_IMPORTED_MODULE_4__["media"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  });
});

/***/ }),

/***/ "./components/fullpage/media.js":
/*!**************************************!*\
  !*** ./components/fullpage/media.js ***!
  \**************************************/
/*! exports provided: Home, media */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Home", function() { return Home; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "media", function() { return media; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-button */ "react-awesome-button");
/* harmony import */ var react_awesome_button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-awesome-button/dist/themes/theme-c137.css */ "../../node_modules/react-awesome-button/dist/themes/theme-c137.css");
/* harmony import */ var react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "react-awesome-slider/dist/navigation");
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lettering_lettering__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lettering/lettering */ "./components/lettering/lettering.js");
/* harmony import */ var _content_content__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../content/content */ "./components/content/content.js");
/* harmony import */ var _mouse_mouse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mouse/mouse */ "./components/mouse/mouse.js");
/* harmony import */ var _section_section__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../section/section */ "./components/section/section.js");
/* harmony import */ var _page_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../page/page */ "./components/page/page.js");
/* harmony import */ var _fullpage_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./fullpage.css */ "./components/fullpage/fullpage.css");
/* harmony import */ var _fullpage_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_fullpage_css__WEBPACK_IMPORTED_MODULE_9__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/fullpage/media.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;










const Home = Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__["withNavigationContext"])(({
  fullpage
}) => {
  return __jsx(_section_section__WEBPACK_IMPORTED_MODULE_7__["default"], {
    wrapper: false,
    backgroundColor: "#292c35",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }, __jsx(_content_content__WEBPACK_IMPORTED_MODULE_5__["default"], {
    main: __jsx(_lettering_lettering__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: "INDEX",
      text: ['This is a single full page fixed screen.'],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      },
      __self: undefined
    }),
    action: __jsx("div", {
      className: "button",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      },
      __self: undefined
    }, __jsx(react_awesome_button__WEBPACK_IMPORTED_MODULE_1__["AwesomeButton"], {
      size: "medium",
      onPress: () => {
        fullpage.navigate('/page-two');
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      },
      __self: undefined
    }, "Next Page")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }));
});
const media = [{
  slug: '',
  className: 'slide page-one',
  children: __jsx(Home, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: undefined
  })
}, {
  slug: 'page-two',
  className: 'sectioned page-two',
  children: __jsx(_page_page__WEBPACK_IMPORTED_MODULE_8__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: undefined
  }, __jsx(_section_section__WEBPACK_IMPORTED_MODULE_7__["default"], {
    wrapper: false,
    backgroundColor: "#4158b4",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: undefined
  }, __jsx(_content_content__WEBPACK_IMPORTED_MODULE_5__["default"], {
    main: __jsx(_lettering_lettering__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: "PAGE-TWO",
      text: ['This is multiple section page, scroll down to view more content.'],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      },
      __self: undefined
    }),
    action: __jsx(_mouse_mouse__WEBPACK_IMPORTED_MODULE_6__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60
      },
      __self: undefined
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: undefined
  })), __jsx(_section_section__WEBPACK_IMPORTED_MODULE_7__["default"], {
    backgroundColor: "#617be3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: undefined
  }, __jsx(_lettering_lettering__WEBPACK_IMPORTED_MODULE_4__["default"], {
    title: "PAGE-SECTION",
    text: ['This is a continued page section.'],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: undefined
  })))
}, {
  slug: 'page-three',
  url: 'https://caferati.me/images/series/bojack-0.png',
  className: 'slide page-three',
  children: __jsx(_lettering_lettering__WEBPACK_IMPORTED_MODULE_4__["default"], {
    title: "PAGE-THREE",
    text: ['Screen with preloaded background image.'],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: undefined
  })
}];

/***/ }),

/***/ "./components/layout/layout.css":
/*!**************************************!*\
  !*** ./components/layout/layout.css ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/layout/layout.js":
/*!*************************************!*\
  !*** ./components/layout/layout.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "react-awesome-slider/dist/navigation");
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _layout_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout.css */ "./components/layout/layout.css");
/* harmony import */ var _layout_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_layout_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nav_nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nav/nav */ "./components/nav/nav.js");
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/layout/layout.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;





const Layout = ({
  children,
  page
}) => {
  return __jsx(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__["Provider"], {
    page: page,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }, __jsx(_nav_nav__WEBPACK_IMPORTED_MODULE_3__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: undefined
  }), __jsx("main", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: undefined
  }, children));
};

/* harmony default export */ __webpack_exports__["default"] = (Layout);

/***/ }),

/***/ "./components/lettering/lettering.css":
/*!********************************************!*\
  !*** ./components/lettering/lettering.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/lettering/lettering.js":
/*!*******************************************!*\
  !*** ./components/lettering/lettering.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lettering_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lettering.css */ "./components/lettering/lettering.css");
/* harmony import */ var _lettering_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lettering_css__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/lettering/lettering.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const Lettering = ({
  text = [],
  title = ''
}) => {
  const renderText = () => {
    return text && text.length ? text.map((line, index) => {
      return __jsx("p", {
        key: `${index}`,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        },
        __self: undefined
      }, line);
    }) : null;
  };

  return __jsx("div", {
    className: "lettering",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }, __jsx("h1", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }, title), renderText());
};

/* harmony default export */ __webpack_exports__["default"] = (Lettering);

/***/ }),

/***/ "./components/mouse/mouse.js":
/*!***********************************!*\
  !*** ./components/mouse/mouse.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mouse_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse.scss */ "./components/mouse/mouse.scss");
/* harmony import */ var _mouse_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mouse_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/mouse/mouse.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const Mouse = ({
  visible = true
}) => {
  const className = ['scroll'];

  if (visible === false) {
    className.push('hidden');
  }

  return __jsx("button", {
    className: className.join(' ').trim(),
    title: "Choose Wisely",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: undefined
  }, __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Mouse);

/***/ }),

/***/ "./components/mouse/mouse.scss":
/*!*************************************!*\
  !*** ./components/mouse/mouse.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/nav/nav.css":
/*!********************************!*\
  !*** ./components/nav/nav.css ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/nav/nav.js":
/*!*******************************!*\
  !*** ./components/nav/nav.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "react-awesome-slider/dist/navigation");
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _react_logo_react_logo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../react-logo/react-logo */ "./components/react-logo/react-logo.js");
/* harmony import */ var _nav_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nav.css */ "./components/nav/nav.css");
/* harmony import */ var _nav_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nav_css__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/nav/nav.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




const Nav = Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__["withNavigationContext"])(({
  fullpage
}) => {
  const {
    slug
  } = fullpage.navigation;
  return __jsx("header", {
    className: "page-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: undefined
  }, __jsx("div", {
    className: "page-header__title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }, __jsx(_react_logo_react_logo__WEBPACK_IMPORTED_MODULE_2__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }), __jsx("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: undefined
  }, __jsx("h1", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: undefined
  }, __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: undefined
  }, "REACT"), __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: undefined
  }, "AWESOME SLIDER")), __jsx("h2", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: undefined
  }, "FULL-PAGE TRANSITION STRATEGY"))), __jsx("nav", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: undefined
  }, __jsx(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    className: slug === '' ? 'selected' : null,
    href: "/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: undefined
  }, "index"), __jsx(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    className: slug === 'page-two' ? 'selected' : null,
    href: "/page-two",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: undefined
  }, "page-two"), __jsx(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    className: slug === 'page-three' ? 'selected' : null,
    href: "/page-three",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: undefined
  }, "page-three")));
});
/* harmony default export */ __webpack_exports__["default"] = (Nav);

/***/ }),

/***/ "./components/page/page.css":
/*!**********************************!*\
  !*** ./components/page/page.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/page/page.js":
/*!*********************************!*\
  !*** ./components/page/page.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _page_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./page.css */ "./components/page/page.css");
/* harmony import */ var _page_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_css__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/page/page.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const Page = ({
  children
}) => {
  return __jsx("div", {
    className: "page",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5
    },
    __self: undefined
  }, children);
};

/* harmony default export */ __webpack_exports__["default"] = (Page);

/***/ }),

/***/ "./components/react-logo/react-logo.js":
/*!*********************************************!*\
  !*** ./components/react-logo/react-logo.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_logo_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./react-logo.scss */ "./components/react-logo/react-logo.scss");
/* harmony import */ var _react_logo_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_react_logo_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/react-logo/react-logo.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const ReactLogo = () => {
  return __jsx("div", {
    className: "logo-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: undefined
  }, __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }), __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }), __jsx("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (ReactLogo);

/***/ }),

/***/ "./components/react-logo/react-logo.scss":
/*!***********************************************!*\
  !*** ./components/react-logo/react-logo.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/section/section.css":
/*!****************************************!*\
  !*** ./components/section/section.css ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./components/section/section.js":
/*!***************************************!*\
  !*** ./components/section/section.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _section_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./section.css */ "./components/section/section.css");
/* harmony import */ var _section_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_section_css__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/section/section.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const Section = ({
  children,
  wrapper = true,
  backgroundColor = '#FFFFFF'
}) => {
  return __jsx("section", {
    className: "section",
    style: {
      backgroundColor
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: undefined
  }, wrapper ? __jsx("div", {
    className: "section-wrapper",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }, children) : children);
};

/* harmony default export */ __webpack_exports__["default"] = (Section);

/***/ }),

/***/ "./components/startup/startup.js":
/*!***************************************!*\
  !*** ./components/startup/startup.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_logo_react_logo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../react-logo/react-logo */ "./components/react-logo/react-logo.js");
/* harmony import */ var _startup_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./startup.scss */ "./components/startup/startup.scss");
/* harmony import */ var _startup_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_startup_scss__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/startup/startup.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




const Startup = () => {
  return __jsx("div", {
    className: "startup",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }, __jsx(_react_logo_react_logo__WEBPACK_IMPORTED_MODULE_1__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Startup);

/***/ }),

/***/ "./components/startup/startup.scss":
/*!*****************************************!*\
  !*** ./components/startup/startup.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/react-awesome-slider/dist/custom-animations/fold-out-animation.css":
/*!*****************************************************************************************!*\
  !*** ./node_modules/react-awesome-slider/dist/custom-animations/fold-out-animation.css ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./pages/page-three.js":
/*!*****************************!*\
  !*** ./pages/page-three.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_layout_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/layout/layout */ "./components/layout/layout.js");
/* harmony import */ var _components_fullpage_fullpage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/fullpage/fullpage */ "./components/fullpage/fullpage.js");
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/pages/page-three.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




const PageThree = () => {
  return __jsx(_components_layout_layout__WEBPACK_IMPORTED_MODULE_1__["default"], {
    page: "page-three",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }, __jsx(_components_fullpage_fullpage__WEBPACK_IMPORTED_MODULE_2__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (PageThree);

/***/ }),

/***/ 4:
/*!***********************************!*\
  !*** multi ./pages/page-three.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/pages/page-three.js */"./pages/page-three.js");


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-awesome-button":
/*!***************************************!*\
  !*** external "react-awesome-button" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-awesome-button");

/***/ }),

/***/ "react-awesome-slider":
/*!***************************************!*\
  !*** external "react-awesome-slider" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-awesome-slider");

/***/ }),

/***/ "react-awesome-slider/dist/navigation":
/*!*******************************************************!*\
  !*** external "react-awesome-slider/dist/navigation" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-awesome-slider/dist/navigation");

/***/ })

/******/ });
//# sourceMappingURL=page-three.js.map