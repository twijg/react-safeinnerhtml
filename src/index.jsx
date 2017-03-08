import compact from "lodash/fp/compact";
import eq from "lodash/fp/eq";
import flow from "lodash/flow";
import map from "lodash/fp/map";
import some from "lodash/fp/some";
import classNames from "classnames";
import React, { Component } from "react";
import empty from "empty";

const sequence = ((lastId = 0) => class Sequence {
  static get uniqueId() {
    return `${Date.now().toString(36)}_${(++lastId).toString(36)}_${Math.random().toString(36).substring(2)}`;
  }
})();

const reactHtmlProps = {
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

const htmlProps = (namedNodeMap, key) => {
  const temp = [...namedNodeMap].reduce(
    (o, { localName, nodeValue, lowerName = localName.toLowerCase() }) => ({
      ...o,
      [reactHtmlProps[lowerName] || lowerName]: nodeValue
    }),
    {}
  );
  return { ...temp, className: classNames(temp.className, key), key };
};

const unwrap = maybeArray =>
  Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;

const makePrefix = (prefix, value) =>
  typeof value === "string" && value.indexOf(prefix) === 0
    ? value
    : `${prefix}${value}`;

/** Parses HTML and returns body element */
export const parseHTML = innerHTML =>
  new DOMParser().parseFromString(innerHTML, "text/html").body;

export const resolveImages = (innerHTML, prefix) => {
  const body = parseHTML(innerHTML);
  for (const img of body.querySelectorAll("img")) {
    img.src = makePrefix(prefix, img.getAttribute("src"));
  }
  return body.innerHTML;
};

class SafeInnerHtml extends Component {
  constructor(props) {
    super(props);
    this.initialize(props);
    this.chooseAttribute = this.chooseAttribute.bind(this);
    this.chooseNode = this.chooseNode.bind(this);
    this.insertedNodes = [];
  }

  chooseAttribute({ attribute, key, elementName }) {
    const { localName, nodeValue } = attribute;
    const createAttribute = (name, value) => {
      const newAttribute = attribute.ownerDocument.createAttribute(name);
      newAttribute.value = value;
      return newAttribute;
    };
    switch (localName.toLowerCase()) {
      case "value":
        return elementName !== "input"
          ? attribute
          : createAttribute("defaultValue", attribute.value);
      case "data-scoped-style":
        this.css.push(nodeValue);
        return false;
      case "style":
        this.css.push(`${this.selector(key, elementName)}{${nodeValue}}`);
        return false;
      case "pagetype":
        return false;
      default:
        return attribute;
    }
  }

  chooseNode({ node, key }) {
    if (node instanceof HTMLScriptElement) {
      this.scripts.push({ key, code: node.textContent });
      const span = node.ownerDocument.createElement("span");
      span.setAttribute("style", "display: none;");
      return span;
    }

    return node;
  }

  selector(key, elementName = "") {
    return `${elementName}.${key}`;
  }

  initialize({ children, decode = false, rootUrl = "/" }) {
    this.innerHTML = unwrap(children);
    this.fragment = this.createFragment(this.innerHTML, decode);
    this.scripts = [];
    this.css = [];
    this.rootUrl = rootUrl;
  }

  createFragment(innerHTML, decode) {
    const root = parseHTML(innerHTML);
    return decode ? this.createFragment(root.textContent) : root;
  }

  componentWillReceiveProps({ children, decode, rootUrl }) {
    const innerHTML = unwrap(children);
    if (children !== this.innerHTML) {
      this.initialize({ children: innerHTML, decode, rootUrl });
    }
  }

  shouldComponentUpdate({ children: innerHTML }) {
    return innerHTML !== this.props.children[0];
  }

  componentDidMount() {
    this.scripts.forEach(({ key, code }) => {
      const script = document.createElement("script");
      script.textContent = code.replace(
        /\bdocument\.write\b/g,
        this.documentWrite(key)
      );
      document.querySelector("body").appendChild(script);
      this.insertedNodes.push(script);
    });
    if (this.css.length) {
      const style = document.createElement("style");
      style.textContent = this.css.join("\r\n");
      document.querySelector("head").appendChild(style);
      this.insertedNodes.push(style);
    }
  }

  componentWillUnmount() {
    this.insertedNodes.forEach(node => node.parentNode.removeChild(node));
    this.insertedNodes = [];
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUpdate() {
    this.componentWillUnmount();
  }

  createElement({ localName, attributes, childNodes, key }) {
    const props = htmlProps(
      flow(
        map(attribute =>
          this.chooseAttribute({ attribute, key, elementName: localName })),
        compact
      )(attributes),
      key
    );
    const sub = childNodes.length && this.renderNodes(childNodes);
    const children = (sub && sub.length && sub) || undefined;
    const href = localName === "a" &&
      attributes.href &&
      attributes.href.nodeValue;
    const src = localName === "img" &&
      attributes.src &&
      attributes.src.nodeValue;
    const classes = attributes.class && attributes.class.nodeValue
      ? attributes.class.nodeValue.split(" ")
      : empty.array;

    if (href && href.indexOf("://") === -1 && some(eq("importLink"))(classes)) {
      // download
    } else if (href && some(eq("siteLink"))(classes)) {
      // interne verwijzing
    } else if (src && src.indexOf("://") === -1) {
      // afbeelding
    } else {
      return React.createElement(localName, props, children);
    }
  }

  renderNodes(nodes) {
    return flow(
      map(node => ({ node, key: sequence.uniqueId })),
      map(({ node, key }) => {
        const chosen = this.chooseNode({ node, key });
        return chosen && { node: chosen, key };
      }),
      compact,
      map(
        (
          {
            node: { localName, nodeType, nodeValue, attributes, childNodes },
            key
          }
        ) => nodeType === 1 ? this.createElement({ localName, attributes, childNodes, key }) : nodeValue
      )
    )(nodes);
  }

  render() {
    const result = this.renderNodes(this.fragment.childNodes);
    return result.length === 0
      ? null
      : React.createElement(this.props.wrapper, {}, result);
  }

  documentWrite(key) {
    return "(function(html){if(html==null)return;" +
      `var e=document.querySelector('${this.selector(key)}');` +
      'if(e){e.innerHTML=html;e.style.display="inline";}})';
  }
}

SafeInnerHtml.propTypes = {
  children: React.PropTypes.string.isRequired,
  wrapper: React.PropTypes.string,
  decode: React.PropTypes.bool.isRequired
};

SafeInnerHtml.defaultProps = {
  wrapper: "div",
  decode: false
};

export default SafeInnerHtml;
