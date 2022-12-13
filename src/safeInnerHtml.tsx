import { ChildNode } from "domhandler";
import compact from "lodash/fp/compact";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import pickBy from "lodash/fp/pickBy";
import some from "lodash/fp/some";
import unescape from "lodash/fp/unescape";
import React, {
  Component,
  Key,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

import {
  AttributeExtended,
  ElementExtended,
  NodeExtended,
} from "./html/models";
import { AttributeChoice, NodeChoice, NodeScript } from "./html/models";
import {
  FragmentShapeFunction,
  convert,
  convertAttribute,
  htmlProps,
  parseHTML,
  sequence,
  unwrap,
} from "./utils";

export interface SafeInnerHtmlProps {
  children: React.ReactNode;
  decode?: boolean;
  wrapper?:
    | string
    | Component
    | React.PureComponent
    | FragmentShapeFunction
    | unknown;
}

export class SafeInnerHtml extends Component<SafeInnerHtmlProps> {
  private css: string[] = [];
  private fragment: ChildNode[] = [];
  private innerHTML: string = "";
  private insertedNodes: NodeExtended[] = [];
  private scripts: NodeScript[] = [];

  private get children(): React.ReactNode {
    return this.props.children;
  }

  private get decode(): boolean | undefined {
    return this.props.decode;
  }

  private get wrapper():
    | string
    | (() => unknown)
    | Component
    | React.PureComponent
    | FragmentShapeFunction
    | unknown {
    return this.props.wrapper;
  }

  constructor(props: PropsWithChildren<SafeInnerHtmlProps>) {
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
      script.textContent =
        code?.replace(/\bdocument\.write\b/g, this.documentWrite(key)) || code;
      document.querySelector("body")?.appendChild(script);
      this.insertedNodes.push(script as unknown as NodeExtended);
    });
    if (this.css.length > 0) {
      const style = document.createElement("style");
      style.textContent = this.css.join("\r\n");
      document.querySelector("head")?.appendChild(style);
      this.insertedNodes.push(style as unknown as NodeExtended);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({
    children,
    decode,
  }: PropsWithChildren<SafeInnerHtmlProps>) {
    const innerHTML = unwrap(children as string | string[]);
    if (children !== this.innerHTML) {
      this.initialize({ children: innerHTML, decode });
    }
  }

  shouldComponentUpdate({
    children: innerHTML,
  }: PropsWithChildren<SafeInnerHtmlProps>) {
    const { children: currentChildren } = this.props;
    return (
      innerHTML !==
      (Array.isArray(currentChildren)
        ? (currentChildren as Array<unknown>)[0]
        : currentChildren)
    );
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate() {
    this.componentWillUnmount();
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUnmount() {
    this.insertedNodes.forEach((node) =>
      (
        node?.parentNode as unknown as
          | { removeChild: (node: NodeExtended) => void }
          | undefined
      )?.removeChild(node)
    );
    this.insertedNodes = [];
  }

  addCss(value: string) {
    this.css.push(value);
  }

  chooseAttribute({ attribute, key, elementName }: AttributeChoice) {
    const { localName, nodeValue } = attribute;
    const createAttribute = (name: string, value: string) => {
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

  chooseNode({ node, key }: NodeChoice): NodeExtended {
    if (node instanceof HTMLScriptElement) {
      this.scripts.push({ key, code: (node as HTMLScriptElement).textContent });
      const span = (node as HTMLScriptElement).ownerDocument.createElement(
        "span"
      );
      span.setAttribute("style", "display: none;");
      return span as unknown as NodeExtended;
    }

    return node as unknown as NodeExtended;
  }

  // eslint-disable-next-line class-methods-use-this
  selector(key: Key, elementName = "") {
    return `${elementName}.${key}`;
  }

  initialize({ children, decode = false }: SafeInnerHtmlProps) {
    this.innerHTML = unwrap(children as string[] | string);
    this.fragment = this.createFragment(this.innerHTML, decode);
    this.scripts = [];
    this.css = [];
  }

  // eslint-disable-next-line class-methods-use-this
  createFragment(innerHTML: string, decode: boolean): ChildNode[] {
    const html = decode ? unescape(innerHTML) : innerHTML;
    return parseHTML(html);
  }

  createElement({
    localName,
    attributes,
    parentNode,
    childNodes,
    key,
  }: ElementExtended): ReactElement | undefined {
    const localNames = flow(map("localName"), compact)(attributes) as string[];

    const props = htmlProps(
      flow(
        map((attribute: AttributeExtended) =>
          this.chooseAttribute({ attribute, key, elementName: localName! })
        ),
        compact
      )(attributes) as unknown as NamedNodeMap,
      key,
      includes("style")(localNames)
    );
    const sub =
      childNodes.length &&
      this.renderNodes(childNodes as unknown as ChildNode[]);
    const children = sub && sub.length > 0 ? sub : undefined;

    const plug = get(`element-${localName}`)(this.props);
    if (plug === false) {
      return undefined;
    }

    const defaultElement = { type: localName, props };
    const plugElement =
      typeof plug === "function"
        ? plug(defaultElement, parentNode, childNodes)
        : undefined;
    const element = plugElement === undefined ? defaultElement : plugElement;
    if (element) {
      const { type, props: elementProps } = element;
      return React.createElement(type, elementProps, children);
    }

    return undefined;
  }

  documentWrite(key: Key) {
    return (
      "(function(html){if(html==null)return;" +
      `var e=document.querySelector('${this.selector(key)}');` +
      'if(e){e.innerHTML=html;e.style.display="inline";}})'
    );
  }

  renderNodes(nodes: ChildNode[]): ReactNode[] {
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
          node: {
            localName,
            nodeType,
            nodeValue,
            attributes,
            parentNode,
            childNodes,
          },
          key,
        }) =>
          (nodeType as unknown as string) === "tag"
            ? this.createElement({
                localName,
                attributes: convertAttribute(attributes),
                parentNode,
                childNodes,
                key,
              } as ElementExtended)
            : nodeValue
      ),
      compact
    )(nodes as (Document & Text)[]);
  }

  public render() {
    const result = this.renderNodes(this.fragment);
    const ignored = ["attribute-", "element-", "children", "wrapper", "decode"];

    const ignoreKey = (key: string) => (ignore: string) =>
      new RegExp(`^${ignore}`, "i").test(key);
    const wrapperProps = pickBy((_, key) => !some(ignoreKey(key))(ignored))(
      this.props
    );

    const { wrapper } = this.props;
    console.log({ result });
    return result.length === 0
      ? null
      : React.createElement(wrapper as string, wrapperProps, result);
  }
}

export default SafeInnerHtml;
