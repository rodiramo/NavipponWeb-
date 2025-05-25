import { images, stables } from "../../../../constants";
import {
  deletePost,
  getAllPosts,
  updatePost,
} from "../../../../services/index/posts";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri"; // Trash icon
import { useState, useEffect } from "react";
import useUser from "../../../../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
const ManagePosts = () => {
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();

  const toggleApproval = async (post) => {
    try {
      // Toggle the approved value
      const updatedPost = { ...post, approved: !post.approved };
      // Update the post via the API (ensure updatePost accepts an object with updatedData, slug, and token)
      await updatePost({
        updatedData: updatedPost,
        slug: updatedPost.slug,
        token: jwt,
      });
      // Invalidate queries to trigger a refresh
      queryClient.invalidateQueries(["posts"]);
    } catch (error) {
      console.error("Error toggling approval:", error);
    }
  };

  const {
    currentPage,
    searchKeyword,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(searchKeyword, currentPage),
    dataQueryKey: "posts",
    deleteDataMessage: "Post borrado",
    mutateDeleteFn: ({ slug }) => deletePost({ slug, token: jwt }),
  });

  const [updatedPosts, setUpdatedPosts] = useState(postsData?.data || []);

  useEffect(() => {
    setUpdatedPosts(postsData?.data || []);
  }, [postsData]);

  return (
    <div className="container mx-auto p-4">
      <DataTable
        pageTitle=""
        dataListName="Administrar Posts"
        searchInputPlaceHolder="Título Post..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={[
          "Título",
          "Categoría",
          "Creado",
          "Etiquetas",
          "Aprobado",
          "Acciones",
        ]}
        isLoading={isLoading}
        isFetching={isFetching}
        data={updatedPosts}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={postsData?.headers}
      >
        {updatedPosts.map((post) => (
          <tr
            key={post._id}
            className="bg-white hover:shadow-md transition-shadow rounded-lg"
          >
            {/* Post Thumbnail and Title */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="block">
                    <img
                      src={
                        post?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo
                          : images.samplePostImage
                      }
                      alt={post.title}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </a>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </div>
              </div>
            </td>
            {/* Categories */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div className="text-sm text-gray-900">
                {post.categories.length > 0
                  ? post.categories.slice(0, 3).map((cat, index) => (
                      <span key={index} className="mr-1">
                        {cat.title}
                        {index !== post.categories.slice(0, 3).length - 1 &&
                          ","}
                      </span>
                    ))
                  : "Sin categorizar"}
              </div>
            </td>
            {/* Created Date */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </td>
            {/* Tags */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <div className="text-sm text-gray-900 flex flex-wrap gap-1">
                {post.tags.length > 0
                  ? post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))
                  : "Sin etiquetas"}
              </div>
            </td>
            {/* Approval Toggle */}
            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              <button
                onClick={() => toggleApproval(post)}
                className="focus:outline-none"
                disabled={isLoadingDeleteData}
              >
                <span
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${
                    post.approved ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {post.approved ? (
                    <BsCheckLg className="text-green-700 text-xl" />
                  ) : (
                    <AiOutlineClose className="text-red-700 text-xl" />
                  )}
                </span>
              </button>
            </td>
            {/* Delete Button */}
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
                onClick={() => {
                  deleteDataHandler({
                    slug: post?.slug,
                  });
                }}
              >
                <Trash2 size={16} />
                Borrar
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};

export default ManagePosts;
