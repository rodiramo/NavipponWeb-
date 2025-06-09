import axios from "axios";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
console.log("GOOGLE_API_KEY:", process.env.REACT_APP_GOOGLE_API_KEY);

export const extractPlaceId = (mapUrl) => {
  if (!mapUrl) return null; // Return null if mapUrl is undefined
  const match =
    mapUrl.match(/!1s(0x[a-fA-F0-9]+:[a-fA-F0-9]+)/) ||
    mapUrl.match(/16s([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const fetchPlaceDetails = async (coords) => {
  // Coordinates are assumed in [longitude, latitude] order
  const [lng, lat] = coords;
  try {
    // Call your backend's nearby search endpoint
    const nearbyResponse = await axios.get(`/api/places?lat=${lat}&lng=${lng}`);
    const nearbyData = nearbyResponse.data;

    if (nearbyData.results && nearbyData.results.length > 0) {
      const place = nearbyData.results[0];
      // Call your backend's place details endpoint
      const detailsResponse = await axios.get(
        `/api/place-details?placeId=${place.place_id}`
      );
      const detailsData = detailsResponse.data;

      if (detailsData.result) {
        const {
          name,
          formatted_address,
          formatted_phone_number,
          website,
          price_level,
          address_components,
        } = detailsData.result;

        // Extract components (city, region, prefecture) as needed
        const city =
          address_components.find((c) => c.types.includes("locality"))
            ?.long_name || "";
        const region =
          address_components.find((c) =>
            c.types.includes("administrative_area_level_1")
          )?.long_name || "";
        const prefecture =
          address_components.find((c) =>
            c.types.includes("administrative_area_level_2")
          )?.long_name || "";

        return {
          name,
          formatted_address,
          phone: formatted_phone_number || "",
          website: website || "",
          price: price_level || null,
          city,
          region,
          prefecture,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    return null;
  }
};

export const getGooglePlaceDetails = async (placeId) => {
  if (!placeId) return null;
  try {
    const { data } = await axios.get(`/api/place-details?placeId=${placeId}`);
    if (data.status !== "OK") return null;

    const place = data.result;
    return {
      name: place.name || "",
      address: place.formatted_address || "",
      phone: place.formatted_phone_number || "",
      region:
        place.address_components?.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name || "",
      prefecture:
        place.address_components?.find((c) =>
          c.types.includes("administrative_area_level_2")
        )?.long_name || "",
      price: place.price_level ? `$${place.price_level}` : "",
    };
  } catch (error) {
    console.error("Error fetching Google Place details:", error);
    return null;
  }
};
