import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteComment,
  getAllComments,
  updateComment,
} from "../../../../services/index/comments";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";  

const Comments = () => {
  const { user, jwt } = useUser();

  const {
    currentPage,
    searchKeyword,
    data: commentsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllComments(jwt, searchKeyword, currentPage),
    dataQueryKey: "comments",
    deleteDataMessage: "Comentario eliminado",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteComment({
        commentId: slug,
        token,
      });
    },
  });

  const {
    mutate: mutateUpdateCommentCheck,
    // isLoading: isLoadingUpdateCommentCheck,
  } = useMutation({
    mutationFn: ({ token, check, commentId }) => {
      return updateComment({ token, check, commentId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
      toast.success(data?.check ? "Comentario aprobado" : "Comentario desaprobado");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <DataTable
      pageTitle="Administrar Comentarios"
      dataListName="Comentarios"
      searchInputPlaceHolder="Buscar comentarios..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={[
        "Autor",
        "Comentario",
        "En respuesta a",
        "Creado",
        "Aprobado",  
      ]}
      isFetching={isFetching}
      isLoading={isLoading}
      data={commentsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={commentsData?.headers}
    >
      {commentsData?.data.map((comment) => (
        <tr key={comment._id}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="relative block">
                  <img
                    src={
                      comment?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + comment?.user?.avatar
                        : images.userImage
                    }
                    alt={comment?.user?.name}
                    className="mx-auto object-cover rounded-lg w-10 aspect-square"
                  />
                </a>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                  {comment?.user?.name}
                </p>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            {comment?.replyOnUser !== null && (
              <p className="text-gray-900 whitespace-no-wrap">
                En respuesta a{" "}
                <Link
                  to={`/blog/${comment?.post?.slug}/#comment-${comment?._id}`}
                  className="text-blue-500"
                >
                  {comment?.replyOnUser?.name}
                </Link>
              </p>
            )}
            <p className="text-gray-900 whitespace-no-wrap">{comment?.desc}</p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link
                to={`/blog/${comment?.post?.slug}`}
                className="text-blue-500"
              >
                {comment?.post?.title}
              </Link>
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
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
              className="disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                mutateUpdateCommentCheck({
                  token: jwt,
                  check: comment?.check ? false : true,
                  commentId: comment._id,
                });
              }}
            >
              {comment?.check ? (
                <FaCheckCircle className="text-green-600" />
              ) : (
                <FaTimesCircle className="text-red-600" />
              )}
            </button>
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: comment?._id,
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

export default Comments;