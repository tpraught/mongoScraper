var db = require("../../models");

module.exports = function(app) {
    
    // GET route for displaying all headlines
    app.get("/"), function(req, res) {
        db.Headline.find({}).then(function(dbHeadline) {
            return res.render("index", {headlines: dbHeadline});
        });
    }

    // GET route for getting all saved headlines
    app.get("/saved"), function(req, res) {
        db.Headline.find({ saved: true }).then(function(dbHeadline) {
            return res.render("saved", {headline: dbHeadline});
        });
    }
};