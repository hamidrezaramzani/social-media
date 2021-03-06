const ChatModel = require("./chat.model");

const handleGetMessages = async (req, res) => {
  try {
    const { sid, rid } = req.params;
    const messages = await ChatModel.find({
      $or: [
        { sender: sid, receiver: rid },
        { receiver: sid, sender: rid },
      ],
    })
      .populate("sender", "fullname username")
      .populate("receiver", "fullname username");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

const getChats = async (req, res) => {
  try {
    const { id } = req.params;
    const chats = await ChatModel.find({
      $or: [
        { sender: id },
        { receiver: id },
      ],
    })
      .populate("sender", "fullname  profile")
      .populate("receiver", "fullname  profile").populate("messages.story");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

module.exports = {
  handleGetMessages,
  getChats
};
