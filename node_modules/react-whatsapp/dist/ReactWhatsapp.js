"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var URL = 'https://wa.me';

var ReactWhatsapp = function ReactWhatsapp(_ref) {
  var number = _ref.number,
      message = _ref.message,
      element = _ref.element,
      _onClick = _ref.onClick,
      props = (0, _objectWithoutProperties2.default)(_ref, ["number", "message", "element", "onClick"]);
  var Element = element;
  number = number.replace(/[^\w\s]/gi, '').replace(/ /g, '');
  var url = "".concat(URL, "/").concat(number);

  if (message) {
    url += "?text=".concat(encodeURI(message));
  }

  return /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({
    onClick: function onClick(e) {
      window.open(url);

      if (_onClick) {
        _onClick(e);
      }
    }
  }, props));
};

ReactWhatsapp.propTypes = {
  number: _propTypes.default.string.isRequired,
  message: _propTypes.default.string,
  element: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element])
};
ReactWhatsapp.defaultProps = {
  element: 'button'
};
var _default = ReactWhatsapp;
exports.default = _default;