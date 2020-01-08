webpackHotUpdate("static/development/pages/page-two.js",{

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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_awesome_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-awesome-button */ "../../node_modules/react-awesome-button/dist/index.js");
/* harmony import */ var react_awesome_button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_awesome_button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-awesome-button/dist/themes/theme-c137.css */ "../../node_modules/react-awesome-button/dist/themes/theme-c137.css");
/* harmony import */ var react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_awesome_button_dist_themes_theme_c137_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-awesome-slider/dist/navigation */ "./node_modules/react-awesome-slider/dist/navigation.js");
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










var Home = Object(react_awesome_slider_dist_navigation__WEBPACK_IMPORTED_MODULE_3__["withNavigationContext"])(function (_ref) {
  var fullpage = _ref.fullpage;
  return __jsx(_section_section__WEBPACK_IMPORTED_MODULE_7__["default"], {
    wrapper: false,
    backgroundColor: "#292c35",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, __jsx(_content_content__WEBPACK_IMPORTED_MODULE_5__["default"], {
    main: __jsx(_lettering_lettering__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: "INDEX",
      text: ['This is a single full page fixed screen.'],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      },
      __self: this
    }),
    action: __jsx("div", {
      className: "button",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      },
      __self: this
    }, __jsx(react_awesome_button__WEBPACK_IMPORTED_MODULE_1__["AwesomeButton"], {
      size: "large",
      onPress: function onPress() {
        fullpage.navigate('/page-two');
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      },
      __self: this
    }, "Go to the next page")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }));
});
var media = [{
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

/***/ })

})
//# sourceMappingURL=page-two.js.7ca2d16f79ab996fb6ca.hot-update.js.map