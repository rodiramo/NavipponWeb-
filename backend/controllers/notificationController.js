// notificationController.js
import Notification from "../models/Notification.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
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

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }
    res.status(200).json({ message: "Notificación eliminada con éxito" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    next(error);
  }
};

export const clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID

    const result = await Notification.deleteMany({ recipient: userId });

    res.status(200).json({
      message: "Todas las notificaciones han sido eliminadas",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    next(error);
  }
};
