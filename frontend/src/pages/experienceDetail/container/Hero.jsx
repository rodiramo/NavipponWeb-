import React from "react";

import "../../../css/Items/ActivityDetail.css";
const Hero = ({ imageUrl, imageAlt }) => {
  return (
    <div className="relative">
      <img src={imageUrl} alt={imageAlt} className="cover-image" />
    </div>
  );
};

export default Hero;
