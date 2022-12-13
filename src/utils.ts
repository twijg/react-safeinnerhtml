import classNames from "classnames";
import { ChildNode, Document, Text } from "domhandler";
import { parseDOM } from "htmlparser2";
import get from "lodash/fp/get";
import keys from "lodash/fp/keys";
import map from "lodash/fp/map";
import { HTMLProps, Key } from "react";

import { AttributeExtended, NodeConverted } from "./html/models";

export const sequence = ((lastId = 0) =>
  class Sequence {
    static get uniqueId() {
      // eslint-disable-next-line no-plusplus,no-param-reassign
      return `${Date.now().toString(36)}_${(++lastId).toString(
        36
      )}_${Math.random().toString(36).substring(2)}`;
    }
  })();

const reactHtmlProps: Record<string, string> = {
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
  zoomandpan: "zoomAndPan",
};

const emptyHtmlElements = [
  "base",
  "link",
  "meta",
  "hr",
  "br",
  "wbr",
  "img",
  "embed",
  "param",
  "source",
  "track",
  "area",
  "col",
  "input",
  "keygen",
  "command",
  "device",
];

const closingEmptyTagRegex = new RegExp(
  `</(${emptyHtmlElements.join("|")})>`,
  "gi"
);

export const htmlProps = (
  namedNodeMap: NamedNodeMap,
  key: Key,
  keyAsClass = false
): HTMLProps<unknown> => {
  const temp = ([...namedNodeMap] as AttributeExtended[]).reduce(
    (o, { localName, nodeValue, lowerName = localName.toLowerCase() }) => {
      // eslint-disable-next-line no-param-reassign
      o[(reactHtmlProps[lowerName] || lowerName) as keyof HTMLProps<unknown>] =
        nodeValue;
      return o;
    },
    {} as HTMLProps<unknown>
  );
  return {
    ...temp,
    className: keyAsClass ? classNames(temp.className, key) : temp.className,
    key,
  };
};

export const unwrap = (maybeArray: Array<string> | string): string =>
  Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;

export const convert = ({
  data,
  type,
  name,
  attribs,
  parent,
  children,
}: Document & Text): NodeConverted => ({
  localName: name,
  nodeType: type,
  nodeValue: data,
  attributes: attribs,
  parentNode: parent,
  childNodes: children,
});

export const convertAttribute = (
  attribute: NamedNodeMap
): AttributeExtended[] =>
  map((k: keyof NamedNodeMap) => ({
    localName: k,
    nodeValue: attribute[k as keyof NamedNodeMap],
  }))(
    keys(attribute) as (keyof NamedNodeMap)[]
  ) as unknown as AttributeExtended[];

export const parseHTML = (innerHTML: string): ChildNode[] =>
  parseDOM((innerHTML || "").replace(closingEmptyTagRegex, ""), {
    decodeEntities: true,
    recognizeSelfClosing: true,
  });

export type FragmentShapeFunction = (
  props: unknown,
  propName: string
) => Error | null;
export const FragmentShape: FragmentShapeFunction = (
  props: unknown,
  propName: string
) =>
  get(propName)(props).toString() !== "Symbol(react.fragment)"
    ? new Error(`${propName} is not a Fragment`)
    : null;
