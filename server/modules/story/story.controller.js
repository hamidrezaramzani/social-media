const Story = require("./story.model");
const moment = require("moment");
const Follow = require("../follow/follow.model")
const Post = require("../post/post.model")
const path = require("path");
const StoryModel = require("./story.model");
const UserModel = require("../user/user.model");
const add = async (req, res) => {
  try {
    const { id } = req.body;
    const { image } = req.files;

    const fileName = Math.ceil(Math.random() * 200000) + "image.png";
    const uploadedPath = path.resolve(
      __dirname,
      "../../public/images",
      fileName
    );
    image.mv(uploadedPath, (error) => {
      console.log(error);
      if (error)
        res.status(500).json({
          error,
        });
    });

    const timestamp = moment().add(1, "days");
    await StoryModel.create({ user: id, image: fileName, expireTime: timestamp });

    res.status(200).json({ message: "story added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};


const getFollowingStories = async (req, res) => {
  try {
    const { id } = req.params;
    const followings = await Follow.find({ user: id, status: "request-accepted" });
    const followingIds = followings.map((item) => {
      return item.following;
    });


    const timestamp = moment.now();
    const stories = await StoryModel.find({ user: { $in: followingIds }, expireTime: { $gt: timestamp } }).populate("user");
    const userStories = await StoryModel.find({ user: id, expireTime: { $gt: timestamp } }).populate("user");
    let userHaveStories = {};
    stories.forEach(item => {
      const keys = Object.keys(userHaveStories);
      const id = item.user._id;
      if (!keys.includes(id))
        userHaveStories[id] = item.user;
    });

    return res.status(200).json({ stories: userHaveStories, userStories });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

const getUserStories = async (req, res) => {
  try {
    const { id } = req.params;

    const timestamp = moment.now();
    const stories = await StoryModel.find({ user: id, expireTime: { $gt: timestamp } }).populate("user").populate("views.user");

    const user = await UserModel.findById(id);
    return res.status(200).json({ stories, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};


const addViewStory = async (req, res) => {
  try {
    const { user, id } = req.params;
    await StoryModel.updateOne({ _id: id }, { $push: { views: { user } } });
    return res.status(200).json({ message: "story seen" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

module.exports = { add, getFollowingStories, getUserStories, addViewStory };
