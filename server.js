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
app.post('/api/exercise/new-user', (req, res) => {
  // find one by usename
  findOneByUserName(req.body.username, async (err, result) => {
    if (err) return res.json(err);
    if (result != "") {
      return res.json({_id: result._id, username: result.username});
    }
  })
  // find one by _id
  findOneById(req.body._id, async (err, result) => {
    if (err) return res.json(err);
    if (result != "") {
      return res.json({_id: result._id, username: result.username});
    }
  })
  // if no existing data
  CreateAndSaveUser(req.body.username, async(err, doc) => {
    if (err) return res.json(err);
    console.log(doc)
    return res.json({_id: doc._id, username: doc.username});
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
