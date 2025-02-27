import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllExperiences } from "../../services/index/experiences";
import ExperienceCardSkeleton from "../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import HorizontalExperienceCard from "./container/HorizontalExperienceCard";
import MainLayout from "../../components/MainLayout";
import Hero from "./container/Hero";
import Pagination from "../../components/Pagination";
import { Typography, Button, useTheme, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import MapAside from "../../components/MapAside";

import useUser from "../../hooks/useUser";
import Aside from "./container/Aside";
import { ArrowDownNarrowWide } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";

let isFirstRun = true;

const ExperiencePage = ({ filters: initialFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const { user, jwt } = useUser();
  const [sortBy, setSortBy] = useState(""); // Sorting option

  const { primary, text } = theme.palette;
  // ✅ State to handle filter buttons
  const [selectedFilter, setSelectedFilter] = useState("todo");

  const categoryFilter = searchParams.get("category");
  const regionFilter = searchParams.get("region");

  // ✅ State for active filters
  const [filters, setFilters] = useState(
    categoryFilter || regionFilter
      ? { category: categoryFilter, region: regionFilter }
      : initialFilters || {}
  );

  const sortingOptions = [
    { value: "favorites", label: "Más Favoritos" },
    { value: "budgetHigh", label: "Más Caro" },
    { value: "budgetLow", label: "Más Barato" },
    { value: "ratings", label: "Más Valorados" },
  ];

  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortSelection = (option) => {
    setSortBy(option);
    setSearchParams({ ...filters, sortBy: option });
    setAnchorEl(null);
    refetch();
  };

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () =>
      getAllExperiences(searchKeyword, currentPage, 12, { ...filters, sortBy }),
    queryKey: ["experiences", searchKeyword, currentPage, filters, sortBy], // ✅ Include sortBy
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
  const handleFilterSelection = (selectedTab) => {
    setSelectedFilter(selectedTab);

    let updatedFilters = { ...filters };

    if (selectedTab === "todo") {
      updatedFilters = {}; // ✅ Reset all filters
    } else if (selectedTab === "resultados") {
      updatedFilters = { ...filters }; // ✅ Keep aside filters
    } else {
      updatedFilters = { category: selectedTab };
    }

    setFilters(updatedFilters);
    setSearchParams(updatedFilters);
    refetch();
  };
  const handleFilterChange = (
    newFilters,
    newTab = selectedFilter,
    isClear = false
  ) => {
    console.log("Received filters:", newFilters);

    // ✅ If clearing filters, reset to "/experience"
    if (isClear) {
      setSearchParams({});
      setSelectedFilter("todo");
      setFilters({});
      refetch();
      return;
    }

    setSelectedFilter(newTab);
    let updatedFilters = { ...filters, ...newFilters };

    setFilters(updatedFilters);
    setSearchParams(updatedFilters);
    refetch();
  };

  useEffect(() => {
    const updatedFilters = { ...filters };

    if (selectedFilter === "resultados") {
      // ✅ Keep search filters
      updatedFilters.search = searchKeyword;
    } else if (selectedFilter !== "todo") {
      updatedFilters.category = selectedFilter;
    } else {
      delete updatedFilters.category;
    }

    setSearchParams(updatedFilters);
    refetch();
  }, [selectedFilter, filters, refetch]);

  const totalPageCount = parseInt(data?.headers?.["x-totalpagecount"], 10);

  return (
    <MainLayout>
      <Hero />

      <section className="container mx-auto flex flex-col">
        {/* ✅ Search Bar */}
        <div className="flex justify-center mb-6">
          <Search className="w-full max-w-xl" onSearchKeyword={handleSearch} />
        </div>

        {/* ✅ Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* ✅ Filters (Take 1/5 width on large screens) */}
          <aside className="lg:col-span-1 w-full">
            <Aside
              onFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
            />
          </aside>

          {/* ✅ Experience List (Take 3/5 width on large screens) */}
          <main className="lg:col-span-3 flex flex-col">
            {/* 🔹 Filter Tabs */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                {searchKeyword && (
                  <Button
                    variant={
                      selectedFilter === "resultados" ? "contained" : "outlined"
                    }
                    onClick={() => handleFilterSelection("resultados")}
                    sx={{
                      backgroundColor:
                        selectedFilter === "resultados"
                          ? primary.main
                          : primary.light,
                      color:
                        selectedFilter === "resultados"
                          ? primary.contrastText
                          : primary.main,
                      border: `1px solid ${primary.main}`,
                      borderRadius: "30px",
                      marginRight: "10px",
                    }}
                  >
                    Resultados
                  </Button>
                )}

                <Button
                  variant={selectedFilter === "todo" ? "contained" : "outlined"}
                  onClick={() => handleFilterSelection("todo")}
                  sx={{
                    backgroundColor:
                      selectedFilter === "todo" ? primary.main : primary.light,
                    color:
                      selectedFilter === "todo"
                        ? primary.contrastText
                        : primary.main,
                    border: `1px solid ${primary.main}`,
                    borderRadius: "30px 0px 0px 30px",
                    textTransform: "none",
                  }}
                >
                  Todo el contenido
                </Button>

                <Button
                  variant={
                    selectedFilter === "Atractivos" ? "contained" : "outlined"
                  }
                  onClick={() => handleFilterSelection("Atractivos")}
                  sx={{
                    border: `1px solid ${primary.main}`,
                    backgroundColor:
                      selectedFilter === "Atractivos"
                        ? primary.main
                        : primary.light,
                    color:
                      selectedFilter === "Atractivos"
                        ? primary.contrastText
                        : primary.main,
                    borderRadius: 0,
                    textTransform: "none",
                  }}
                >
                  Atractivos
                </Button>

                <Button
                  variant={
                    selectedFilter === "Hoteles" ? "contained" : "outlined"
                  }
                  onClick={() => handleFilterSelection("Hoteles")}
                  sx={{
                    border: `1px solid ${primary.main}`,
                    backgroundColor:
                      selectedFilter === "Hoteles"
                        ? primary.main
                        : primary.light,
                    color:
                      selectedFilter === "Hoteles"
                        ? primary.contrastText
                        : primary.main,
                    borderRadius: 0,
                    textTransform: "none",
                  }}
                >
                  Hoteles
                </Button>

                <Button
                  variant={
                    selectedFilter === "Restaurantes" ? "contained" : "outlined"
                  }
                  onClick={() => handleFilterSelection("Restaurantes")}
                  sx={{
                    border: `1px solid ${primary.main}`,
                    backgroundColor:
                      selectedFilter === "Restaurantes"
                        ? primary.main
                        : primary.light,
                    color:
                      selectedFilter === "Restaurantes"
                        ? primary.contrastText
                        : primary.main,
                    borderRadius: "0px 30px 30px 0px",
                    textTransform: "none",
                  }}
                >
                  Restaurantes
                </Button>
              </Box>
              {/* 🔹 Sorting Options */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <IconButton
                  onClick={handleSortClick}
                  sx={{
                    borderRadius: "30px",
                    border: `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <ArrowDownNarrowWide size={24} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {sortingOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => handleSortSelection(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
            {/* 🔹 Experience Cards */}
            <div className="flex flex-col pb-10 gap-5">
              {isLoading || isFetching ? (
                [...Array(3)].map((_, index) => (
                  <ExperienceCardSkeleton key={index} className="w-full" />
                ))
              ) : isError ? (
                <ErrorMessage message="No se pudieron obtener los datos de las experiencias." />
              ) : data?.data.length === 0 ? (
                <div className="flex flex-col items-center min-h-[50vh]">
                  <img
                    src="/assets/no-results.png"
                    alt="No results"
                    className="w-72 mb-4"
                  />
                  <Typography
                    variant="h5"
                    color={theme.palette.primary.main}
                    className="font-bold"
                  >
                    No se encontraron resultados.
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-center text-secondary mb-4"
                  >
                    Intenta buscar nuevamente con otros parámetros.
                  </Typography>
                </div>
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

            {/* 🔹 Pagination */}
            {!isLoading && (
              <Pagination
                onPageChange={(page) => handlePageChange(page)}
                currentPage={currentPage}
                totalPageCount={isNaN(totalPageCount) ? 0 : totalPageCount}
              />
            )}
          </main>

          {/* ✅ Map (Take 1/5 width on large screens, full width below on mobile) */}
          <aside className="lg:col-span-1 w-full lg:block hidden">
            <MapAside experiences={data?.data || []} />
          </aside>
        </div>

        {/* 📌 Map goes full-width on mobile */}
        <aside className="lg:hidden block w-full mt-6">
          <MapAside experiences={data?.data || []} />
        </aside>
      </section>
    </MainLayout>
  );
};

export default ExperiencePage;
