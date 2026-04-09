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
      imageSecureUrl: meta["og:image:secure_url"] || "",
      imageType: meta["og:image:type"] || "",
      url: meta["og:url"] || url,
      siteName: meta["og:site_name"] || "",
      type: meta["og:type"] || "",
      twitterCard: meta["twitter:card"] || "",
      twitterSite: meta["twitter:site"] || "",
      twitterCreator: meta["twitter:creator"] || "",
      locale: meta["og:locale"] || "",
      localeAlternate: meta["og:locale:alternate"] || "",
      themeColor: meta["theme-color"] || "",
      favicon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        "",
      
      video: meta["og:video"] || meta["og:video:url"] || "",
      videoSecureUrl: meta["og:video:secure_url"] || "",
      videoType: meta["og:video:type"] || "",
      videoWidth: meta["og:video:width"] || "",
      videoHeight: meta["og:video:height"] || "",
      videoDuration: meta["og:video:duration"] || "",
      twitterPlayer: meta["twitter:player"] || "",
      twitterPlayerWidth: meta["twitter:player:width"] || "",
      twitterPlayerHeight: meta["twitter:player:height"] || "",
      
      audio: meta["og:audio"] || "",
      audioSecureUrl: meta["og:audio:secure_url"] || "",
      audioType: meta["og:audio:type"] || "",
      
      articlePublishedTime: meta["article:published_time"] || "",
      articleModifiedTime: meta["article:modified_time"] || "",
      articleAuthor: meta["article:author"] || "",
      articleSection: meta["article:section"] || "",
      articleTag: meta["article:tag"] || "",
      
      author: meta["author"] || "",
      keywords: meta["keywords"] || "",
      copyright: meta["copyright"] || "",
      robots: meta["robots"] || "",
      
      profileFirstName: meta["profile:first_name"] || "",
      profileLastName: meta["profile:last_name"] || "",
      profileUsername: meta["profile:username"] || "",
      
      productPrice: meta["product:price:amount"] || "",
      productCurrency: meta["product:price:currency"] || "",
      
      twitterLabel1: meta["twitter:label1"] || "",
      twitterData1: meta["twitter:data1"] || "",
      twitterLabel2: meta["twitter:label2"] || "",
      twitterData2: meta["twitter:data2"] || "",
      
      canonical: $('link[rel="canonical"]').attr("href") || "",
      
      allMeta: meta,
    };

    // Resolve relative URLs
    if (ogData.image && !ogData.image.startsWith("http")) {
      ogData.image = new URL(ogData.image, url).href;
    }
    if (ogData.favicon && !ogData.favicon.startsWith("http")) {
      ogData.favicon = new URL(ogData.favicon, url).href;
    }
    if (ogData.video && !ogData.video.startsWith("http")) {
      ogData.video = new URL(ogData.video, url).href;
    }
    if (ogData.audio && !ogData.audio.startsWith("http")) {
      ogData.audio = new URL(ogData.audio, url).href;
    }
    if (ogData.canonical && !ogData.canonical.startsWith("http")) {
      ogData.canonical = new URL(ogData.canonical, url).href;
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
