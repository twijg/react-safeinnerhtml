"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _compact = require("lodash/fp/compact");

var _compact2 = _interopRequireDefault(_compact);

var _flow = require("lodash/flow");

var _flow2 = _interopRequireDefault(_flow);

var _map = require("lodash/fp/map");

var _map2 = _interopRequireDefault(_map);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SafeInnerHtml = function (_Component) {
  _inherits(SafeInnerHtml, _Component);

  function SafeInnerHtml(props) {
    _classCallCheck(this, SafeInnerHtml);

    var _this = _possibleConstructorReturn(this, (SafeInnerHtml.__proto__ || Object.getPrototypeOf(SafeInnerHtml)).call(this, props));

    _this.initialize(props);
    _this.chooseAttribute = _this.chooseAttribute.bind(_this);
    _this.chooseNode = _this.chooseNode.bind(_this);
    _this.insertedNodes = [];
    return _this;
  }

  _createClass(SafeInnerHtml, [{
    key: "chooseAttribute",
    value: function chooseAttribute(_ref) {
      var attribute = _ref.attribute,
          key = _ref.key,
          elementName = _ref.elementName;
      var localName = attribute.localName,
          nodeValue = attribute.nodeValue;

      var createAttribute = function createAttribute(name, value) {
        var newAttribute = attribute.ownerDocument.createAttribute(name);
        newAttribute.value = value;
        return newAttribute;
      };

      var plug = this.props["attribute-" + localName.toLowerCase()];
      if (typeof plug === "function") {
        var result = plug({ attribute: attribute, key: key, elementName: elementName });
        if (result !== undefined) {
          return result;
        }
      }

      if (plug === false) {
        return false;
      }

      switch (localName.toLowerCase()) {
        case "value":
          return elementName !== "input" ? attribute : createAttribute("defaultValue", attribute.value);
        case "style":
          this.css.push(this.selector(key, elementName) + "{" + nodeValue + "}");
          return false;
        default:
          return attribute;
      }
    }
  }, {
    key: "chooseNode",
    value: function chooseNode(_ref2) {
      var node = _ref2.node,
          key = _ref2.key;

      if (node instanceof HTMLScriptElement) {
        this.scripts.push({ key: key, code: node.textContent });
        var span = node.ownerDocument.createElement("span");
        span.setAttribute("style", "display: none;");
        return span;
      }

      return node;
    }
  }, {
    key: "selector",
    value: function selector(key) {
      var elementName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      return elementName + "." + key;
    }
  }, {
    key: "initialize",
    value: function initialize(_ref3) {
      var children = _ref3.children,
          _ref3$decode = _ref3.decode,
          decode = _ref3$decode === undefined ? false : _ref3$decode,
          _ref3$rootUrl = _ref3.rootUrl,
          rootUrl = _ref3$rootUrl === undefined ? "/" : _ref3$rootUrl;

      this.innerHTML = (0, _utils.unwrap)(children);
      this.fragment = this.createFragment(this.innerHTML, decode);
      this.scripts = [];
      this.css = [];
      this.rootUrl = rootUrl;
    }
  }, {
    key: "createFragment",
    value: function createFragment(innerHTML, decode) {
      var root = (0, _utils.parseHTML)(innerHTML);
      return decode ? this.createFragment(root.textContent) : root;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref4) {
      var children = _ref4.children,
          decode = _ref4.decode,
          rootUrl = _ref4.rootUrl;

      var innerHTML = (0, _utils.unwrap)(children);
      if (children !== this.innerHTML) {
        this.initialize({ children: innerHTML, decode: decode, rootUrl: rootUrl });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref5) {
      var innerHTML = _ref5.children;

      return innerHTML !== this.props.children[0];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.scripts.forEach(function (_ref6) {
        var key = _ref6.key,
            code = _ref6.code;

        var script = document.createElement("script");
        script.textContent = code.replace(/\bdocument\.write\b/g, _this2.documentWrite(key));
        document.querySelector("body").appendChild(script);
        _this2.insertedNodes.push(script);
      });
      if (this.css.length) {
        var style = document.createElement("style");
        style.textContent = this.css.join("\r\n");
        document.querySelector("head").appendChild(style);
        this.insertedNodes.push(style);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.insertedNodes.forEach(function (node) {
        return node.parentNode.removeChild(node);
      });
      this.insertedNodes = [];
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.componentDidMount();
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      this.componentWillUnmount();
    }
  }, {
    key: "createElement",
    value: function createElement(_ref7) {
      var _this3 = this;

      var localName = _ref7.localName,
          attributes = _ref7.attributes,
          childNodes = _ref7.childNodes,
          key = _ref7.key;

      var props = (0, _utils.htmlProps)((0, _flow2.default)((0, _map2.default)(function (attribute) {
        return _this3.chooseAttribute({ attribute: attribute, key: key, elementName: localName });
      }), _compact2.default)(attributes), key);
      var sub = childNodes.length && this.renderNodes(childNodes);
      var children = sub && sub.length > 0 ? sub : undefined;

      var plug = this.props["element-" + localName];
      if (plug === false) {
        return;
      }

      var defaultElement = { type: localName, props: props };
      var plugElement = typeof plug === "function" ? plug(defaultElement) : undefined;
      var element = plugElement === undefined ? defaultElement : plugElement;
      if (element) {
        var type = element.type,
            _props = element.props;

        return _react2.default.createElement(type, _props, children);
      }
    }
  }, {
    key: "renderNodes",
    value: function renderNodes(nodes) {
      var _this4 = this;

      return (0, _flow2.default)((0, _map2.default)(function (node) {
        return { node: node, key: _utils.sequence.uniqueId };
      }), (0, _map2.default)(function (_ref8) {
        var node = _ref8.node,
            key = _ref8.key;

        var chosen = _this4.chooseNode({ node: node, key: key });
        return chosen && { node: chosen, key: key };
      }), _compact2.default, (0, _map2.default)(function (_ref9) {
        var _ref9$node = _ref9.node,
            localName = _ref9$node.localName,
            nodeType = _ref9$node.nodeType,
            nodeValue = _ref9$node.nodeValue,
            attributes = _ref9$node.attributes,
            childNodes = _ref9$node.childNodes,
            key = _ref9.key;
        return nodeType === 1 ? _this4.createElement({ localName: localName, attributes: attributes, childNodes: childNodes, key: key }) : nodeValue;
      }), _compact2.default)(nodes);
    }
  }, {
    key: "render",
    value: function render() {
      var result = this.renderNodes(this.fragment.childNodes);
      return result.length === 0 ? null : _react2.default.createElement(this.props.wrapper, {}, result);
    }
  }, {
    key: "documentWrite",
    value: function documentWrite(key) {
      return "(function(html){if(html==null)return;" + ("var e=document.querySelector('" + this.selector(key) + "');") + 'if(e){e.innerHTML=html;e.style.display="inline";}})';
    }
  }]);

  return SafeInnerHtml;
}(_react.Component);

SafeInnerHtml.propTypes = {
  children: _react2.default.PropTypes.string.isRequired,
  wrapper: _react2.default.PropTypes.string,
  decode: _react2.default.PropTypes.bool.isRequired
};

SafeInnerHtml.defaultProps = {
  wrapper: "div",
  decode: false
};

exports.default = SafeInnerHtml;