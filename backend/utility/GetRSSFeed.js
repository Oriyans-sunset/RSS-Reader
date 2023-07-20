const Parser = require("rss-parser");
let parser = new Parser({
  customFields: {
    feed: ["image"],
  },
});

require("isomorphic-fetch");

async function getRSSFeed(feedURL) {
  try {
    const rss = await parser.parseURL(feedURL);
    console.log(rss);
    return rss;
  } catch (error) {
    console.error("Error:", error);
    return { error: error };
  }
}

module.exports = getRSSFeed;
