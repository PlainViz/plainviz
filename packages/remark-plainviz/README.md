# remark-plainviz

A [remark](https://github.com/remarkjs/remark) plugin to render PlainViz code blocks as SVG charts.

## Installation

```bash
npm install remark-plainviz
```

## Usage

In your Markdown:

~~~markdown
```plainviz
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```
~~~

In your remark pipeline:

```js
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkPlainViz from 'remark-plainviz';

const result = await remark()
  .use(remarkPlainViz)
  .use(remarkHtml)
  .process(markdownContent);
```

## Options

```js
remarkPlainViz({
  className: 'my-chart-class' // default: 'plainviz-chart'
})
```

## License

MIT
