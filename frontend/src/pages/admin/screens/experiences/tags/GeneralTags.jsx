import React from "react";
import { FaSnowflake, FaSun, FaLeaf, FaTree } from "react-icons/fa";
import { MdAttachMoney, MdStars, MdLocationOn } from "react-icons/md";

const generalTags = {
  season: [
    { icon: <FaLeaf />, label: "Primavera" },
    { icon: <FaSun />, label: "Verano" },
    { icon: <FaTree />, label: "Otoño" },
    { icon: <FaSnowflake />, label: "Invierno" },
    { icon: <MdStars />, label: "Todo el año" },
  ],
  budget: [
    { icon: <MdAttachMoney />, label: "Gratis" },
    { icon: <MdAttachMoney />, label: "Económico" },
    { icon: <MdAttachMoney />, label: "Moderado" },
    { icon: <MdAttachMoney />, label: "Lujo" },
  ],
  rating: [
    { icon: <MdStars />, label: "1 Estrella", value: 1 },
    { icon: <MdStars />, label: "2 Estrellas", value: 2 },
    { icon: <MdStars />, label: "3 Estrellas", value: 3 },
    { icon: <MdStars />, label: "4 Estrellas", value: 4 },
    { icon: <MdStars />, label: "5 Estrellas", value: 5 },
  ],
  location: [
    { icon: <MdLocationOn />, label: "Cerca de estaciones de tren o metro" },
    { icon: <MdLocationOn />, label: "Cerca de aeropuertos" },
    { icon: <MdLocationOn />, label: "Cerca de áreas de puntos de interés" },
  ],
};

const GeneralTags = ({ selectedGeneralTags, setSelectedGeneralTags }) => {
  const handleSelectChange = (tagType, tagValue) => {
    setSelectedGeneralTags((prevTags) => ({
      ...prevTags,
      [tagType]: tagValue ? [tagValue] : [],
    }));
  };

  return (
    <div className="mb-5 mt-2">
      <label className="d-label">
        <span className="d-label-text">Filtros Generales</span>
      </label>
      <div className="flex flex-wrap gap-4">
        {Object.keys(generalTags).map((tagType) => (
          <div key={tagType} className="flex flex-col w-auto">
            <label className="font-bold">{tagType.toUpperCase()}</label>
            <select
              value={selectedGeneralTags[tagType][0] || ""}
              onChange={(e) => handleSelectChange(tagType, e.target.value)}
              className="d-input d-input-bordered border-slate-300 text-sm font-medium"
            >
              <option value="">Selecciona una opción</option>
              {generalTags[tagType].map(({ label, value }) => (
                <option key={label} value={value || label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralTags;
