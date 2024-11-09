import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllExperiences } from "../../services/index/experiences";
import ExperienceCardSkeleton from "../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ExperienceCard from "../../components/ExperienceCard";
import MainLayout from "../../components/MainLayout";
import Hero from './container/Hero';
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";

let isFirstRun = true;

const ExperiencePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllExperiences(searchKeyword, currentPage, 12),
    queryKey: ["experiences"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  console.log(data);

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
      <Hero/>
      <section className="flex flex-col container mx-auto px-5 py-10">
        <div className="flex justify-center mb-10 ">  
          <Search
            className="w-full max-w-xl"
            onSearchKeyword={handleSearch}
          />
        </div>
        <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10 ">
          {isLoading || isFetching ? (
            [...Array(3)].map((item, index) => (
              <ExperienceCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : isError ? (
            <ErrorMessage message="No se pudieron obtener los datos de las experiencias." />
          ) : data?.data.length === 0 ? (
            <p className="text-orange-500">Experiencia no encontrada!</p>
          ) : (
            data?.data.map((experience) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
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
      </section>
    </MainLayout>
  );
};

export default ExperiencePage;