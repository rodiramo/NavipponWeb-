import axios from "axios";

export const getUserItineraries = async (userId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `/api/itineraries?userId=${userId}`,
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
    const { data } = await axios.get(`/api/itineraries/${id}`, config);
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
    await axios.delete(`/api/itineraries/${id}`, config);
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
      `/api/itineraries/${id}`,
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
      `/api/itineraries`,
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
  const { data } = await axios.get(`/api/itineraries/invited`, config);
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
      `/api/itineraries/leave/${itineraryId}`,
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
      `/api/itineraries/${itineraryId}/edit`,
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
    const { data } = await axios.get(`/api/favorites/user/${userId}`, config);
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
      `/api/itineraries/addTraveler/${itineraryId}`,
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
      `/api/itineraries/updateTravelerRole/${itineraryId}`,
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

// Remove a traveler from the itinerary
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
      `/api/itineraries/removeTraveler/${itineraryId}`,
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
