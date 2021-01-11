const User = require("../models/user");

exports.user_create_post = function (req, res, next) {
    const { username } = req.body;
    User.findOne({ username: username }, function (err, results) {
        if (err) {
            return next(err);
        }

        // if results is empty
        if (results == null) {
            // username is available
            const newUser = new User({
                username: username
            });
            newUser.save(function (err) {
                if (err) {
                    return next(err);
                }
                // saved!
                res.json({
                    _id: newUser._id,
                    username: newUser.username
                });
            });
        }
        else {
            res.send("username taken");
        }
    });
};

exports.user_list = function(req, res, next) {
    User.find({}, '_id username', function(err, results){
        if (err) {
            return next(err)
        }
        // got results
        res.json(results);
    })
}