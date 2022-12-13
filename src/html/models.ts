import {
  ChildNode as ChildNodeDOM,
  Element as ElementDOM,
  Node as NodeDOM,
  ParentNode as ParentNodeDOM,
} from "domhandler";
import { Key } from "react";

/**
 * Present but not exported in "domhandler" package.
 * Represents an HTML element's attribute.
 */
interface Attribute {
  name: string;
  value: string;
  namespace?: string;
  prefix?: string;
}

/**
 * Project specific extensions to the "domhandler"'s 'Attribute'.
 */
export interface AttributeExtended extends Attribute {
  localName: string;
  lowerName?: string;
  nodeValue: string;
  ownerDocument: Document;
}

/**
 * Argument of the "chooseAttribute" function.
 */
export interface AttributeChoice {
  attribute: AttributeExtended;
  elementName: string;
  key: Key;
}

/**
 * Project specific extensions to the "domhandler"'s 'Element'.
 */
export interface ElementExtended
  extends Omit<ElementDOM, "attributes" | "childNodes" | "parentNode"> {
  attributes: AttributeExtended[];
  childNodes: ChildNodeDOM[];
  key: Key;
  localName?: string;
  nodeValue?: string;
  parentNode: ParentNodeDOM | null;
  style: CSSStyleDeclaration;
}

/**
 * Project specific extensions to the "domhandler"'s 'Node'.
 */
export interface NodeExtended extends Omit<NodeDOM, "nodeType"> {
  attributes: NamedNodeMap;
  childNodes: ChildNodeDOM[];
  localName?: string;
  name?: string;
  nodeType?: number | string;
  nodeValue?: string;
}

/**
 * Argument of the "chooseNode" function.
 */
export interface NodeChoice {
  key: Key;
  node: NodeConverted;
}

/**
 * A conversion of the "domhandler"'s 'Node' to a project specific 'Node'.
 */
export interface NodeConverted {
  localName: string;
  nodeType: string;
  nodeValue: string;
  attributes: Record<string, string>;
  parentNode: ParentNodeDOM;
  childNodes: ChildNodeDOM[];
}

/**
 * A script node.
 */
export interface NodeScript {
  key: Key;
  code: string | null;
}
