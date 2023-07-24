const Parser = require("rss-parser");
let parser = new Parser({
  customFields: {
    feed: ["image", "icon"],
  },
});

require("isomorphic-fetch");

async function getRSSFeed(feedURL) {
  try {
    const rss = await parser.parseURL(feedURL);
    return rss;
  } catch (error) {
    console.error("Error:", error);
    return { error: error };
  }
}

module.exports = getRSSFeed;
