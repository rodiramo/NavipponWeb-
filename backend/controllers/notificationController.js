// notificationController.js
import Notification from "../models/Notification.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id; // assuming authentication middleware adds req.user
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    next(error);
  }
};
