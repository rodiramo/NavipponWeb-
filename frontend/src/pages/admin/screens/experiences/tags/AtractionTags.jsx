import React from "react";
import {
  MdOutlineForest,
  MdOutlineBeachAccess,
  MdOutlineRamenDining,
  MdOutlineCoffee,
  MdOutlineShoppingBag,
  MdOutlineTempleBuddhist,
  MdOutlineTempleHindu,
  MdOutlineHotTub,
  MdOutlineCastle,
} from "react-icons/md";
import { TbBuildingMonument, TbTorii } from "react-icons/tb";
import { LiaCocktailSolid, LiaGamepadSolid } from "react-icons/lia";
import {
  GiGreekTemple,
  GiPartyPopper,
  GiSamuraiHelmet,
  GiGrapes,
} from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { VscOctoface } from "react-icons/vsc";
import { LuFerrisWheel } from "react-icons/lu";
import { PiBirdBold, PiCross } from "react-icons/pi";

// Define attraction tags **OUTSIDE** the component
const attractionTags = [
  { icon: <MdOutlineForest />, title: "Naturaleza" },
  { icon: <MdOutlineBeachAccess />, title: "Playa" },
  { icon: <TbBuildingMonument />, title: "Monumento" },
  { icon: <MdOutlineRamenDining />, title: "Gastronomía" },
  { icon: <LiaCocktailSolid />, title: "Noche" },
  { icon: <GiGreekTemple />, title: "Museo" },
  { icon: <MdOutlineCoffee />, title: "Cafés" },
  { icon: <MdOutlineShoppingBag />, title: "Shopping" },
  { icon: <FaRegStar />, title: "Ocio" },
  { icon: <GiPartyPopper />, title: "Festival" },
  { icon: <BsRobot />, title: "Tecnología" },
  { icon: <LiaGamepadSolid />, title: "Juegos" },
  { icon: <VscOctoface />, title: "Anime" },
  { icon: <LuFerrisWheel />, title: "Parques temáticos" },
  { icon: <GiSamuraiHelmet />, title: "Samurai" },
  { icon: <MdOutlineTempleBuddhist />, title: "Templo Budista" },
  { icon: <PiBirdBold />, title: "Reserva de Aves" },
  { icon: <MdOutlineCastle />, title: "Castillos" },
  { icon: <PiCross />, title: "Templo Cristiano" },
  { icon: <TbTorii />, title: "Templo Sintoísta" },
  { icon: <MdOutlineTempleHindu />, title: "Templo Hindú" },
  { icon: <MdOutlineHotTub />, title: "Aguas Termales" },
  { icon: <GiGrapes />, title: "Viñedos" },
];

const AttractionTags = ({
  selectedAttractionTags,
  setSelectedAttractionTags,
}) => {
  const handleTagChange = (tagTitle) => {
    setSelectedAttractionTags((prevTags) =>
      prevTags.includes(tagTitle)
        ? prevTags.filter((tag) => tag !== tagTitle)
        : [...prevTags, tagTitle]
    );
  };

  return (
    <div className="mb-5 mt-2">
      <label className="d-label">
        <span className="d-label-text">Etiquetas de Atractivos</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attractionTags.map((tag) => (
          <label
            key={tag.title}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedAttractionTags.includes(tag.title)}
              onChange={() => handleTagChange(tag.title)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span className="flex items-center">
              {tag.icon}
              <span className="ml-2">{tag.title}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AttractionTags;
