const Parser = require("rss-parser");
let parser = new Parser({
  customFields: {
    feed: ["image"],
  },
});

require("isomorphic-fetch");

async function getRSSFeed(feedURL) {
  try {
    parser.parseURL(feedURL, function (err, feed) {
      console.log(feed);
      return feed;
    });
    const rss = await parser.parseURL(feedURL);
    return rss;
  } catch (error) {
    console.error("Error:", error);
    return { error: error };
  }
}

module.exports = getRSSFeed;
