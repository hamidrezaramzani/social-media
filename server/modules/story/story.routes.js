const express = require("express");
const { add, getFollowingStories, getUserStories  , addViewStory } = require("./story.controller");
const authentication = require('../../middlewares/auth');
const router = express.Router();
router.post("/add", authentication , add);
router.get("/list/:id", authentication , getFollowingStories);
router.get("/all/:id", authentication , getUserStories);
router.get("/add-view/:user/:id", authentication , addViewStory);

module.exports = router;
