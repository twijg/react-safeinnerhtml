import { htmlProps, parseHTML, sequence, unwrap } from "./utils";
import compact from "lodash/fp/compact";
import flow from "lodash/flow";
import map from "lodash/fp/map";
import pickBy from "lodash/fp/pickBy";
import React, { Component } from "react";
import some from "lodash/fp/some";

class SafeInnerHtml extends Component {
  constructor(props) {
    super(props);
    this.initialize(props);
    this.chooseAttribute = this.chooseAttribute.bind(this);
    this.chooseNode = this.chooseNode.bind(this);
    this.addCss = this.addCss.bind(this);
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

    const plug = this.props[`attribute-${localName.toLowerCase()}`];
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
      return false;
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

  selector(key, elementName = "") {
    return `${elementName}.${key}`;
  }

  initialize({ children, decode = false, rootUrl = "/", xhtml = false }) {
    this.innerHTML = unwrap(children);
    this.fragment = this.createFragment(this.innerHTML, decode, xhtml);
    this.scripts = [];
    this.css = [];
    this.rootUrl = rootUrl;
  }

  createFragment(innerHTML, decode, xhtml = false) {
    const root = parseHTML(innerHTML, xhtml);
    return decode ? this.createFragment(root.textContent, false, xhtml) : root;
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
    const children = sub && sub.length > 0 ? sub : undefined;

    const plug = this.props[`element-${localName}`];
    if (plug === false) {
      return;
    }

    const defaultElement = { type: localName, props };
    const plugElement = typeof plug === "function"
      ? plug(defaultElement)
      : undefined;
    const element = plugElement === undefined ? defaultElement : plugElement;
    if (element) {
      const { type, props } = element;
      return React.createElement(type, props, children);
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
        ) =>
          nodeType === 1
            ? this.createElement({ localName, attributes, childNodes, key })
            : nodeValue
      ),
      compact
    )(nodes);
  }

  render() {
    const result = this.renderNodes(this.fragment.childNodes);
    const ignored = [
      "attribute-",
      "element-",
      "children",
      "wrapper",
      "decode",
      "rootUrl",
      "xhtml"
    ];

    const ignoreKey = key => ignore => new RegExp(`^${ignore}`, "i").test(key);
    const wrapperProps = pickBy((value, key) => !some(ignoreKey(key))(ignored))(
      this.props
    );

    return result.length === 0
      ? null
      : React.createElement(this.props.wrapper, wrapperProps, result);
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
  decode: React.PropTypes.bool.isRequired,
  xhtml: React.PropTypes.bool.isRequired,
  rootUrl: React.PropTypes.string
};

SafeInnerHtml.defaultProps = {
  wrapper: "div",
  decode: false,
  xhtml: false
};

export default SafeInnerHtml;
