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

// ==================== EXISTING NOTIFICATIONS ====================

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

export const createTravelerRemovedNotification = async ({
  removerId,
  removerName,
  itineraryId,
  itineraryName,
  recipient,
}) => {
  const now = new Date();
  return await createNotification({
    recipient,
    sender: removerId,
    type: "traveler_removed",
    message: `${removerName} ha eliminado a un compañero del itinerario "${itineraryName}" el ${now.toLocaleDateString()}.`,
    data: {
      removerId,
      removerName,
      itineraryId,
      itineraryName,
      date: now,
      removerProfileUrl: `/profile/${removerId}`,
    },
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

// ==================== NEW FRIEND NOTIFICATIONS ====================

// Friend Request Sent Notification
export const createFriendRequestNotification = async (
  senderId,
  senderName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "friend_request",
    message: `${senderName} te ha enviado una solicitud de amistad.`,
    data: {
      senderProfileUrl: `/profile/${senderId}`,
      actionRequired: true,
    },
  });
};

// Friend Request Accepted Notification
export const createFriendRequestAcceptedNotification = async (
  accepterId,
  accepterName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: accepterId,
    type: "friend_request_accepted",
    message: `${accepterName} ha aceptado tu solicitud de amistad.`,
    data: {
      accepterProfileUrl: `/profile/${accepterId}`,
    },
  });
};

// Friend Request Rejected Notification
export const createFriendRequestRejectedNotification = async (
  rejecterId,
  rejecterName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: rejecterId,
    type: "friend_request_rejected",
    message: `${rejecterName} ha rechazado tu solicitud de amistad.`,
    data: {
      rejecterProfileUrl: `/profile/${rejecterId}`,
    },
  });
};

// Friend Removed Notification
export const createFriendRemovedNotification = async (
  removerId,
  removerName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: removerId,
    type: "friend_removed",
    message: `${removerName} ya no es tu amigo.`,
    data: {
      removerProfileUrl: `/profile/${removerId}`,
    },
  });
};

// ==================== PROFILE NOTIFICATIONS ====================

// Profile Viewed Notification
export const createProfileViewNotification = async (
  viewerId,
  viewerName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: viewerId,
    type: "profile_view",
    message: `${viewerName} ha visitado tu perfil.`,
    data: {
      viewerProfileUrl: `/profile/${viewerId}`,
      date: new Date(),
    },
  });
};

// Profile Follow Notification (if using follow system)
export const createProfileFollowNotification = async (
  followerId,
  followerName,
  recipientId
) => {
  return await createNotification({
    recipient: recipientId,
    sender: followerId,
    type: "profile_follow",
    message: `${followerName} ahora te sigue.`,
    data: {
      followerProfileUrl: `/profile/${followerId}`,
    },
  });
};

// ==================== POST NOTIFICATIONS ====================

// Post Published Notification (to followers)
export const createPostPublishedNotification = async (
  authorId,
  authorName,
  recipientId,
  postId,
  postTitle
) => {
  return await createNotification({
    recipient: recipientId,
    sender: authorId,
    type: "post_published",
    message: `${authorName} ha publicado una nueva entrada: "${postTitle}".`,
    data: {
      postId,
      postTitle,
      authorProfileUrl: `/profile/${authorId}`,
      postUrl: `/post/${postId}`,
    },
  });
};

// Post Shared Notification
export const createPostSharedNotification = async (
  sharerId,
  sharerName,
  recipientId,
  postId,
  postTitle
) => {
  return await createNotification({
    recipient: recipientId,
    sender: sharerId,
    type: "post_shared",
    message: `${sharerName} ha compartido tu publicación "${postTitle}".`,
    data: {
      postId,
      postTitle,
      sharerProfileUrl: `/profile/${sharerId}`,
      postUrl: `/post/${postId}`,
    },
  });
};

// Post Favorited Notification
export const createPostFavoritedNotification = async (
  favoriteById,
  favoriteByName,
  recipientId,
  postId,
  postTitle
) => {
  return await createNotification({
    recipient: recipientId,
    sender: favoriteById,
    type: "post_favorited",
    message: `${favoriteByName} ha guardado tu publicación "${postTitle}" en favoritos.`,
    data: {
      postId,
      postTitle,
      favoriteByProfileUrl: `/profile/${favoriteById}`,
      postUrl: `/post/${postId}`,
    },
  });
};

// ==================== ITINERARY ENHANCED NOTIFICATIONS ====================

