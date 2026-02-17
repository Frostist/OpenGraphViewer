<p align="center">
  <h1 align="center">OpenGraph Viewer</h1>
  <p align="center">
    Preview how your website looks when shared on social media — before you deploy.
    <br />
    <br />
    <a href="#getting-started">Getting Started</a>
    &middot;
    <a href="#features">Features</a>
    &middot;
    <a href="#api-reference">API Reference</a>
  </p>
</p>

<br />

![OpenGraph Viewer — Social media previews](READMEAssets/Image%201.png)

## About

OpenGraph Viewer is a lightweight, local development tool that extracts OpenGraph and Twitter Card metadata from any URL and renders realistic previews for major social platforms. Stop guessing how your links will look — see exactly how they'll appear on Facebook, Twitter/X, LinkedIn, Discord, and Slack.

Built for developers who want to validate their meta tags during local development without deploying to production first.

![OpenGraph Viewer — Metadata details](READMEAssets/Image%202.png)

## Features

- **Multi-platform previews** — See how your link renders on Facebook, Twitter/X, LinkedIn, Discord, and Slack simultaneously
- **Localhost support** — Preview metadata from your local development server (e.g. `localhost:3000`)
- **Metadata validation** — Get warnings for missing or incomplete OpenGraph tags that could affect social sharing
- **Raw metadata inspector** — View every meta tag extracted from the page in a detailed table
- **Twitter Card variants** — Renders both `summary` and `summary_large_image` card types
- **Zero configuration** — Just start the server and go

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or later

### Installation

```bash
git clone https://github.com/Frostist/OpenGraphViewer.git
cd OpenGraphViewer
npm install
```

### Usage

```bash
npm start
```

Open [http://localhost:3456](http://localhost:3456) in your browser, enter a URL, and instantly preview how it will appear across social platforms.

## API Reference

OpenGraph Viewer exposes a single endpoint for programmatic use:

```
POST /api/fetch-og
Content-Type: application/json
```

**Request body:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "title": "Example",
  "description": "An example page",
  "image": "https://example.com/og-image.png",
  "imageWidth": "1200",
  "imageHeight": "630",
  "siteName": "Example",
  "twitterCard": "summary_large_image",
  "allMeta": { ... }
}
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | [Express.js](https://expressjs.com/) |
| HTML Parsing | [Cheerio](https://cheerio.js.org/) |
| Frontend | Vanilla HTML, CSS, and JavaScript |

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
