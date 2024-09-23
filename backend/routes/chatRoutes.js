const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameChatGroup,
  addToGroup,
  removeFromGroup,
  addNotification,
  getNotifications,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/renameGroup").put(protect, renameChatGroup);
router.route("/addtogroup").put(protect, addToGroup);
router.route("/removefromgroup").put(protect, removeFromGroup);
router.route("/updatenotification").post(protect, addNotification);
router.route("/getNotifications/:userId").get(protect, getNotifications);

module.exports = router;
