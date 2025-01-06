import { images, stables } from "../../../../constants";
import { deleteUserExperience, getUserExperiences } from "../../../../services/index/userExperiences"; 
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
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
    dataQueryFn: () => getUserExperiences(searchKeyword, currentPage, 10, jwt),
    dataQueryKey: "userExperiences",
    deleteDataMessage: "Experiencia Borrada",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteUserExperience({
        slug,
        token,
      });
    },
  });

  return (
    <DataTable
      pageTitle="Administrar tus Experiencias"
      dataListName="Experiencias"
      searchInputPlaceHolder="Título Experiencia..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Título", "Categoría", "Creado", "Etiquetas", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={experiencesData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={experiencesData?.headers}
    >
      {experiencesData?.data.map((experience) => (
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
                <p className="text-gray-900 whitespace-no-wrap">{experience.title}</p>
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
            <div className="flex gap-x-2">
              {experience.tags && experience.tags.length > 0
                ? experience.tags.map((tag, index) => (
                    <p key={index}>
                      {tag}
                      {experience.tags.length - 1 !== index && ","}
                    </p>
                  ))
                : "Sin etiquetas"}
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: experience?.slug,
                  token: jwt,
                });
              }}
            >
              Borrar
            </button>
            <Link
              to={`/user/experiences/manage/edit/${experience?.slug}`}
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