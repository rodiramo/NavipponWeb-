import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteComment,
  getAllComments,
  updateComment,
} from "../../../../services/index/comments";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Trash2 } from "lucide-react";
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

  const { mutate: mutateUpdateCommentCheck } = useMutation({
    mutationFn: ({ token, check, commentId }) => {
      return updateComment({ token, check, commentId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
      toast.success(
        data?.check ? "Comentario aprobado" : "Comentario desaprobado"
      );
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <div className="container mx-auto p-4">
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
          "Acciones",
        ]}
        isFetching={isFetching}
        isLoading={isLoading}
        data={commentsData?.data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={commentsData?.headers}
      >
        {commentsData?.data.map((comment) => (
          <tr
            key={comment._id}
            className="bg-white hover:shadow-md transition-shadow rounded-lg"
          >
            {/* Author */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="block">
                    <img
                      src={
                        comment?.user?.avatar
                          ? stables.UPLOAD_FOLDER_BASE_URL +
                            comment?.user?.avatar
                          : images.userImage
                      }
                      alt={comment?.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </a>
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 whitespace-nowrap">
                    {comment?.user?.name}
                  </p>
                </div>
              </div>
            </td>
            {/* Comment and Reply */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div>
                {comment?.replyOnUser !== null && (
                  <p className="text-gray-900 whitespace-nowrap">
                    En respuesta a{" "}
                    <Link
                      to={`/blog/${comment?.post?.slug}/#comment-${comment?._id}`}
                      className="text-blue-500"
                    >
                      {comment?.replyOnUser?.name}
                    </Link>
                  </p>
                )}
                <p className="text-gray-900 whitespace-nowrap">
                  {comment?.desc}
                </p>
              </div>
            </td>
            {/* Post Title */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <p className="text-gray-900 whitespace-nowrap">
                <Link
                  to={`/blog/${comment?.post?.slug}`}
                  className="text-blue-500"
                >
                  {comment?.post?.title}
                </Link>
              </p>
            </td>
            {/* Created Date */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <p className="text-gray-900 whitespace-nowrap">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
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
                  mutateUpdateCommentCheck({
                    token: jwt,
                    check: comment?.check ? false : true,
                    commentId: comment._id,
                  })
                }
                className="focus:outline-none"
              >
                <span
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${
                    comment?.check ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {comment?.check ? (
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                }}
                className="text-red-600 border border-red-600 hover:text-red-900 hover:border-red-900  disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() =>
                  deleteDataHandler({ slug: comment?._id, token: jwt })
                }
              >
                <Trash2 size={16} />
                Borrar
              </button>{" "}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default Comments;
