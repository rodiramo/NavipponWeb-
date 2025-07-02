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

// Add these functions to your existing itinerary service file

// Add an experience to an itinerary
export const addExperienceToItinerary = async ({
  itineraryId,
  experienceId,
  boardDate,
  token,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${API_URL}/api/itineraries/${itineraryId}/experiences`,
      { experienceId, boardDate },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Remove an experience from an itinerary
export const removeExperienceFromItinerary = async ({
  itineraryId,
  experienceId,
  boardDate,
  token,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Add boardDate as query parameter if provided
    const url = boardDate
      ? `${API_URL}/api/itineraries/${itineraryId}/experiences/${experienceId}?boardDate=${boardDate}`
      : `${API_URL}/api/itineraries/${itineraryId}/experiences/${experienceId}`;

    const { data } = await axios.delete(url, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
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
