const express = require("express");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/fetch-og", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Validate URL format
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: "Only HTTP/HTTPS URLs are allowed" });
    }
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OpenGraphViewer/1.0; +http://localhost)",
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const meta = {};

    // Collect all meta tags (og:, twitter:, standard)
    $("meta").each((_, el) => {
      const property =
        $(el).attr("property") || $(el).attr("name") || "";
      const content = $(el).attr("content") || "";
      if (property && content) {
        meta[property.toLowerCase()] = content;
      }
    });

    const ogData = {
      title:
        meta["og:title"] ||
        meta["twitter:title"] ||
        $("title").text() ||
        "",
      description:
        meta["og:description"] ||
        meta["twitter:description"] ||
        meta["description"] ||
        "",
      image:
        meta["og:image"] || meta["twitter:image"] || "",
      imageWidth: meta["og:image:width"] || "",
      imageHeight: meta["og:image:height"] || "",
      imageAlt:
        meta["og:image:alt"] || meta["twitter:image:alt"] || "",
      url: meta["og:url"] || url,
      siteName: meta["og:site_name"] || "",
      type: meta["og:type"] || "",
      twitterCard: meta["twitter:card"] || "",
      twitterSite: meta["twitter:site"] || "",
      twitterCreator: meta["twitter:creator"] || "",
      locale: meta["og:locale"] || "",
      themeColor: meta["theme-color"] || "",
      favicon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        "",
      allMeta: meta,
    };

    // Resolve relative image/favicon URLs
    if (ogData.image && !ogData.image.startsWith("http")) {
      ogData.image = new URL(ogData.image, url).href;
    }
    if (ogData.favicon && !ogData.favicon.startsWith("http")) {
      ogData.favicon = new URL(ogData.favicon, url).href;
    }

    res.json(ogData);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch URL: ${err.message}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`OpenGraph Viewer running at http://localhost:${PORT}`);
});
