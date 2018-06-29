import React from "react";
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

  /* TODO: Uitzoeken hoe het precies werkt met de globale DOMParser */
  /* it("Render HTML", () => {
    const input = "<div><p>Hello world!</p></div>";
    const wrapper = mount(<SafeInnerHtml xhtml>{input}</SafeInnerHtml>);
    const expected = "<div><div><p>Hello world!</p></div></div>";
    expect(wrapper.html()).toBe(expected);
  }); */
});
