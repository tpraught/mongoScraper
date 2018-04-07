var axios = require("axios");
var cheerio = require("cheerio");
var scrape = require('../../scripts/scrape.js');
var db = require("../../models");
    var Headline = require("../../models/Headline.js");
    var Note = require("../../models/Note.js");

module.exports = function(app) {

    app.get("/", function(req, res) {
        Headline.find({ saved: false }).sort({ _id: -1 }), (function(err, doc) {
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

    app.get("/scrape", function(req, res) {
        axios.get("http://www.startribune.com/").then(function(response) {
            var $ = cheerio.load(response.data);
            var articleHeadlines = [];

            $("div.tease").each(function(i, element) {
                
                var result = {};
                
                result.headline = $(this).find("h3").text.trim();
                result.summary = $(this).find("div.tease-summary").text.trim();
                result.link = $(this).find("a").attr("href");

                if (headline !== "" && summary !== "" && link !== "") {
                    if(articleHeadlines.indexOf(result.headline) == -1) {
                        // Pushing the headline an array
                        articleHeadlines.push(result.headline);

                        // Adding the headline if it hasn't already been added
                        Headline.count({ headline: result.headline}, function (err, saved) {
                            if(saved == 0) {
                                var newEntry = new Headline(result);

                                newEntry.save(function(err, doc) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log(doc);
                                    }
                                });
                            }
                        });
                    }
                }
            });
            res.redirect("/");
        });
    });

    app.get("/saved/:id", function(req, res) {
        Headline.findById(req.params.id, function(err, data) {
            if (data.saved) {
                Headline.findByIdAndUpdate(req.params.id, { $set: { saved: false, status: "Save Article" }}, { new: true }, function(err, data) {
                    res.redirect("/");
                });
            } else {
                Headline.findByIdAndUpdate(req.params.id, { $set: { saved: true, status: "Saved" }}, { new: true }, function(err, data) {
                    console.log("Article saved");
                    res.redirect("/saved");
                });
            }
        });
    });

    app.get("/delete/:id", function(req, res) {
        console.log("Line 83: ", req.params.id);

        Headline.remove({ "_id": req.paramas.id }, function(err, data) {
            if(err) {
                console.log("This article cannot be removed");
            } else {
                console.log("Article has been removed");
            }
            res.redirect("/saved");
        });
    });

    app.get("/articles/:id", function(req, res) {
        console.log("Article id: ", req.params.id);

        Headline.findOne({ "_id": req.params.id })
            .populate("note")
            .then(function(dbArticle) {
                console.log("Line 101: ", dbArticle);

                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.post("/articles/:id", function(req, res) {
        var addNote = new Note(req.body);

        addNote.save(function(err, doc) {
            if(err) throw err;

            console.log("Note ID: ", doc._id);

            Headline.findOneAndUpdate({ "_id": req.params.id }, { $push: { note: doc._id }}, { new: true, upsert: true })
                .populate("note")
                .exec(function(err, doc) {
                    console.log("Article has been updated");
                    if(err) {
                        console.log("Article cannot be found");
                    } else {
                        console.log("Notes?" + doc.notes);
                        res.send(doc);
                    }
                });
        });
    });

    app.get("/notes/:id", function(req, res) {
        console.log("Note ID: ", req.paramas.id);

        Note.findOneAndRemove({ "_id": req.paramas.id }, function(err, doc) {
            if(err) {
                console.log("Not able to delete note: " + err);
            } else {
                console.log("Note has been deleted");
            }
            res.send(doc);
        });
    });

};