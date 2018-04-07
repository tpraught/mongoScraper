var axios = require("axios");
var cheerio = require("cheerio");

// Scraping Smashing Magazine
var scrape = function (url, cb) {

    if (url == "http://www.startribune.com/") {
        axios.get(url).then(function(reponse) {

            var $ = cheerio.load(response.data);

            var articleArray = [];
            var result = {};

            $("div.tease").each(function(i, element) {

                var headline = $(this).find("h3").text.trim();
                var summary = $(this).find("div.tease-summary").text.trim();
                var link = $(this).find("a").attr("href");

                if (link !== "" && headline !== "" && summary !== "") {
                    
                    result.headline = headline.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    result.summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    result.link = link;

                    articleArray.push(result);

                }
            });

            console.log(result);
            cb(articleArray);

        });
    };
};

module.exports = scrape;