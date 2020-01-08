webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/content/content.js":
/*!***************************************!*\
  !*** ./components/content/content.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _select_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../select/select */ "./components/select/select.js");
/* harmony import */ var _content_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./content.scss */ "./components/content/content.scss");
/* harmony import */ var _content_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_content_scss__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/content/content.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




var Content = function Content(_ref) {
  var main = _ref.main,
      action = _ref.action;
  return __jsx("div", {
    className: "content",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, __jsx("div", {
    className: "content__main",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, main), __jsx("div", {
    className: "content__action",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, __jsx(_select_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
    options: [{
      label: 'Cube',
      value: 'cubeAnimation'
    }, {
      label: 'Fall',
      value: 'fallAnimation'
    }, {
      label: 'Fold',
      value: 'foldOutAnimation'
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }), action));
};

/* harmony default export */ __webpack_exports__["default"] = (Content);

/***/ }),

/***/ "./components/select/select.js":
/*!*************************************!*\
  !*** ./components/select/select.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _select_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./select.scss */ "./components/select/select.scss");
/* harmony import */ var _select_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_select_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/rcaferati/Projects/github/react-awesome-slider/fullscreen/nextjs/components/select/select.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



var Select = function Select(_ref) {
  var options = _ref.options;

  var renderOptions = function renderOptions() {
    options.map(function (_ref2) {
      var value = _ref2.value,
          label = _ref2.label;
      return __jsx("option", {
        value: value,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        },
        __self: this
      }, label);
    });
  };

  return __jsx("select", {
    className: "select",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, renderOptions());
};

/* harmony default export */ __webpack_exports__["default"] = (Select);

/***/ })

})
//# sourceMappingURL=index.js.6d83c8486dd1ffb06b3b.hot-update.js.map