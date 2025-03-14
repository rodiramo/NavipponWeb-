import Notification from "../models/Notification.js";

/**
 * Creates a generic notification.
 * @param {Object} params
 * @param {String} params.recipient - The recipient user ID.
 * @param {String} params.sender - The sender user ID (optional).
 * @param {String} params.type - The type of notification.
 * @param {String} params.message - The notification message.
 * @param {Object} [params.data] - Optional extra data (e.g. postId, commentId).
 * @returns {Promise<Object>} The created notification.
 */
export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  data,
}) => {
  return await Notification.create({
    recipient,
    sender,
    type,
    message,
    data,
  });
};

// Friend Request Notification
export const createFriendAddedNotification = async (
  senderId,
  senderName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "friend_added",
    message: `${senderName} te ha agregado como amigo.`,
    data: {
      senderProfileUrl: `/profile/${senderId}`,
    },
  });
};

// Itinerary Invite Notification
// Itinerary Invite Notification
export const createItineraryInviteNotification = async (
  creatorId,
  creatorName,
  itineraryId,
  itineraryName,
  recipientId,
  role
) => {
  const now = new Date();
  return await createNotification({
    recipient: recipientId,
    sender: creatorId,
    type: "itinerary_invite",
    message: `Has sido añadido al viaje "${itineraryName}" por ${creatorName} el ${now.toLocaleDateString()} como ${
      role || "participante"
    }.`,
    data: {
      itineraryId,
      itineraryName,
      role,
      date: now,
      // Adding URLs for links
      creatorProfileUrl: `/profile/${creatorId}`,
      itineraryUrl: `/itinerary/${itineraryId}`,
    },
  });
};

// Itinerary Update Notification
export const createItineraryUpdateNotification = async (
  updaterId,
  updaterName,
  itineraryId,
  itineraryName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: updaterId,
    type: "itinerary_update",
    message: `${updaterName} ha realizado cambios en el viaje "${itineraryName}".`,
    data: { itineraryId, itineraryName, date: new Date() },
  });
};
// Trip Invite Notification
export const createTripInviteNotification = async (
  senderId,
  recipientId,
  tripId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "trip_invite",
    message: "Has sido invitado a un viaje.",
    data: { tripId },
  });
};
export const createItineraryLeaveNotification = async ({
  leavingUserId,
  leavingUserName,
  itineraryId,
  itineraryName,
  recipient,
}) => {
  const now = new Date();
  return await createNotification({
    recipient,
    sender: leavingUserId,
    type: "itinerary_leave",
    message: `${leavingUserName} ha abandonado el itinerario "${itineraryName}" el ${now.toLocaleDateString()}.`,
    data: {
      leavingUserId,
      leavingUserName,
      itineraryId,
      itineraryName,
      date: now,
      leavingUserProfile: `/profile/${leavingUserId}`,
    },
  });
};
// Admin Verification Notification
export const createAdminVerificationNotification = async (
  adminId,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: adminId,
    type: "admin_verification",
    message: "Tu cuenta ha sido verificada por el administrador.",
  });
};

// Post Like Notification
export const createPostLikeNotification = async (
  likerId,
  recipientId,
  postId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: likerId,
    type: "post_like",
    message: "A alguien le ha gustado tu publicación.",
    data: { postId },
  });
};

// Comment Notification
export const createCommentNotification = async (
  commenterId,
  recipientId,
  postId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: commenterId,
    type: "comment",
    message: "Alguien ha comentado en tu publicación.",
    data: { postId },
  });
};

// Reply Notification
export const createReplyNotification = async (
  replierId,
  recipientId,
  commentId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: replierId,
    type: "reply",
    message: "Alguien ha respondido a tu comentario.",
    data: { commentId },
  });
};

// Review Approved Notification
export const createReviewApprovedNotification = async (
  adminId,
  recipientId,
  reviewId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: adminId,
    type: "review_approved",
    message: "Tu reseña ha sido aprobada por el administrador.",
    data: { reviewId },
  });
};
