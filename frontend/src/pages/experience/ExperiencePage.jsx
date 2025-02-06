import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllExperiences } from "../../services/index/experiences";
import ExperienceCardSkeleton from "../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import HorizontalExperienceCard from "./container/HorizontalExperienceCard";
import MainLayout from "../../components/MainLayout";
import Hero from './container/Hero';
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import useUser from "../../hooks/useUser";
import Aside from './container/Aside';

let isFirstRun = true;

const ExperiencePage = ({ filters: initialFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, jwt } = useUser();
  const categoryFilter = searchParams.get("category");
  const regionFilter = searchParams.get("region");

  const [filters, setFilters] = useState(
    categoryFilter || regionFilter ? { category: categoryFilter, region: regionFilter } : initialFilters || {}
  );

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllExperiences(searchKeyword, currentPage, 12, filters),
    queryKey: ["experiences", searchKeyword, currentPage, filters],
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
  }, [currentPage, searchKeyword, filters, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  const handleFavoriteToggle = () => {
    refetch();
  };

  const handleFilterChange = (newFilters) => {
    console.log("Received filters:", newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      ...newFilters,
    });
    refetch();
  };

  const totalPageCount = parseInt(data?.headers?.["x-totalpagecount"], 10);

  return (
    <MainLayout>
      <Hero />
      <section className="flex flex-col container mx-auto px-5 py-10">
        <div className="flex justify-center mb-10">
          <Search
            className="w-full max-w-xl"
            onSearchKeyword={handleSearch}
          />
        </div>
        <div className="flex flex-row gap-5">
          <div className="w-full md:w-1/4">
            <Aside onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex flex-col gap-y-5 pb-10">
              {isLoading || isFetching ? (
                [...Array(3)].map((item, index) => (
                  <ExperienceCardSkeleton
                    key={index}
                    className="w-full"
                  />
                ))
              ) : isError ? (
                <ErrorMessage message="No se pudieron obtener los datos de las experiencias." />
              ) : data?.data.length === 0 ? (
                <p className="text-orange-500">Experiencia no encontrada!</p>
              ) : (
                data?.data.map((experience) => (
                  <HorizontalExperienceCard
                    key={experience._id}
                    experience={experience}
                    user={user}
                    token={jwt}
                    className="w-full"
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))
              )}
            </div>
            {!isLoading && (
              <Pagination
                onPageChange={(page) => handlePageChange(page)}
                currentPage={currentPage}
                totalPageCount={isNaN(totalPageCount) ? 0 : totalPageCount}
              />
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ExperiencePage;