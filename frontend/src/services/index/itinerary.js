import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getUserItineraries = async (userId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/itineraries?userId=${userId}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSingleItinerary = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/itineraries/${id}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteItinerary = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${API_URL}/api/itineraries/${id}`, config);
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateItinerary = async (id, itinerary, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/${id}`,
      itinerary,
      config
    );
    return data;
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

export const createItinerary = async (itineraryData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/itineraries`,
      itineraryData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getInvitedItineraries = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(
    `${API_URL}/api/itineraries/invited`,
    config
  );
  return data;
};

export const leaveItinerary = async (itineraryId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/leave/${itineraryId}`,
      {}, // no additional data is needed
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Get the itinerary data for editing (if different from getSingleItinerary)
export const getSingleItineraryForEdit = async (itineraryId, token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `${API_URL}/api/itineraries/${itineraryId}/edit`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Get user favorites (if you have a separate endpoint for that)
export const getUserFavorites = async ({ userId, token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `${API_URL}/api/favorites/user/${userId}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Add a traveler to the itinerary
export const addTravelerToItinerary = async (
  itineraryId,
  travelerData,
  token
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // travelerData should be an object, e.g., { userId: "xxx", role: "editor" }
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/addTraveler/${itineraryId}`,
      travelerData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Update a traveler's role in the itinerary
export const updateTravelerRole = async (
  itineraryId,
  travelerId,
  newRole,
  token
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/updateTravelerRole/${itineraryId}`,
      { travelerId, role: newRole },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const removeTravelerFromItinerary = async (
  itineraryId,
  travelerId,
  token
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/removeTraveler/${itineraryId}`,
      { travelerId },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const addExperienceToItinerary = async ({
  itineraryId,
  experienceId,
  boardDate,
  token,
  // Remove userId parameter - backend gets it from JWT token
}) => {
  try {
    console.log("🚀 Service: Adding experience with params:", {
      itineraryId,
      experienceId,
      boardDate,
      hasToken: !!token,
    });

    if (!experienceId) {
      throw new Error("experienceId is required but not provided to service");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // FIXED: Only send what your backend expects
    const requestBody = {
      experienceId: experienceId,
      boardDate: boardDate,
      // DO NOT send userId - backend gets it from req.user._id via JWT
    };

    console.log(
      "📤 Service: Request body being sent:",
      JSON.stringify(requestBody, null, 2)
    );
    console.log(
      "📤 Service: Request URL:",
      `${API_URL}/api/itineraries/${itineraryId}/experiences`
    );

    const response = await axios.patch(
      `${API_URL}/api/itineraries/${itineraryId}/experiences`,
      requestBody,
      config
    );

    console.log("✅ Service: Success response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Service: Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message || "Unknown error in addExperienceToItinerary"
    );
  }
};

// FIXED: Remove an experience from an itinerary (matching your backend exactly)
export const removeExperienceFromItinerary = async ({
  itineraryId,
  experienceId,
  boardDate,
  token,
  // Remove userId parameter - backend gets it from JWT token
}) => {
  try {
    console.log("🗑️ Service: Removing experience with params:", {
      itineraryId,
      experienceId,
      boardDate,
      hasToken: !!token,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // FIXED: Only include boardDate in query params if provided
    const queryParams = new URLSearchParams();
    if (boardDate) queryParams.append("boardDate", boardDate);
    // Do NOT send userId - backend gets it from req.user._id via JWT

    const url = `${API_URL}/api/itineraries/${itineraryId}/experiences/${experienceId}?${queryParams.toString()}`;

    console.log("📤 Service: Request URL:", url);

    const response = await axios.delete(url, config);

    console.log("✅ Service: Success response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Service: Error in removeExperienceFromItinerary:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message || "Unknown error in removeExperienceFromItinerary"
    );
  }
};

// Check if an experience is already in an itinerary
export const checkExperienceInItinerary = async ({
  itineraryId,
  experienceId,
  token,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/itineraries/${itineraryId}/experiences/${experienceId}/check`,
      config
    );
    return data; // Returns { exists: true/false, boards: [], itineraryId, experienceId, favoriteId }
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Get all experiences in an itinerary
export const getItineraryExperiences = async (itineraryId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/itineraries/${itineraryId}/experiences`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Add this to your services/index/itinerary.js file:

export const createFavorite = async ({ experienceId, userId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/favorites`,
      { experienceId, userId },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Alternative endpoints you might need to try:
export const createUserFavorite = async ({ experienceId, userId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/users/${userId}/favorites`,
      { experienceId },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
