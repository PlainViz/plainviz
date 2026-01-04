# Cloud API Reference

PlainViz provides a free cloud API for rendering charts without installing any packages.

**Base URL:** `https://api.plainviz.com`

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/render` | GET, POST | Render a chart |
| `/api/health` | GET | Health check |
| `/api` | GET | API information |

---

## Render Chart

Render PlainViz code to SVG.

### GET /api/render

```
GET https://api.plainviz.com/api/render?code=<URL-encoded-code>
```

### POST /api/render

```
POST https://api.plainviz.com/api/render
Content-Type: application/json

{
  "code": "Type: Bar\nApples: 50\nOranges: 30"
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `code` | string | Yes | - | PlainViz code (URL-encoded for GET) |
| `width` | number | No | 500 | Chart width in pixels |
| `height` | number | No | 300 | Chart height in pixels |
| `theme` | string | No | `dark` | Color theme: `dark` or `light` |
| `format` | string | No | `svg` | Response format: `svg` or `json` |

### Response

**SVG format (default):**

```
Content-Type: image/svg+xml

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300">...</svg>
```

**JSON format:**

```json
{
  "svg": "<svg>...</svg>",
  "ir": {
    "type": "bar",
    "labels": ["Apples", "Oranges"],
    "values": [50, 30]
  }
}
```

### Examples

**Simple bar chart:**

```
https://api.plainviz.com/api/render?code=Type:Bar%0AApples:50%0AOranges:30
```

**With options:**

```
https://api.plainviz.com/api/render?code=Type:Pie%0AA:40%0AB:60&theme=light&width=400
```

**POST request:**

```bash
curl -X POST https://api.plainviz.com/api/render \
  -H "Content-Type: application/json" \
  -d '{"code": "Type: Bar\nApples: 50\nOranges: 30"}'
```

---

## Health Check

### GET /api/health

Check if the API is running.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## API Info

### GET /api

Get API documentation and available endpoints.

---

## Usage Examples

### Embed in HTML

```html
<img
  src="https://api.plainviz.com/api/render?code=Type:Bar%0ASales:100%0ACosts:60"
  alt="Sales vs Costs"
/>
```

### Embed in Markdown

```markdown
![Chart](https://api.plainviz.com/api/render?code=Type:Bar%0AQ1:100%0AQ2:150)
```

### Embed in GitHub README

```markdown
![Sales Chart](https://api.plainviz.com/api/render?code=Type:Bar%0AJan:20%0AFeb:45%0AMar:80)
```

### With JavaScript fetch

```js
const code = `
Type: Bar
Title: Sales

Q1: 100
Q2: 200
`;

const url = `https://api.plainviz.com/api/render?code=${encodeURIComponent(code)}`;

// Get SVG
const response = await fetch(url);
const svg = await response.text();

// Or get JSON
const jsonUrl = `${url}&format=json`;
const jsonResponse = await fetch(jsonUrl);
const data = await jsonResponse.json();
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message",
  "errors": [...]  // For parse errors
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_PARAM` | 400 | Required parameter missing |
| `PARSE_ERROR` | 422 | Code parsing failed |
| `RENDER_ERROR` | 422 | Rendering failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYLOAD_TOO_LARGE` | 413 | Code or request too large |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Parse Error Example

```json
{
  "error": "PARSE_ERROR",
  "message": "Code parsing failed",
  "errors": [
    {
      "line": 3,
      "message": "\"fifty\" is not a valid number",
      "hint": "Use a number like: Apples: 100",
      "source": "Apples: fifty"
    }
  ]
}
```

---

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per minute | 100 |
| Max code length | 50 KB |
| Max request body | 100 KB |

When rate limited, the response includes a `Retry-After` header.

---

## Caching

Successful responses are cached for 24 hours:

```
Cache-Control: public, max-age=86400
```

---

## URL Encoding

For GET requests, the code must be URL-encoded.

### Common Encodings

| Character | Encoded |
|-----------|---------|
| newline | `%0A` |
| space | `%20` or `+` |
| colon | `%3A` |
| comma | `%2C` |

### JavaScript

```js
const code = `Type: Bar
Apples: 50
Oranges: 30`;

const encoded = encodeURIComponent(code);
// Type%3A%20Bar%0AApples%3A%2050%0AOranges%3A%2030
```

### Simplified Format

You can omit spaces for simpler URLs:

```
Type:Bar%0AApples:50%0AOranges:30
```

---

## Themes

### Dark Theme (default)

```
?theme=dark
```

- Background: `#1e1e2e`
- Text: `#cdd6f4`
- Uses Catppuccin Mocha palette

### Light Theme

```
?theme=light
```

- Background: `#ffffff`
- Text: `#1e1e2e`
- Light grid lines

---

## Best Practices

1. **Use POST for complex charts** - Avoids URL length limits
2. **Cache responses** - Charts are deterministic
3. **Handle errors gracefully** - Check for error responses
4. **URL-encode properly** - Especially for special characters

---

## Related

- [Getting Started](./getting-started.md) - Overview of all usage methods
- [Syntax Reference](./syntax.md) - PlainViz syntax
- [Examples](./examples.md) - More examples
