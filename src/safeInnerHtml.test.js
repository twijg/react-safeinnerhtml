import React, { Fragment } from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import SafeInnerHtml from "./safeInnerHtml";

Enzyme.configure({ adapter: new Adapter() });

describe("SafeInnerHtml", () => {
  it("Render string", () => {
    const input = "Hello world!";
    const wrapper = mount(<SafeInnerHtml>{input}</SafeInnerHtml>);
    const expected = "<div>Hello world!</div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render string with `span`", () => {
    const input = "Hello world!";
    const wrapper = mount(
      <SafeInnerHtml wrapper="span">{input}</SafeInnerHtml>
    );
    const expected = "<span>Hello world!</span>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render HTML", () => {
    const input = "<div><p>Hello world!</p></div>";
    const wrapper = mount(<SafeInnerHtml>{input}</SafeInnerHtml>);
    const expected = "<div><div><p>Hello world!</p></div></div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render HTML without wrapping DIV", () => {
    const input = "<div><p>Hello world!</p></div>";
    const wrapper = mount(
      <SafeInnerHtml wrapper={Fragment}>{input}</SafeInnerHtml>
    );
    const expected = "<div><p>Hello world!</p></div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render HTML with self-closing tags", () => {
    const input = "<div><p>Line one<br></br>Line two</p></div>";
    const wrapper = mount(<SafeInnerHtml>{input}</SafeInnerHtml>);
    const expected = "<div><div><p>Line one<br>Line two</p></div></div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render encoded HTML", () => {
    const input = "&lt;div&gt;&lt;p&gt;Hello world!&lt;/p&gt;&lt;/div&gt;";
    const wrapper = mount(<SafeInnerHtml decode>{input}</SafeInnerHtml>);
    const expected = "<div><div><p>Hello world!</p></div></div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render complex HTML", () => {
    const input =
      "<div>" +
      "<h1>Lorem ipsum dolor sit amet</h1>" +
      "<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipisicing elit, sed do eiusmod" +
      "tempor incididunt ut labore et dolore magna aliqua.<br>Ut enim ad minim veniam," +
      'quis nostrud exercitation <a href="http://www.domain.com/" target="_blank">ullamco ' +
      "laboris nisi</a> ut aliquip ex ea commodo consequat.</p>" +
      "<table><tbody><tr><td>" +
      "Duis aute irure dolor in reprehenderit in voluptate velit esse" +
      "</td></tr><tr><td>" +
      "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non" +
      "proident, sunt in culpa qui officia deserunt mollit anim id est laborum." +
      "</td></tr></tbody></table>" +
      "</div>";
    const wrapper = mount(<SafeInnerHtml decode>{input}</SafeInnerHtml>);
    const expected =
      '<div><div><h1>Lorem ipsum dolor sit amet</h1><p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua.<br>Ut enim ad minim veniam,quis nostrud exercitation <a href="http://www.domain.com/" target="_blank">ullamco laboris nisi</a> ut aliquip ex ea commodo consequat.</p><table><tbody><tr><td>Duis aute irure dolor in reprehenderit in voluptate velit esse</td></tr><tr><td>cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.</td></tr></tbody></table></div></div>';
    expect(wrapper.html()).toBe(expected);
  });

  it("Render crappy HTML", () => {
    const input = "<div><ul><LI>item 1<li>item 2</li><li>item 3</div>";
    const wrapper = mount(<SafeInnerHtml>{input}</SafeInnerHtml>);
    const expected =
      "<div><div><ul><li>item 1</li><li>item 2</li><li>item 3</li></ul></div></div>";
    expect(wrapper.html()).toBe(expected);
  });

  it("Render HTML with element-plug", () => {
    const input =
      '<div><p><strong style="color: red" class="hello-text" id="hello">Hello</strong> <em>world</em>!</p></div>';
    const elementStrong = ({ props, ...rest }) => {
      const { style, ...other } = props;
      return {
        type: "span",
        props: { style: { ...style, fontWeight: "bold" }, ...other },
        ...rest
      };
    };
    const wrapper = mount(
      <SafeInnerHtml element-strong={elementStrong} element-em={false}>
        {input}
      </SafeInnerHtml>
    );
    expect(
      wrapper
        .find("strong")
        .first()
        .props()
        .className.split(" ").length
    ).toBe(2);
    expect(
      wrapper
        .find("strong")
        .first()
        .props().style
    ).toEqual({ fontWeight: "bold" });
  });

  it("Render HTML with attribute-plug", () => {
    const input =
      '<div><p><a href="/deep/link" class="hello-text" id="hello">Hello</strong> world!</p></div>';
    const attributeHref = ({ attribute }) => {
      if (attribute.nodeValue.indexOf("://") === -1) {
        return {
          localName: "href",
          nodeValue: `http://www.domain.com/#${attribute.nodeValue}`
        };
      }

      return attribute;
    };

    const wrapper = mount(
      <SafeInnerHtml attribute-href={attributeHref}>{input}</SafeInnerHtml>
    );

    const expected =
      '<div><div><p><a href="http://www.domain.com/#/deep/link" class="hello-text" id="hello">Hello world!</a></p></div></div>';
    expect(wrapper.html()).toBe(expected);
  });
});
