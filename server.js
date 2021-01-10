const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

// add bodyparder middleware for every post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))

const router = express.Router();

const enableCORS = function (req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    const allowedOrigins = ["https://www.freecodecamp.org"];
    const origin = req.headers.origin;
    if (!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method + " " + req.path );
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      });
    }
  }
  next();
};

app.use("/api", enableCORS, router);

// create connection to DB
let mongoose;
try {
  mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (e) {
  console.log(e);
}

// create User model
let User;

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String
})
User = mongoose.model("User", UserSchema);

// create log model
let Log;
const LogSchema = new Schema({
  username: String
})
Log = mongoose.model("Log", LogSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// find one by usename
const findOneByUserName = async (username, done) => {
  User.find({ username: username }, async (err, result) => {
    if (err) return done(err);
    done(null, result);
  })
}

// find one by Id
const findOneById = async (id, done) => {
  User.findById({ _id: id }, async (err, result) => {
    if (err) return done(err);
    done(null, result);
  })
}

// create and save new user
const CreateAndSaveUser = async (username, done) => {
  new User({ username: username })
    .save(async (err, doc) => {
      if (err) return done(err);
      done(null, doc);
    })
}

// /api/exercise/new-user
router.post('/exercise/new-user', async (req, res) => {
  // find one by usename
  console.log("req.body.username :" + req.body.username)
  findOneByUserName(req.body.username, async (err, result1) => {
    console.log("findOneByUserName : " + result1)
    if (err) return res.json(err);
    if (result1 != "") {      
      return res.json({_id: result1._id, username: result1.username});
    } else {
      console.log("Before CreateAndSaveUser")
      // if no existing data
      CreateAndSaveUser(req.body.username, async(err, doc) => {
        if (err) return res.json(err);
        console.log("CreateAndSaveUser: " + doc)
        return res.json(doc);
      })
    }
  })
  
});

// api/exercise/users
router.get('/exercise/users', (req, res) => {
  User.find({}, function(err, result) {
    if (err) return res.json(err);
    console.log(result)
    return res.json(result);
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
