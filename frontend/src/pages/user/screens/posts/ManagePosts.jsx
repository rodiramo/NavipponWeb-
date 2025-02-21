import { images, stables } from "../../../../constants";
import {
  deleteUserPost,
  getUserPosts,
} from "../../../../services/index/userPosts";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useDataTable } from "../../../../hooks/useDataTable";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import useUser from "../../../../hooks/useUser";
import { useTheme, Box, Typography, Button } from "@mui/material";

const ManagePosts = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();

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
    dataQueryFn: () => getUserPosts(searchKeyword, currentPage, 10, jwt),
    dataQueryKey: ["userPosts", user?._id],
    deleteDataMessage: "Post borrado",
    mutateDeleteFn: ({ slug }) => {
      return deleteUserPost({
        slug,
        token: jwt,
      });
    },
  });

  const [updatedPosts, setUpdatedPosts] = useState(postsData?.data || []);

  useEffect(() => {
    setUpdatedPosts(postsData?.data || []);
  }, [postsData]);

  // 🚨 Hide table completely when no posts exist
  if (updatedPosts.length === 0 && !isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        {" "}
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
          }}
        >
          Administrar Publicaciones
        </Typography>
        {/* Empty State Image */}
        <img
          src="/assets/nothing-here.png" // Replace with correct image path
          alt="No hay publicaciones"
          className="w-40 h-40 object-contain mb-4"
        />
        {/* Message */}
        <Typography
          variant="h6"
          sx={{ color: theme.palette.secondary.medium, fontWeight: "bold" }}
        >
          Aún no has subido ninguna publicación
        </Typography>
        <Typography sx={{ color: theme.palette.secondary.dark, mb: 2 }}>
          ¡Comparte tus experiencias con otros usuarios!
        </Typography>
        {/* Create Post Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/user/posts/manage/create")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: "30rem",
            padding: "10px 20px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Crear Nueva Publicación
        </Button>
      </Box>
    );
  }

  // ✅ Only show table when there are posts
  return (
    <>
      {" "}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
        }}
      >
        Administrar Publicaciones
      </Typography>
      <DataTable
        dataListName="Administrar Publicaciones"
        searchInputPlaceHolder="Título del post..."
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
          <tr key={post._id}>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="relative block">
                    <img
                      src={
                        post?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo
                          : images.samplePostImage
                      }
                      alt={post.title}
                      className="mx-auto object-cover rounded-lg w-10 aspect-square"
                    />
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {post.title}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {post.categories.length > 0
                  ? post.categories
                      .slice(0, 3)
                      .map(
                        (category, index) =>
                          `${category.title}${
                            post.categories.slice(0, 3).length === index + 1
                              ? ""
                              : ", "
                          }`
                      )
                  : "Sin categorizar"}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex gap-x-2">
                {post.tags.length > 0
                  ? post.tags.map((tag, index) => (
                      <p key={index}>
                        {tag}
                        {post.tags.length - 1 !== index && ","}
                      </p>
                    ))
                  : "Sin etiquetas"}
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <span
                className={`${
                  post.approved ? "bg-[#36B37E]" : "bg-[#FF4A5A]"
                } w-fit bg-opacity-20 rounded-full`}
              >
                {post.approved ? (
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
                    slug: post?.slug,
                  });
                }}
              >
                Borrar
              </button>
              <Link
                to={`/user/posts/manage/edit/${post?.slug}`}
                className="text-green-600 hover:text-green-900"
              >
                Editar
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
};

export default ManagePosts;
