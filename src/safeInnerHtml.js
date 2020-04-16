import React, { Component } from "react";
import PropTypes from "prop-types";

import compact from "lodash/fp/compact";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import pickBy from "lodash/fp/pickBy";
import some from "lodash/fp/some";
import get from "lodash/fp/get";
import unescape from "lodash/fp/unescape";
import includes from "lodash/fp/includes";

import {
  FragmentShape,
  convert,
  convertAttribute,
  htmlProps,
  parseHTML,
  sequence,
  unwrap,
} from "./utils";

class SafeInnerHtml extends Component {
  constructor(props) {
    super(props);
    this.initialize(props);
    this.chooseAttribute = this.chooseAttribute.bind(this);
    this.chooseNode = this.chooseNode.bind(this);
    this.addCss = this.addCss.bind(this);
    this.insertedNodes = [];
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
    if (this.css.length > 0) {
      const style = document.createElement("style");
      style.textContent = this.css.join("\r\n");
      document.querySelector("head").appendChild(style);
      this.insertedNodes.push(style);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ children, decode }) {
    const innerHTML = unwrap(children);
    if (children !== this.innerHTML) {
      this.initialize({ children: innerHTML, decode });
    }
  }

  shouldComponentUpdate({ children: innerHTML }) {
    const { children: currentChildren } = this.props;
    return innerHTML !== currentChildren[0];
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate() {
    this.componentWillUnmount();
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUnmount() {
    this.insertedNodes.forEach((node) => node.parentNode.removeChild(node));
    this.insertedNodes = [];
  }

  addCss(value) {
    this.css.push(value);
  }

  chooseAttribute({ attribute, key, elementName }) {
    const { localName, nodeValue } = attribute;
    const createAttribute = (name, value) => {
      const newAttribute = attribute.ownerDocument.createAttribute(name);
      newAttribute.value = value;
      return newAttribute;
    };

    const plug = get(`attribute-${localName.toLowerCase()}`)(this.props);
    if (typeof plug === "function") {
      const result = plug(
        { attribute, key, elementName },
        { addCss: this.addCss }
      );
      if (result !== undefined) {
        return result;
      }
    }

    if (plug === false) {
      return undefined;
    }

    switch (localName.toLowerCase()) {
      case "value":
        return elementName !== "input"
          ? attribute
          : createAttribute("defaultValue", attribute.value);
      case "style":
        this.css.push(`${this.selector(key, elementName)}{${nodeValue}}`);
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

  // eslint-disable-next-line class-methods-use-this
  selector(key, elementName = "") {
    return `${elementName}.${key}`;
  }

  initialize({ children, decode = false }) {
    this.innerHTML = unwrap(children);
    this.fragment = this.createFragment(this.innerHTML, decode);
    this.scripts = [];
    this.css = [];
  }

  // eslint-disable-next-line class-methods-use-this
  createFragment(innerHTML, decode) {
    const html = decode ? unescape(innerHTML) : innerHTML;
    return parseHTML(html);
  }

  createElement({ localName, attributes, childNodes, key }) {
    const localNames = flow(map("localName"), compact)(attributes);

    const props = htmlProps(
      flow(
        map((attribute) =>
          this.chooseAttribute({ attribute, key, elementName: localName })
        ),
        compact
      )(attributes),
      key,
      includes("style")(localNames)
    );
    const sub = childNodes.length && this.renderNodes(childNodes);
    const children = sub && sub.length > 0 ? sub : undefined;

    const plug = get(`element-${localName}`)(this.props);
    if (plug === false) {
      return undefined;
    }

    const defaultElement = { type: localName, props };
    const plugElement =
      typeof plug === "function" ? plug(defaultElement) : undefined;
    const element = plugElement === undefined ? defaultElement : plugElement;
    if (element) {
      const { type, props: elementProps } = element;
      return React.createElement(type, elementProps, children);
    }

    return undefined;
  }

  documentWrite(key) {
    return (
      "(function(html){if(html==null)return;" +
      `var e=document.querySelector('${this.selector(key)}');` +
      'if(e){e.innerHTML=html;e.style.display="inline";}})'
    );
  }

  renderNodes(nodes) {
    // eslint-disable-next-line lodash-fp/prefer-composition-grouping
    return flow(
      map(convert),
      map((node) => ({ node, key: sequence.uniqueId })),
      map(({ node, key }) => {
        const chosen = this.chooseNode({ node, key });
        return chosen && { node: chosen, key };
      }),
      compact,
      map(
        ({
          node: { localName, nodeType, nodeValue, attributes, childNodes },
          key,
        }) =>
          nodeType === "tag"
            ? this.createElement({
                localName,
                attributes: convertAttribute(attributes),
                childNodes,
                key,
              })
            : nodeValue
      ),
      compact
    )(nodes);
  }

  render() {
    const result = this.renderNodes(this.fragment);
    const ignored = ["attribute-", "element-", "children", "wrapper", "decode"];

    const ignoreKey = (key) => (ignore) =>
      new RegExp(`^${ignore}`, "i").test(key);
    const wrapperProps = pickBy((_, key) => !some(ignoreKey(key))(ignored))(
      this.props
    );

    const { wrapper } = this.props;
    return result.length === 0
      ? null
      : React.createElement(wrapper, wrapperProps, result);
  }
}

SafeInnerHtml.propTypes = {
  children: PropTypes.string.isRequired,
  wrapper: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.instanceOf(Component),
    PropTypes.instanceOf(React.PureComponent),
    FragmentShape,
  ]),
  decode: PropTypes.bool,
};

SafeInnerHtml.defaultProps = {
  wrapper: "div",
  decode: false,
};

export default SafeInnerHtml;
