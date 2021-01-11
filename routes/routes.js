const express = require('express');
const router = express.Router();

// Require controller modules

const exercise_controller = require('../controllers/exerciseController');
const user_controller = require('../controllers/userController');

/// USER ROUTES ///

// Create a user
// POST api/exercise/new-user
router.post('/new-user', user_controller.user_create_post)

// Get an array of all users
// GET api/exercise/users
router.get('/users', user_controller.user_list)

/// EXERCISE ROUTES ///

// Create an exercise
// POST api/exercise/add
router.post('/add', exercise_controller.exercise_create_post)

// Get a full exercise log with userId and optional from & to (yyyy-mm-dd) or limit (int)
// GET api/exercise/log?{userId}[&from][&to][&limit]
router.get('/log', exercise_controller.exercise_log)

module.exports = router;