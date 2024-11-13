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

const Reviews = () => {
  const { user, jwt } = useUser();  

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
    dataQueryFn: () =>
      getAllReviews(jwt, searchKeyword, currentPage),
    dataQueryKey: "reviews",
    deleteDataMessage: "Reseña eliminada",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteReview({
        reviewId: slug,
        token,
      });
    },
  });

  const {
    mutate: mutateUpdateReviewCheck,
    // isLoading: isLoadingUpdateReviewCheck,
  } = useMutation({
    mutationFn: ({ token, check, reviewId }) => {
      return updateReview({ token, check, reviewId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success(
        data?.check ? "Reseña aprobada" : "Reseña desaprobada"
      );
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
        "En respuesta a",
        "Creado",
        "",
      ]}
      isFetching={isFetching}
      isLoading={isLoading}
      data={reviewsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={reviewsData?.headers}
    >
      {reviewsData?.data.map((review) => (
        <tr key={review._id}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="relative block">
                  <img
                    src={
                      review?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + review?.user?.avatar
                        : images.userImage
                    }
                    alt={review?.user?.name}
                    className="mx-auto object-cover rounded-lg w-10 aspect-square"
                  />
                </a>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                  {review?.user?.name}
                </p>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            {review?.replyOnUser !== null && (
              <p className="text-gray-900 whitespace-no-wrap">
                En respuesta a {" "}
                <Link
                  to={`/experience/${review?.experience?.slug}/#review-${review?._id}`}
                  className="text-blue-500"
                >
                  {review?.replyOnUser?.name}
                </Link>
              </p>
            )}
            <p className="text-gray-900 whitespace-no-wrap">{review?.desc}</p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link
                to={`/experience/${review?.experience?.slug}`}
                className="text-blue-500"
              >
                {review?.experience?.title}
              </Link>
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(review.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className={`${review?.check
                  ? "text-yellow-600 hover:text-yellow-900"
                  : "text-green-600 hover:text-green-900"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              onClick={() => {
                mutateUpdateReviewCheck({
                  token: jwt,
                  check: review?.check ? false : true,
                  reviewId: review._id,
                });
              }}
            >
              {review?.check ? "Desaprobado" : "Aprobado"}
            </button>
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: review?._id,
                  token: jwt,
                });
              }}
            >
              Borrar
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Reviews;