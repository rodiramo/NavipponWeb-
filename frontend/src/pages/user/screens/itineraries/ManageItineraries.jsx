import React, { useContext } from 'react';
import { images, stables } from "../../../../constants";
import { deleteItinerary, getUserItineraries } from "../../../../services/index/itinerary";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";

const ManageItineraries = () => {
  const { user, jwt } = useUser();
  const { favorites, setFavorites, addFavorite, removeFavorite } = useContext(FavoriteContext);
  console.log("User token:", jwt);  

  const {
    currentPage,
    searchKeyword,
    data: itinerariesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getUserItineraries({ searchKeyword, page: currentPage, limit: 10, token: jwt }),
    dataQueryKey: "userItineraries",
    deleteDataMessage: "Itinerario Borrado",
    mutateDeleteFn: ({ slug, token }) => {
      console.log("mutateDeleteFn slug:", slug);  
      if (!slug) {
        console.error("Slug is undefined, cannot delete itinerary.");
        return;
      }
      return deleteItinerary({
        slug,
        token,
      });
    },
  });

  console.log("Itineraries data:", itinerariesData);  

  return (
    <DataTable
      pageTitle="Administrar tus Itinerarios"
      dataListName="Itinerarios"
      searchInputPlaceHolder="Título Itinerario..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Título", "Fecha de Inicio", "Fecha de Fin", "Presupuesto Total", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={itinerariesData}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={itinerariesData?.headers}
    >
      {itinerariesData?.length > 0 ? (
        itinerariesData.map((itinerary) => (
          <tr key={itinerary._id}>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">{itinerary.title}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {new Date(itinerary.startDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {new Date(itinerary.endDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {itinerary.totalBudget.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
                disabled={isLoadingDeleteData}
                type="button"
                className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => {
                  const slug = itinerary.slug || itinerary._id;  
                  console.log("Deleting itinerary with slug:", slug);  
                  deleteDataHandler({
                    slug,  
                    token: jwt,
                  });
                }}
              >
                Borrar
              </button>
              <Link
                to={`/user/itineraries/manage/edit/${itinerary._id}`}
                className="text-green-600 hover:text-green-900"
              >
                Editar
              </Link>
              <Link
                to={`/user/itineraries/manage/view/${itinerary._id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                Vista
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-5 py-5 text-sm bg-white border-b border-gray-200 text-center">
            No se encontraron itinerarios
          </td>
        </tr>
      )}
    </DataTable>
  );
};

export default ManageItineraries;