# react-safeinnerhtml

Basic example:

```js
import React from "react";
import { render } from "react-dom";

import SafeInnerHtml from "react-safeinnerhtml";

const getHtml = () =>
  '<p>This is a <a href="http://example.com">link</a>.</p>';

const MyComponent = () =>
  <div>
    <SafeInnerHtml>{getHtml()}</SafeInnerHtml>
  </div>;

render(<MyComponent />, document.getElementById("root"));
```
