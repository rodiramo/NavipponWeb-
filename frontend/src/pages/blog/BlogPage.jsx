import React, { useEffect } from "react";
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
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import useUser from "../../hooks/useUser"; // ✅ Import user hook

let isFirstRun = true;

const BlogPage = () => {
  const { user, jwt } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12),
    queryKey: ["posts"],
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
  }, [currentPage, searchKeyword, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  return (
    <MainLayout>
      <Hero />
      <section className="container mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Blog Posts Section */}
          <div className="flex-1">
            <div className="flex justify-center mb-10">
              <Search
                className="w-full max-w-xl"
                onSearchKeyword={handleSearch}
              />
            </div>

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
                    className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                  />
                ))
              )}
            </div>

            {!isLoading && (
              <Pagination
                onPageChange={(page) => handlePageChange(page)}
                currentPage={currentPage}
                totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
              />
            )}
          </div>

          {/* Suggested Users Sidebar (Only show if user exists) */}
          {user && (
            <div className="hidden lg:block w-[300px]">
              <UserList currentUser={user} token={jwt} />
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogPage;
