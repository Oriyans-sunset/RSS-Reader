const rssParser = require("react-native-rss-parser");
require("isomorphic-fetch");
async function getRSSFeed(feedURL) {
  try {
    const response = await fetch(feedURL);
    const responseData = await response.text();
    const rss = await rssParser.parse(responseData);
    return rss;
  } catch (error) {
    console.error("Error:", error);
    return { error: error };
  }
}

module.exports = getRSSFeed;