// Itinerary Role Changed Notification
export const createItineraryRoleChangedNotification = async ({
  changerId,
  changerName,
  recipientId,
  itineraryId,
  itineraryName,
  oldRole,
  newRole,
}) => {
  return await createNotification({
    recipient: recipientId,
    sender: changerId,
    type: "itinerary_role_changed",
    message: `${changerName} ha cambiado tu rol en "${itineraryName}" de ${oldRole} a ${newRole}.`,
    data: {
      itineraryId,
      itineraryName,
      oldRole,
      newRole,
      changerProfileUrl: `/profile/${changerId}`,
      itineraryUrl: `/itinerary/${itineraryId}`,
    },
  });
};

// Itinerary Shared Notification
export const createItinerarySharedNotification = async ({
  sharerId,
  sharerName,
  recipientId,
  itineraryId,
  itineraryName,
}) => {
  return await createNotification({
    recipient: recipientId,
    sender: sharerId,
    type: "itinerary_shared",
    message: `${sharerName} ha compartido contigo el itinerario "${itineraryName}".`,
    data: {
      itineraryId,
      itineraryName,
      sharerProfileUrl: `/profile/${sharerId}`,
      itineraryUrl: `/itinerary/${itineraryId}`,
    },
  });
};

// Itinerary Published Notification
export const createItineraryPublishedNotification = async ({
  authorId,
  authorName,
  recipientId,
  itineraryId,
  itineraryName,
}) => {
  return await createNotification({
    recipient: recipientId,
    sender: authorId,
    type: "itinerary_published",
    message: `${authorName} ha publicado un nuevo itinerario: "${itineraryName}".`,
    data: {
      itineraryId,
      itineraryName,
      authorProfileUrl: `/profile/${authorId}`,
      itineraryUrl: `/itinerary/${itineraryId}`,
    },
  });
};

// Experience Added to Itinerary Notification
export const createExperienceAddedNotification = async ({
  adderId,
  adderName,
  recipientId,
  itineraryId,
  itineraryName,
  experienceName,
  day,
}) => {
  return await createNotification({
    recipient: recipientId,
    sender: adderId,
    type: "experience_added",
    message: `${adderName} ha añadido "${experienceName}" al día ${day} del itinerario "${itineraryName}".`,
    data: {
      itineraryId,
      itineraryName,
      experienceName,
      day,
      adderProfileUrl: `/profile/${adderId}`,
      itineraryUrl: `/itinerary/${itineraryId}`,
    },
  });
};

// ==================== SYSTEM NOTIFICATIONS ====================

// Welcome Notification
export const createWelcomeNotification = async (userId, userName) => {
  return await createNotification({
    recipient: userId,
    type: "system_welcome",
    message: `¡Bienvenido a Navippon, ${userName}! Completa tu perfil para comenzar a planificar tus aventuras.`,
    data: {
      actionUrl: `/profile/${userId}`,
      isSystemMessage: true,
    },
  });
};

// Account Security Notification
export const createSecurityNotification = async (userId, action, location) => {
  return await createNotification({
    recipient: userId,
    type: "account_security",
    message: `Actividad de seguridad: ${action}.`,
    data: {
      action,
      timestamp: new Date(),
    },
  });
};

// Password Changed Notification
export const createPasswordChangedNotification = async (userId) => {
  return await createNotification({
    recipient: userId,
    type: "password_changed",
    message: "Tu contraseña ha sido cambiada exitosamente.",
    data: {
      timestamp: new Date(),
      isSecurityAlert: true,
    },
  });
};

// Email Verified Notification
export const createEmailVerifiedNotification = async (userId) => {
  return await createNotification({
    recipient: userId,
    type: "email_verified",
    message: "Tu dirección de email ha sido verificada exitosamente.",
    data: {
      timestamp: new Date(),
      isSystemMessage: true,
    },
  });
};

// ==================== CONTENT MODERATION NOTIFICATIONS ====================

// Content Approved Notification
export const createContentApprovedNotification = async (
  moderatorId,
  recipientId,
  contentType,
  contentId,
  contentTitle
) => {
  return await createNotification({
    recipient: recipientId,
    sender: moderatorId,
    type: "content_approved",
    message: `Tu ${contentType} "${contentTitle}" ha sido aprobado por moderación.`,
    data: {
      contentType,
      contentId,
      contentTitle,
      moderatorId,
    },
  });
};

// Content Rejected Notification
export const createContentRejectedNotification = async (
  moderatorId,
  recipientId,
  contentType,
  contentId,
  contentTitle,
  reason
) => {
  return await createNotification({
    recipient: recipientId,
    sender: moderatorId,
    type: "content_rejected",
    message: `Tu ${contentType} "${contentTitle}" ha sido rechazado. Motivo: ${reason}`,
    data: {
      contentType,
      contentId,
      contentTitle,
      reason,
      moderatorId,
    },
  });
};

