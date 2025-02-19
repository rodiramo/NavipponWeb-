import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllPosts } from "../../services/index/posts";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleCard from "../../components/ArticleCard";
import MainLayout from "../../components/MainLayout";
import Hero from "./container/Hero";
import Pagination from "../../components/Pagination";
import UserList from "./container/UserList";
import PostForm from "../../components/PostForm";
import { ArrowDownWideNarrow } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import useUser from "../../hooks/useUser";
import {
  Button,
  Modal,
  Box,
  Typography,
  MenuItem,
  useTheme,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

let isFirstRun = true;

const BlogPage = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false); // ✅ Modal State
  const { user, jwt } = useUser();
  const [sortBy, setSortBy] = useState("newest"); // ✅ Sorting State

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12, sortBy),
    queryKey: ["posts", sortBy],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, searchKeyword, sortBy, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword, sortBy });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword, sortBy });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setSearchParams({
      page: 1,
      search: searchKeyword,
      sortBy: event.target.value,
    });
  };

  return (
    <MainLayout>
      <Hero />
      <section className="container mx-auto px-5 py-10 relative">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Blog Posts Section */}
          <div className="flex-1">
            <div>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* ✅ Floating "Create Post" Button */}
                {user && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                    sx={{
                      borderRadius: "3rem",
                      padding: "1rem 2rem",
                      minWidth: "auto",
                      textTransform: "none",
                      marginBottom: "2rem",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    Subir una Publicación
                  </Button>
                )}
                {/* ✅ Sorting Dropdown */}
                <div className="items-center mb-6">
                  <Typography variant="h6">Ordenar por:</Typography>
                  <FormControl size="small">
                    <Select
                      labelId="sort-label"
                      value={sortBy}
                      onChange={handleSortChange}
                      sx={{
                        minWidth: "200px",
                        borderRadius: "3rem",
                        border: `1px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <MenuItem value="newest">Más recientes</MenuItem>
                      <MenuItem value="oldest">Más antiguos</MenuItem>
                      <MenuItem value="most-popular">Más populares</MenuItem>
                      <MenuItem value="least-popular">Menos populares</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Box>
              <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
                {isLoading || isFetching ? (
                  [...Array(3)].map((_, index) => (
                    <ArticleCardSkeleton
                      key={index}
                      className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                    />
                  ))
                ) : isError ? (
                  <ErrorMessage message="No se pudieron obtener los datos de las publicaciones." />
                ) : data?.data.length === 0 ? (
                  <p className="text-orange-500">Post no encontrado!</p>
                ) : (
                  data?.data.map((post) => (
                    <ArticleCard
                      key={post._id}
                      post={post}
                      currentUser={user}
                      token={jwt}
                      className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                    />
                  ))
                )}
              </div>
            </div>

            {!isLoading && (
              <Pagination
                onPageChange={(page) => handlePageChange(page)}
                currentPage={currentPage}
                totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
              />
            )}
          </div>
          {/* Suggested Users Sidebar */}
          {user && (
            <div className="hidden lg:block w-[300px]">
              <UserList currentUser={user} token={jwt} />
            </div>
          )}
        </div>

        {/* ✅ Floating "Create Post" Button */}
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              minWidth: "auto",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <AddCircleOutline sx={{ fontSize: 30, color: "white" }} />
          </Button>
        )}

        {/* ✅ Create Post Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            }}
          >
            <Box
              sx={{
                width: "95%",
                maxWidth: "800px",
                maxHeight: "95vh",
                overflowY: "auto", // Enables scrolling if content is too large
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "10px",
              }}
            >
              <PostForm onClose={() => setOpen(false)} token={jwt} />
            </Box>
          </Box>
        </Modal>
      </section>
    </MainLayout>
  );
};

export default BlogPage;
