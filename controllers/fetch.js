var db = require("./models");

// Scraping Star Tribune
app.get("/scrape", function (res, req) {
  axios.get("http://www.startribune.com/")
    .then(function(response) {

      var $ = cheerio.load(response.data);

      $("div.tease").each(function(i, element) {
        var result = {};

        var headline = $(this).find("h3").text.trim();
        var summary = $(this).find("div.tease-summary").text.trim();
        var link = $(this).find("a").attr("href");

        db.Headline.create(result)
          .then(function(dbHeadline) {
            console.log(dbHeadline);
          })
          .catch (function(err) {
            return res.json(err);
          });
      });

        var articleObject = {
          articles: scrapedHeadlines
        };

        res.render("index", articleObject);
    });
  });

  module.exports = scrapedHeadlines;