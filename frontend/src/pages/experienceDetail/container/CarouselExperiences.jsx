import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { images, stables } from "../../../constants";

const CarouselExperiences = ({ className, header, experiences }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [randomExperiences, setRandomExperiences] = useState([]);

  useEffect(() => {
    // Seleccionar aleatoriamente 15 experiencias
    const shuffled = experiences.sort(() => 0.5 - Math.random());
    setRandomExperiences(shuffled.slice(0, 15));
  }, [experiences]);

  const experiencesPerPage = 3;
  const totalPages = Math.ceil(randomExperiences.length / experiencesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * experiencesPerPage;
  const selectedExperiences = randomExperiences.slice(startIndex, startIndex + experiencesPerPage);

  return (
    <div className={`w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg p-4 ${className}`}>
      <h2 className="font-roboto font-medium text-dark-hard md:text-xl">
        {header}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {selectedExperiences.map((item) => (
          <div key={item._id} className="flex flex-col items-center">
            <img
              className="aspect-square object-cover rounded-lg w-full"
              src={
                item?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + item?.photo
                  : images.sampleExperienceImage
              }
              alt={item.title}
            />
            <div className="text-center mt-2">
              <h3 className="text-sm font-roboto text-dark-hard font-medium md:text-base lg:text-lg">
                <Link to={`/experience/${item.slug}`}>{item.title}</Link>
              </h3>
              <span className="text-xs opacity-60">
                {item.prefecture}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevPage} className="text-primary">Anterior</button>
        <button onClick={handleNextPage} className="text-primary">Siguiente</button>
      </div>
    </div>
  );
};

export default CarouselExperiences;