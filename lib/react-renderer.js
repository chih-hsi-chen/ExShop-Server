"use strict";

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fs = require('fs');

var path = require('path');

var _require = require('react-dom/server'),
    renderToString = _require.renderToString;

var _require2 = require('./paths'),
    BUILD_DIR = _require2.BUILD_DIR;

var App = require('../../exshop/lib/App')["default"];

function reactRenderer(req, res) {
  var app = renderToString( /*#__PURE__*/_react["default"].createElement(App, null));
  var html = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8').replace('__ROOT__', app);
  return res.send(html);
}

;
module.exports = reactRenderer;