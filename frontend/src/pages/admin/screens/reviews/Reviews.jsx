import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteReview,
  getAllReviews,
  updateReview,
} from "../../../../services/index/reviews";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

const Reviews = () => {
  const { jwt } = useUser();

  const {
    currentPage,
    searchKeyword,
    data: reviewsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllReviews(jwt, searchKeyword, currentPage),
    dataQueryKey: "reviews",
    deleteDataMessage: "Reseña eliminada",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteReview({ reviewId: slug, token });
    },
  });

  const { mutate: mutateUpdateReviewCheck } = useMutation({
    mutationFn: ({ token, check, reviewId }) => {
      return updateReview({ token, check, reviewId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success(data?.check ? "Reseña aprobada" : "Reseña desaprobada");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <DataTable
      pageTitle="Administrar Reseñas"
      dataListName="Reseñas"
      searchInputPlaceHolder="Buscar reseñas..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={[
        "Autor",
        "Reseña",
        "Creado",
        "Aprobado",
        "Acciones",
      ]}
      isFetching={isFetching}
      isLoading={isLoading}
      data={reviewsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={reviewsData?.headers}
    >
      {reviewsData?.data.map((review) => (
        <tr
          key={review._id}
          className="bg-white hover:shadow-md transition-shadow rounded-lg"
        >
          {/* Author */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="block">
                  <img
                    src={
                      review?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + review?.user?.avatar
                        : images.userImage
                    }
                    alt={review?.user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </a>
              </div>
              <div className="ml-4">
                <p className="text-gray-900 whitespace-nowrap">
                  {review?.user?.name}
                </p>
              </div>
            </div>
          </td>
          {/* Review (Experience Title) */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <p className="text-gray-900 whitespace-nowrap">
              <Link
                to={`/experience/${review?.experience?.slug}`}
                className="text-blue-500"
              >
                {review?.experience?.title}
              </Link>
            </p>
          </td>
          {/* Created Date */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <p className="text-gray-900 whitespace-nowrap">
              {new Date(review.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </td>
          {/* Approval Toggle */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              onClick={() =>
                mutateUpdateReviewCheck({
                  token: jwt,
                  check: review?.check ? false : true,
                  reviewId: review._id,
                })
              }
              className="focus:outline-none"
            >
              <span
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  review?.check ? "bg-green-200" : "bg-red-200"
                }`}
              >
                {review?.check ? (
                  <BsCheckLg className="text-green-700 text-xl" />
                ) : (
                  <AiOutlineClose className="text-red-700 text-xl" />
                )}
              </span>
            </button>
          </td>
          {/* Actions (Delete) */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              onClick={() =>
                deleteDataHandler({ slug: review?._id, token: jwt })
              }
              className="flex items-center space-x-2 text-red-600 hover:text-red-900 transition-colors focus:outline-none"
            >
              <RiDeleteBin6Line className="text-xl" />
              <span className="text-sm">Borrar</span>
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Reviews;
