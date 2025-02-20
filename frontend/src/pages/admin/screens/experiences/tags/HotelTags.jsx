import React from "react";
import {
  FaHotel,
  FaCapsules,
  FaBuilding,
  FaHome,
  FaWifi,
  FaParking,
  FaSwimmer,
  FaDumbbell,
  FaUtensils,
  FaWheelchair,
  FaDog,
  FaHeart,
  FaBriefcase,
  FaHiking,
  FaMountain,
} from "react-icons/fa";
import { GiBed } from "react-icons/gi";
import {
  MdOutlineSpa,
  MdFreeBreakfast,
  MdAirportShuttle,
} from "react-icons/md";

const accommodation = [
  { icon: <FaHotel />, label: "Hoteles de lujo" },
  { icon: <MdOutlineSpa />, label: "Ryokan (tradicional)" },
  { icon: <FaCapsules />, label: "Hoteles cápsula" },
  { icon: <FaBuilding />, label: "Hoteles de negocios" },
  { icon: <FaHome />, label: "Apartamentos" },
  { icon: <GiBed />, label: "Hostales" },
];

const hotelServices = [
  { icon: <FaWifi />, label: "Wi-Fi gratis" },
  { icon: <MdFreeBreakfast />, label: "Desayuno incluido" },
  { icon: <FaParking />, label: "Aparcamiento gratuito" },
  { icon: <MdAirportShuttle />, label: "Transporte al aeropuerto" },
  { icon: <FaSwimmer />, label: "Piscina" },
  { icon: <FaDumbbell />, label: "Gimnasio" },
  { icon: <FaUtensils />, label: "Restaurante en el hotel" },
  { icon: <FaWheelchair />, label: "Accesible" },
  { icon: <FaDog />, label: "Admite mascotas" },
];

const typeTrip = [
  { icon: <FaHeart />, label: "Luna de miel" },
  { icon: <FaBriefcase />, label: "De negocios" },
  { icon: <FaHiking />, label: "Amigable para mochileros" },
  { icon: <FaMountain />, label: "Para aventureros" },
];

const HotelTags = ({ selectedHotelTags, setSelectedHotelTags }) => {
  const handleTagChange = (tagType, tagLabel) => {
    setSelectedHotelTags((prevTags) => {
      const newTags = { ...prevTags };
      if (!newTags[tagType]) {
        newTags[tagType] = [];
      }
      if (newTags[tagType].includes(tagLabel)) {
        newTags[tagType] = newTags[tagType].filter((tag) => tag !== tagLabel);
      } else {
        newTags[tagType].push(tagLabel);
      }
      return newTags;
    });
  };

  return (
    <div className="mb-5 mt-2">
      {/* Accommodation Type */}
      <label className="d-label">
        <span className="d-label-text">Tipos de Alojamiento</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {accommodation.map(({ icon, label }) => (
          <label
            key={label}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedHotelTags.accommodation.includes(label)}
              onChange={() => handleTagChange("accommodation", label)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span className="flex items-center">
              {icon}
              <span className="ml-2">{label}</span>
            </span>
          </label>
        ))}
      </div>

      {/* Hotel Services */}
      <label className="d-label mt-4">
        <span className="d-label-text">Servicios del Hotel</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hotelServices.map(({ icon, label }) => (
          <label
            key={label}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedHotelTags.hotelServices.includes(label)}
              onChange={() => handleTagChange("hotelServices", label)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span className="flex items-center">
              {icon}
              <span className="ml-2">{label}</span>
            </span>
          </label>
        ))}
      </div>

      {/* Type of Trip */}
      <label className="d-label mt-4">
        <span className="d-label-text">Tipo de Viaje</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {typeTrip.map(({ icon, label }) => (
          <label
            key={label}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedHotelTags.typeTrip.includes(label)}
              onChange={() => handleTagChange("typeTrip", label)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span className="flex items-center">
              {icon}
              <span className="ml-2">{label}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default HotelTags;
