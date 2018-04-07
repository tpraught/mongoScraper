var Headline = require("../models/Headline.js");

module.exports = function(app) {
    app.get("/", function(res, req) {
        Headline.find().sort({ _id: -1 })
            .exec(function(err, doc) {
                if(err) {
                    console.log(err);
                } else {
                    var articlesObject = {
                        articles: doc
                    };
                    res.render("index", articlesObject);
                }
            });
    });
};