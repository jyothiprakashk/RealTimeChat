const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModal");
const { ObjectId } = require("mongodb");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);

    const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).send(Fullchat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        // console.log(results, "resultone");
        let response = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        // console.log(response, "responsedata");
        res.status(200).send(response);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users is required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: "Group Creation failed" });
    throw new Error("Group Creation failed");
  }
});

const renameChatGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedName) {
    res.sendStatus(400).send({ message: "Updating group name is failed" });
    throw new Error("Chat not found");
  } else {
    res.json(updatedName);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.sendStatus(400).send({ message: "Unable to add user" });
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.sendStatus(400).send({ message: "Unable to add user" });
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  const { newNotification, userId } = req.body;

  const result = await User.updateOne(
    { _id: new ObjectId(userId) }, // Identify the user document
    { $push: { notifications: newNotification } } // Push new notification to the array
  );

  const user = await User.findOne(
    { _id: new ObjectId(userId) },
    { notifications: 1, _id: 0 } // Retrieve only the notifications field
  );

  if (result) {
    res.status(200).json({
      success: true,
      message: "Notification added successfully",
      notifications: user.notifications, // Return all notifications
    });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Step 1: Retrieve all notifications for the user
    const user = await User.findOne(
      { _id: new ObjectId(userId) }
      // { notifications: 1, _id: 0 } // Retrieve only the notifications array
    );
    // console.log(user, "notification---user");
    // Step 2: Return all notifications in the response
    if (user) {
      res.status(200).json({
        success: true,
        notifications: user.notifications, // Return all notifications
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameChatGroup,
  addToGroup,
  removeFromGroup,
  addNotification,
  getNotifications,
};
