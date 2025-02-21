import { images, stables } from "../../../../constants";
import {
  deleteExperience,
  getAllExperiences,
} from "../../../../services/index/experiences";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
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
      pageTitle="Administrar Experiencias"
      dataListName="Experiencias"
      searchInputPlaceHolder="Título Experiencia..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={[
        "Título",
        "Categoría",
        "Creado",
        "Aprobado",
        "Acciones",
      ]}
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
                    className="mx-auto object-cover rounded-lg w-10 aspect-square"
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

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            {" "}
            <span
              className={`${
                experience.approved ? "bg-[#36B37E]" : "bg-[#FF4A5A]"
              } w-fit bg-opacity-20 rounded-full`}
            >
              {experience.approved ? (
                <BsCheckLg className=" text-[#36B37E]" />
              ) : (
                <AiOutlineClose className=" text-[#FF4A5A]" />
              )}
            </span>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: experience?.slug,
                });
              }}
            >
              Borrar
            </button>
            <Link
              to={`/admin/experiences/manage/edit/${experience?.slug}`}
              className="text-green-600 hover:text-green-900"
            >
              Editar
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default ManageExperiences;
