const Exercise = require('../models/exercise')
const User = require('../models/user')

exports.exercise_create_post = function (req, res, next) {
    const { userId, description, duration, date } = req.body;
    const dateObj = date == "" || date == undefined ? new Date() : new Date(date);

    const exercise = new Exercise({
        user: userId,
        description: description,
        duration: duration,
        date: dateObj
    });

    exercise.save(function (err) {
        if (err) {
            return next(err);
        }
        // saved!
        // get username by id
        User.findOne({ _id: userId }, function (err, result) {
            if (err) {
                return next(err);
            }
            // got user
            res.json({
                _id: result._id,
                username: result.username,
                date: dateObj.toDateString(),
                duration: +duration,
                description: description
            });
        });
    });
};

exports.exercise_log = function (req, res, next) {
    //Check what params are available and filter results {userId}[&from][&to][&limit]
    const { userId, from, to, limit } = req.query;
    User.findOne({ _id: userId }, "username", function (err, foundUser) {
        if (err) {
            console.log("err at findOne in get log", err)
            return next(err);
        }
        // found user
        let query = Exercise.find({ user: userId }).lean();

        if (from) {
            console.log("FROM query param added", from)
            const fromDate = new Date(from);
            query.where("date").gte(fromDate);
        }
        if (to) {
            console.log("TO query param added", to)
            const toDate = new Date(to);
            query.where("date").lte(toDate);
        }
        if (limit) {
            console.log("LIMIT query param added", +limit)
            query.limit(+limit);
        }
        query.exec(function(err, results) {
          if (err) {
            console.log("err at find exercise in get log")
            return next(err);
          }
          //we have results
          console.log(results)
          const newResults = results.map(result => {
            
            return {
              username: foundUser.username,
              description: result.description,
              duration: result.duration,
              _id: result._id,
              date: result.date.toDateString(),
            }
          })
        
          res.json({
            _id: userId,
            username: foundUser.username,
            count: results.length,
            log: newResults.slice().reverse()
            
          });
        });
    });
}