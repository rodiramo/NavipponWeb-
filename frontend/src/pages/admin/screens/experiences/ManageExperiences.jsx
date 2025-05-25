import { images, stables } from "../../../../constants";
import {
  deleteExperience,
  getAllExperiences,
} from "../../../../services/index/experiences";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import { Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import useUser from "../../../../hooks/useUser";

const ManageExperiences = () => {
  const { user, jwt } = useUser();

  const {
    currentPage,
    searchKeyword,
    data: experiencesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllExperiences(searchKeyword, currentPage),
    dataQueryKey: "experiences",
    deleteDataMessage: "Experiencia Borrada",
    mutateDeleteFn: ({ slug }) => {
      return deleteExperience({
        slug,
        token: jwt,
      });
    },
  });

  const [updatedExperiences, setUpdatedExperiences] = useState(
    experiencesData?.data || []
  );

  useEffect(() => {
    setUpdatedExperiences(experiencesData?.data || []);
  }, [experiencesData]);

  return (
    <DataTable
      pageTitle=""
      dataListName="Administrar Experiencias"
      searchInputPlaceHolder="Título Experiencia..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Título", "Categoría", "Creado", "Acciones"]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={updatedExperiences}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={experiencesData?.headers}
    >
      {updatedExperiences.map((experience) => (
        <tr key={experience._id}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="relative block">
                  <img
                    src={
                      experience?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + experience?.photo
                        : images.sampleExperienceImage
                    }
                    alt={experience.title}
                    className="mx-auto object-cover rounded-lg w-30 h-20"
                  />
                </a>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                  {experience.title}
                </p>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {experience.categories || "Sin categorizar"}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(experience.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>

          <td className="px-2 py-2 text-sm bg-white border-b border-gray-200 space-x-5 ">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {" "}
              <button
                disabled={isLoadingDeleteData}
                type="button"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                }}
                className="text-red-600 border border-red-600 hover:text-red-900 hover:border-red-900  disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => {
                  deleteDataHandler({
                    slug: experience?.slug,
                  });
                }}
              >
                <Trash2 size={16} />
                Borrar
              </button>
              <Link
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                }}
                to={`/admin/experiences/manage/edit/${experience?.slug}`}
                className="text-green-600 border border-green-600  hover:text-green-900 hover:border-green-900 "
              >
                {" "}
                <Pencil size={16} />
                Editar
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default ManageExperiences;
