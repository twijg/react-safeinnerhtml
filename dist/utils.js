"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FragmentShape = exports.parseHTML = exports.convertAttribute = exports.convert = exports.unwrap = exports.htmlProps = exports.sequence = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _htmlparser = require("htmlparser2");

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _map = require("lodash/fp/map");

var _map2 = _interopRequireDefault(_map);

var _get = require("lodash/fp/get");

var _get2 = _interopRequireDefault(_get);

var _keys = require("lodash/fp/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sequence = exports.sequence = function () {
  var lastId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function () {
    function Sequence() {
      _classCallCheck(this, Sequence);
    }

    _createClass(Sequence, null, [{
      key: "uniqueId",
      get: function get() {
        // eslint-disable-next-line no-plusplus,no-param-reassign
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

var htmlProps = exports.htmlProps = function htmlProps(namedNodeMap, key) {
  var keyAsClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var temp = [].concat(_toConsumableArray(namedNodeMap)).reduce(function (o, _ref) {
    var localName = _ref.localName,
        nodeValue = _ref.nodeValue,
        _ref$lowerName = _ref.lowerName,
        lowerName = _ref$lowerName === undefined ? localName.toLowerCase() : _ref$lowerName;

    // eslint-disable-next-line no-param-reassign
    o[reactHtmlProps[lowerName] || lowerName] = nodeValue;
    return o;
  }, {});
  return _extends({}, temp, {
    className: keyAsClass ? (0, _classnames2.default)(temp.className, key) : temp.className,
    key: key
  });
};

var unwrap = exports.unwrap = function unwrap(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;
};

var convert = exports.convert = function convert(_ref2) {
  var data = _ref2.data,
      type = _ref2.type,
      name = _ref2.name,
      attribs = _ref2.attribs,
      children = _ref2.children;
  return {
    localName: name,
    nodeType: type,
    nodeValue: data,
    attributes: attribs,
    childNodes: children
  };
};

var convertAttribute = exports.convertAttribute = function convertAttribute(attribute) {
  return (0, _map2.default)(function (k) {
    return {
      localName: k,
      nodeValue: attribute[k]
    };
  })((0, _keys2.default)(attribute));
};

/** Parses HTML and returns body element */
var parseHTML = exports.parseHTML = function parseHTML(innerHTML) {
  return _htmlparser2.default.parseDOM(innerHTML, {
    decodeEntities: true,
    recognizeSelfClosing: true
  });
};

var FragmentShape = exports.FragmentShape = function FragmentShape(props, propName) {
  return (0, _get2.default)(propName)(props).toString() !== "Symbol(react.fragment)" ? new Error(propName + " is not a Fragment") : null;
};