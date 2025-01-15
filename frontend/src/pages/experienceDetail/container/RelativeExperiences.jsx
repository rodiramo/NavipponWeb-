import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRelatedExperiences } from "../../../services/index/experiences";

const RelativeExperiences = ({ className, header, category }) => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedExperiences = async () => {
      try {
        if (!category) {
          throw new Error("No category provided");
        }
        const data = await getRelatedExperiences(category);
        setExperiences(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedExperiences();
  }, [category]);

  console.log("Category used for API:", category);
  console.log("RelativeExperiences data:", experiences);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las experiencias relacionadas</div>;
  if (experiences.length === 0) return <div>No hay experiencias relacionadas disponibles</div>;

  return (
    <div className={`w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg p-4 ${className}`}>
      <h2 className="font-roboto font-medium text-dark-hard md:text-xl">
        {header}
      </h2>
      <ul className="mt-5">
        {experiences.map((item) => (
          <li key={item._id} className="mb-2">
            <Link to={`/experience/${item.slug}`} className="text-primary">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelativeExperiences;