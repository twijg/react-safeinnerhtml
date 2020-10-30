# react-safeinnerhtml

With this React component you can safely render your HTML.

Basic example:

```js
import React from "react";
import { render } from "react-dom";

import SafeInnerHtml from "react-safeinnerhtml";

const htmlString = '<p>This is a <a href="http://example.com">link</a>.</p>';
const htmlEncoded =
  '&lt;p&gt;This is a &lt;a href="http://example.com"&gt;link&lt;/a&gt;.&lt;/p&gt;';

const MyComponent = () => (
  <div>
    <SafeInnerHtml>{htmlString}</SafeInnerHtml>
    <SafeInnerHtml decode>{htmlEncoded}</SafeInnerHtml>
  </div>
);

render(<MyComponent />, document.getElementById("root"));
```

Properties for `SafeInnerHtml`

- `wrapper` - This can contain a `string` of a React component, for example: `<SafeInnerHtml wrapper={Fragment}>...</SafeInnerHtml>`
- `decode` - If the input (children) for `SafeInnerHtml` is HTML-encoded, you need to set `decode` to `true`

## Plug

When you want the component to behave in a specific way, you can add plug-functions for
both elements and attributes. You can add a property with the lowercased `localName` and
prefixed with `element-` of `attribute-`.

This example will transform a `<strong>` to `<span style="font-weight: bold">`:

```js
<SafeInnerHtml
  element-strong={({ props, ...rest }, parentNode, childNodes) => {
    const { style, ...other } = props;
    return {
      type: "span",
      props: { style: { ...style, fontWeight: "bold" }, ...other },
      ...rest
    };
  }}
>
  {input}
</SafeInnerHtml>
```

This example will skip all `<em>` tags:

```js
<SafeInnerHtml element-em={false}>{input}</SafeInnerHtml>
```

This example will add a prefix for `href` without `://`:

```js
<SafeInnerHtml
  attribute-href={({ attribute }) => {
    if (attribute.nodeValue.indexOf("://") === -1) {
      return {
        localName: "href",
        nodeValue: `http://www.domain.com/#${attribute.nodeValue}`
      };
    }

    return attribute;
  }}
>
  {input}
</SafeInnerHtml>
```

## Build and publish

Build this package:

```
yarn prettier
yarn lint
yarn test
yarn build
```

Publish this package:

```
npm login
npm publish
```
