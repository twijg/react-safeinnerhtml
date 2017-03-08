"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveImages = exports.parseHTML = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _compact = require("lodash/fp/compact");

var _compact2 = _interopRequireDefault(_compact);

var _eq = require("lodash/fp/eq");

var _eq2 = _interopRequireDefault(_eq);

var _flow = require("lodash/flow");

var _flow2 = _interopRequireDefault(_flow);

var _map = require("lodash/fp/map");

var _map2 = _interopRequireDefault(_map);

var _some = require("lodash/fp/some");

var _some2 = _interopRequireDefault(_some);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _empty = require("empty");

var _empty2 = _interopRequireDefault(_empty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sequence = function () {
  var lastId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function () {
    function Sequence() {
      _classCallCheck(this, Sequence);
    }

    _createClass(Sequence, null, [{
      key: "uniqueId",
      get: function get() {
        return Date.now().toString(36) + "_" + (++lastId).toString(36) + "_" + Math.random().toString(36).substring(2);
      }
    }]);

    return Sequence;
  }();
}();

var reactHtmlProps = {
  // Renamed attributes
  class: "className",
  for: "htmlFor",

  // Cased attributes
  accentheight: "accentHeight",
  acceptcharset: "acceptCharset",
  accesskey: "accessKey",
  alignmentbaseline: "alignmentBaseline",
  allowfullscreen: "allowFullScreen",
  allowreorder: "allowReorder",
  allowtransparency: "allowTransparency",
  arabicform: "arabicForm",
  attributename: "attributeName",
  attributetype: "attributeType",
  autocapitalize: "autoCapitalize",
  autocomplete: "autoComplete",
  autocorrect: "autoCorrect",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  autoreverse: "autoReverse",
  autosave: "autoSave",
  basefrequency: "baseFrequency",
  baselineshift: "baselineShift",
  baseprofile: "baseProfile",
  calcmode: "calcMode",
  capheight: "capHeight",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  charset: "charSet",
  classid: "classID",
  clippath: "clipPath",
  clippathunits: "clipPathUnits",
  cliprule: "clipRule",
  colorinterpolation: "colorInterpolation",
  colorinterpolationfilters: "colorInterpolationFilters",
  colorprofile: "colorProfile",
  colorrendering: "colorRendering",
  colspan: "colSpan",
  contenteditable: "contentEditable",
  contentscripttype: "contentScriptType",
  contentstyletype: "contentStyleType",
  contextmenu: "contextMenu",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  defaultvalue: "defaultValue",
  diffuseconstant: "diffuseConstant",
  dominantbaseline: "dominantBaseline",
  edgemode: "edgeMode",
  enablebackground: "enableBackground",
  enctype: "encType",
  externalresourcesrequired: "externalResourcesRequired",
  fillopacity: "fillOpacity",
  fillrule: "fillRule",
  filterres: "filterRes",
  filterunits: "filterUnits",
  floodcolor: "floodColor",
  floodopacity: "floodOpacity",
  fontfamily: "fontFamily",
  fontsize: "fontSize",
  fontsizeadjust: "fontSizeAdjust",
  fontstretch: "fontStretch",
  fontstyle: "fontStyle",
  fontvariant: "fontVariant",
  fontweight: "fontWeight",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  glyphname: "glyphName",
  glyphorientationhorizontal: "glyphOrientationHorizontal",
  glyphorientationvertical: "glyphOrientationVertical",
  glyphref: "glyphRef",
  gradienttransform: "gradientTransform",
  gradientunits: "gradientUnits",
  horizadvx: "horizAdvX",
  horizoriginx: "horizOriginX",
  hreflang: "hrefLang",
  httpequiv: "httpEquiv",
  imagerendering: "imageRendering",
  inputmode: "inputMode",
  itemid: "itemID",
  itemprop: "itemProp",
  itemref: "itemRef",
  itemscope: "itemScope",
  itemtype: "itemType",
  kernelmatrix: "kernelMatrix",
  kernelunitlength: "kernelUnitLength",
  keyparams: "keyParams",
  keypoints: "keyPoints",
  keysplines: "keySplines",
  keytimes: "keyTimes",
  keytype: "keyType",
  lengthadjust: "lengthAdjust",
  letterspacing: "letterSpacing",
  lightingcolor: "lightingColor",
  limitingconeangle: "limitingConeAngle",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  markerend: "markerEnd",
  markerheight: "markerHeight",
  markermid: "markerMid",
  markerstart: "markerStart",
  markerunits: "markerUnits",
  markerwidth: "markerWidth",
  maskcontentunits: "maskContentUnits",
  maskunits: "maskUnits",
  maxlength: "maxLength",
  mediagroup: "mediaGroup",
  minlength: "minLength",
  novalidate: "noValidate",
  numoctaves: "numOctaves",
  overlineposition: "overlinePosition",
  overlinethickness: "overlineThickness",
  paintorder: "paintOrder",
  pathlength: "pathLength",
  patterncontentunits: "patternContentUnits",
  patterntransform: "patternTransform",
  patternunits: "patternUnits",
  pointerevents: "pointerEvents",
  pointsatx: "pointsAtX",
  pointsaty: "pointsAtY",
  pointsatz: "pointsAtZ",
  preservealpha: "preserveAlpha",
  preserveaspectratio: "preserveAspectRatio",
  primitiveunits: "primitiveUnits",
  radiogroup: "radioGroup",
  readonly: "readOnly",
  refx: "refX",
  refy: "refY",
  renderingintent: "renderingIntent",
  repeatcount: "repeatCount",
  repeatdur: "repeatDur",
  requiredextensions: "requiredExtensions",
  requiredfeatures: "requiredFeatures",
  rowspan: "rowSpan",
  shaperendering: "shapeRendering",
  specularconstant: "specularConstant",
  specularexponent: "specularExponent",
  spellcheck: "spellCheck",
  spreadmethod: "spreadMethod",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  startoffset: "startOffset",
  stddeviation: "stdDeviation",
  stitchtiles: "stitchTiles",
  stopcolor: "stopColor",
  stopopacity: "stopOpacity",
  strikethroughposition: "strikethroughPosition",
  strikethroughthickness: "strikethroughThickness",
  strokedasharray: "strokeDasharray",
  strokedashoffset: "strokeDashoffset",
  strokelinecap: "strokeLinecap",
  strokelinejoin: "strokeLinejoin",
  strokemiterlimit: "strokeMiterlimit",
  strokeopacity: "strokeOpacity",
  strokewidth: "strokeWidth",
  surfacescale: "surfaceScale",
  systemlanguage: "systemLanguage",
  tabindex: "tabIndex",
  tablevalues: "tableValues",
  targetx: "targetX",
  targety: "targetY",
  textanchor: "textAnchor",
  textdecoration: "textDecoration",
  textlength: "textLength",
  textrendering: "textRendering",
  underlineposition: "underlinePosition",
  underlinethickness: "underlineThickness",
  unicodebidi: "unicodeBidi",
  unicoderange: "unicodeRange",
  unitsperem: "unitsPerEm",
  usemap: "useMap",
  valphabetic: "vAlphabetic",
  vectoreffect: "vectorEffect",
  vertadvy: "vertAdvY",
  vertoriginx: "vertOriginX",
  vertoriginy: "vertOriginY",
  vhanging: "vHanging",
  videographic: "vIdeographic",
  viewbox: "viewBox",
  viewtarget: "viewTarget",
  vmathematical: "vMathematical",
  wordspacing: "wordSpacing",
  writingmode: "writingMode",
  xchannelselector: "xChannelSelector",
  xheight: "xHeight",
  xlinkactuate: "xlinkActuate",
  xlinkarcrole: "xlinkArcrole",
  xlinkhref: "xlinkHref",
  xlinkrole: "xlinkRole",
  xlinkshow: "xlinkShow",
  xlinktitle: "xlinkTitle",
  xlinktype: "xlinkType",
  xmlbase: "xmlBase",
  xmllang: "xmlLang",
  xmlspace: "xmlSpace",
  ychannelselector: "yChannelSelector",
  zoomandpan: "zoomAndPan"
};

var htmlProps = function htmlProps(namedNodeMap, key) {
  var temp = [].concat(_toConsumableArray(namedNodeMap)).reduce(function (o, _ref) {
    var localName = _ref.localName,
        nodeValue = _ref.nodeValue,
        _ref$lowerName = _ref.lowerName,
        lowerName = _ref$lowerName === undefined ? localName.toLowerCase() : _ref$lowerName;
    return _extends({}, o, _defineProperty({}, reactHtmlProps[lowerName] || lowerName, nodeValue));
  }, {});
  return _extends({}, temp, { className: (0, _classnames2.default)(temp.className, key), key: key });
};

var unwrap = function unwrap(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;
};

var makePrefix = function makePrefix(prefix, value) {
  return typeof value === "string" && value.indexOf(prefix) === 0 ? value : "" + prefix + value;
};

/** Parses HTML and returns body element */
var parseHTML = exports.parseHTML = function parseHTML(innerHTML) {
  return new DOMParser().parseFromString(innerHTML, "text/html").body;
};

var resolveImages = exports.resolveImages = function resolveImages(innerHTML, prefix) {
  var body = parseHTML(innerHTML);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = body.querySelectorAll("img")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var img = _step.value;

      img.src = makePrefix(prefix, img.getAttribute("src"));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return body.innerHTML;
};

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
    value: function chooseAttribute(_ref2) {
      var attribute = _ref2.attribute,
          key = _ref2.key,
          elementName = _ref2.elementName;
      var localName = attribute.localName,
          nodeValue = attribute.nodeValue;

      var createAttribute = function createAttribute(name, value) {
        var newAttribute = attribute.ownerDocument.createAttribute(name);
        newAttribute.value = value;
        return newAttribute;
      };
      switch (localName.toLowerCase()) {
        case "value":
          return elementName !== "input" ? attribute : createAttribute("defaultValue", attribute.value);
        case "data-scoped-style":
          this.css.push(nodeValue);
          return false;
        case "style":
          this.css.push(this.selector(key, elementName) + "{" + nodeValue + "}");
          return false;
        case "pagetype":
          return false;
        default:
          return attribute;
      }
    }
  }, {
    key: "chooseNode",
    value: function chooseNode(_ref3) {
      var node = _ref3.node,
          key = _ref3.key;

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
    value: function initialize(_ref4) {
      var children = _ref4.children,
          _ref4$decode = _ref4.decode,
          decode = _ref4$decode === undefined ? false : _ref4$decode,
          _ref4$rootUrl = _ref4.rootUrl,
          rootUrl = _ref4$rootUrl === undefined ? "/" : _ref4$rootUrl;

      this.innerHTML = unwrap(children);
      this.fragment = this.createFragment(this.innerHTML, decode);
      this.scripts = [];
      this.css = [];
      this.rootUrl = rootUrl;
    }
  }, {
    key: "createFragment",
    value: function createFragment(innerHTML, decode) {
      var root = parseHTML(innerHTML);
      return decode ? this.createFragment(root.textContent) : root;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref5) {
      var children = _ref5.children,
          decode = _ref5.decode,
          rootUrl = _ref5.rootUrl;

      var innerHTML = unwrap(children);
      if (children !== this.innerHTML) {
        this.initialize({ children: innerHTML, decode: decode, rootUrl: rootUrl });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref6) {
      var innerHTML = _ref6.children;

      return innerHTML !== this.props.children[0];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.scripts.forEach(function (_ref7) {
        var key = _ref7.key,
            code = _ref7.code;

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
    value: function createElement(_ref8) {
      var _this3 = this;

      var localName = _ref8.localName,
          attributes = _ref8.attributes,
          childNodes = _ref8.childNodes,
          key = _ref8.key;

      var props = htmlProps((0, _flow2.default)((0, _map2.default)(function (attribute) {
        return _this3.chooseAttribute({ attribute: attribute, key: key, elementName: localName });
      }), _compact2.default)(attributes), key);
      var sub = childNodes.length && this.renderNodes(childNodes);
      var children = sub && sub.length && sub || undefined;
      var href = localName === "a" && attributes.href && attributes.href.nodeValue;
      var src = localName === "img" && attributes.src && attributes.src.nodeValue;
      var classes = attributes.class && attributes.class.nodeValue ? attributes.class.nodeValue.split(" ") : _empty2.default.array;

      if (href && href.indexOf("://") === -1 && (0, _some2.default)((0, _eq2.default)("importLink"))(classes)) {
        // download
      } else if (href && (0, _some2.default)((0, _eq2.default)("siteLink"))(classes)) {
        // interne verwijzing
      } else if (src && src.indexOf("://") === -1) {
        // afbeelding
      } else {
        return _react2.default.createElement(localName, props, children);
      }
    }
  }, {
    key: "renderNodes",
    value: function renderNodes(nodes) {
      var _this4 = this;

      return (0, _flow2.default)((0, _map2.default)(function (node) {
        return { node: node, key: sequence.uniqueId };
      }), (0, _map2.default)(function (_ref9) {
        var node = _ref9.node,
            key = _ref9.key;

        var chosen = _this4.chooseNode({ node: node, key: key });
        return chosen && { node: chosen, key: key };
      }), _compact2.default, (0, _map2.default)(function (_ref10) {
        var _ref10$node = _ref10.node,
            localName = _ref10$node.localName,
            nodeType = _ref10$node.nodeType,
            nodeValue = _ref10$node.nodeValue,
            attributes = _ref10$node.attributes,
            childNodes = _ref10$node.childNodes,
            key = _ref10.key;
        return nodeType === 1 ? _this4.createElement({ localName: localName, attributes: attributes, childNodes: childNodes, key: key }) : nodeValue;
      }))(nodes);
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