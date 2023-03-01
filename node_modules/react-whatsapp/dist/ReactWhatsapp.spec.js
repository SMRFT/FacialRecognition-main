"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _index = _interopRequireDefault(require("./index"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

afterEach(_react2.cleanup);
describe('ReactWhatsapp Component', function () {
  it('Should render the component', function () {
    var _createComponent = createComponent({
      number: '+1-202-555-0107',
      message: 'MESSAGE'
    }),
        container = _createComponent.container;

    expect(container).toBeDefined();
  });
  it('Should render the component without message', function () {
    var _createComponent2 = createComponent({
      number: '+1-202-555-0107'
    }),
        container = _createComponent2.container;

    expect(container).toBeDefined();
  });
  it('Call button with onClick', function () {
    var onClick = jest.fn();
    window.open = jest.fn();

    var _createComponent3 = createComponent({
      number: '+1-202-555-0107',
      onClick: onClick,
      'aria-label': 'Click'
    }),
        getByLabelText = _createComponent3.getByLabelText;

    _react2.fireEvent.click(getByLabelText('Click'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(1);
  });
  it('Call button without onClick', function () {
    window.open = jest.fn();

    var _createComponent4 = createComponent({
      number: '+1-202-555-0107',
      'aria-label': 'Click'
    }),
        getByLabelText = _createComponent4.getByLabelText;

    _react2.fireEvent.click(getByLabelText('Click'));

    expect(window.open).toHaveBeenCalledTimes(1);
  });
});

function createComponent() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var defaultProps = _objectSpread({}, props);

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_index.default, defaultProps));
}