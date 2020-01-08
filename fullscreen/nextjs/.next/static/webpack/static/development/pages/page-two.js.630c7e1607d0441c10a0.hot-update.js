webpackHotUpdate("static/development/pages/page-two.js",{

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
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      onChange = _ref.onChange;

  var renderOptions = function renderOptions() {
    return options.map(function (_ref2) {
      var value = _ref2.value,
          label = _ref2.label,
          selected = _ref2.selected;
      return __jsx("option", {
        selected: selected,
        value: value,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        },
        __self: this
      }, label);
    });
  };

  return __jsx("select", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, renderOptions());
};

/* harmony default export */ __webpack_exports__["default"] = (Select);

/***/ })

})
//# sourceMappingURL=page-two.js.630c7e1607d0441c10a0.hot-update.js.map