// ==================== EXPERIENCE NOTIFICATIONS ====================

// Experience Liked Notification
export const createExperienceLikedNotification = async (
  likerId,
  likerName,
  recipientId,
  experienceId,
  experienceName
) => {
  return await createNotification({
    recipient: recipientId,
    sender: likerId,
    type: "experience_liked",
    message: `A ${likerName} le ha gustado tu reseña de "${experienceName}".`,
    data: {
      experienceId,
      experienceName,
      likerProfileUrl: `/profile/${likerId}`,
      experienceUrl: `/experience/${experienceId}`,
    },
  });
};

// Experience Review Notification
export const createExperienceReviewNotification = async (
  reviewerId,
  reviewerName,
  recipientId,
  experienceId,
  experienceName
) => {
  return await createNotification({
    recipient: recipientId,
    sender: reviewerId,
    type: "experience_review",
    message: `${reviewerName} ha dejado una reseña en "${experienceName}".`,
    data: {
      experienceId,
      experienceName,
      reviewerProfileUrl: `/profile/${reviewerId}`,
      experienceUrl: `/experience/${experienceId}`,
    },
  });
};

// ==================== REMINDER NOTIFICATIONS ====================

// Trip Reminder Notification
export const createTripReminderNotification = async (
  userId,
  itineraryId,
  itineraryName,
  daysUntilTrip
) => {
  return await createNotification({
    recipient: userId,
    type: "trip_reminder",
    message: `¡Tu viaje "${itineraryName}" comienza en ${daysUntilTrip} días! ¿Ya tienes todo listo?`,
    data: {
      itineraryId,
      itineraryName,
      daysUntilTrip,
      itineraryUrl: `/itinerary/${itineraryId}`,
      isReminder: true,
    },
  });
};

// Profile Completion Reminder
export const createProfileCompletionReminderNotification = async (userId) => {
  return await createNotification({
    recipient: userId,
    type: "profile_completion_reminder",
    message:
      "Completa tu perfil para obtener mejores recomendaciones de viaje.",
    data: {
      profileUrl: `/profile/${userId}`,
      isReminder: true,
    },
  });
};

// ==================== MILESTONE NOTIFICATIONS ====================

// Achievement Notification
export const createAchievementNotification = async (
  userId,
  achievementName,
  achievementDescription
) => {
  return await createNotification({
    recipient: userId,
    type: "achievement",
    message: `¡Felicidades! Has desbloqueado el logro "${achievementName}": ${achievementDescription}`,
    data: {
      achievementName,
      achievementDescription,
      isAchievement: true,
    },
  });
};

// Trip Count Milestone Notification
export const createTripMilestoneNotification = async (
  userId,
  tripCount,
  milestone
) => {
  return await createNotification({
    recipient: userId,
    type: "trip_milestone",
    message: `¡Increíble! Has creado ${tripCount} itinerarios. ${milestone}`,
    data: {
      tripCount,
      milestone,
      isMilestone: true,
    },
  });
};

// ==================== UTILITY FUNCTIONS ====================

// Send notification to all itinerary travelers
export const notifyAllTravelers = async (
  itineraryId,
  travelers,
  notificationData,
  excludeUserId = null
) => {
  const notifications = [];

  for (const traveler of travelers) {
    const travelerId = traveler.userId?._id || traveler.userId;

    // Skip the user who triggered the action
    if (excludeUserId && travelerId.toString() === excludeUserId.toString()) {
      continue;
    }

    try {
      const notification = await createNotification({
        ...notificationData,
        recipient: travelerId,
      });
      notifications.push(notification);
    } catch (error) {
      console.error(
        `Failed to send notification to traveler ${travelerId}:`,
        error
      );
    }
  }

  return notifications;
};

// Send notification to all user's friends
export const notifyAllFriends = async (userId, friends, notificationData) => {
  const notifications = [];

  for (const friend of friends) {
    const friendId = friend._id || friend;

    try {
      const notification = await createNotification({
        ...notificationData,
        recipient: friendId,
      });
      notifications.push(notification);
    } catch (error) {
      console.error(
        `Failed to send notification to friend ${friendId}:`,
        error
      );
    }
  }

  return notifications;
};

// Batch notification sender
export const sendBatchNotifications = async (notifications) => {
  const results = [];

  for (const notificationData of notifications) {
    try {
      const notification = await createNotification(notificationData);
      results.push({ success: true, notification });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  return results;
};
