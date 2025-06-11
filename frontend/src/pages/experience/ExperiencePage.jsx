import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllExperiences } from "../../services/index/experiences";
import HorizontalExperienceCardSkeleton from "./container/HorizontalExperienceCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import HorizontalExperienceCard from "./container/HorizontalExperienceCard";
import MainLayout from "../../components/MainLayout";
import Header from "./container/Hero";
import Pagination from "../../components/Pagination";
import { Typography, Button, useTheme, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
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
  const [sortBy, setSortBy] = useState("");

  const { primary, text } = theme.palette;
  const [selectedFilter, setSelectedFilter] = useState("todo");

  const categoryFilter = searchParams.get("category");
  const regionFilter = searchParams.get("region");

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

  const filterTabs = [
    { key: "todo", label: "Todo el contenido" },
    { key: "Atractivos", label: "Atractivos" },
    { key: "Hoteles", label: "Hoteles" },
    { key: "Restaurantes", label: "Restaurantes" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortSelection = (option) => {
    setSortBy(option);
    const updatedFilters = { ...filters, sortBy: option };
    setFilters(updatedFilters);
    setSearchParams(updatedFilters);
    setAnchorEl(null);
    refetch();
  };

  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () =>
      getAllExperiences(searchKeyword, currentPage, 12, { ...filters, sortBy }),
    queryKey: ["experiences", searchKeyword, currentPage, filters, sortBy],
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
      updatedFilters = {};
    } else if (selectedTab === "resultados") {
      updatedFilters = { ...filters };
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

  // Find this useEffect in your Experience page and replace it:

  useEffect(() => {
    const updatedFilters = { ...filters };

    if (selectedFilter === "resultados") {
      updatedFilters.search = searchKeyword;
    } else if (selectedFilter !== "todo") {
      updatedFilters.category = selectedFilter;
    } else {
      delete updatedFilters.category;
    }

    // Preserve existing search keyword if it exists
    if (searchKeyword && !updatedFilters.search) {
      updatedFilters.search = searchKeyword;
    }

    // Preserve page parameter
    if (currentPage > 1) {
      updatedFilters.page = currentPage;
    }

    console.log("Setting search params to:", updatedFilters);
    setSearchParams(updatedFilters);
    refetch();
  }, [selectedFilter, filters, searchKeyword, currentPage, refetch]); // Added searchKeyword and currentPage dependencies

  const totalPageCount = parseInt(data?.headers?.["x-totalpagecount"], 10);
  const selectedSortOption = sortingOptions.find(
    (option) => option.value === sortBy
  );

  return (
    <MainLayout>
      {/* Header with integrated search */}
      <Header onSearchKeyword={handleSearch} />

      <section className="mx-auto w-full px-4 sm:px-6 lg:px-2 py-8 m-3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
          {/* Sidebar Filters */}
          <aside className="xl:col-span-1 order-2 xl:order-1">
            <div className="">
              <Aside
                onFilterChange={handleFilterChange}
                selectedFilter={selectedFilter}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="xl:col-span-3 order-1 xl:order-2">
            <div className="mb-8">
              {searchKeyword && (
                <div className="mb-4 flex items-center gap-3">
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
                      textTransform: "none",
                      marginRight: "10px",
                    }}
                  >
                    Resultados: "{searchKeyword}"
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleSearch({ searchKeyword: "" })}
                    sx={{
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.text.secondary}`,
                      borderRadius: "30px",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: `${theme.palette.error.main}10`,
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    ✕ Limpiar búsqueda
                  </Button>
                </div>
              )}

              {/* Filter Tabs and Sort Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Category Filter Tabs */}
                <div className="flex">
                  {filterTabs.map((tab, index) => (
                    <Button
                      key={tab.key}
                      variant={
                        selectedFilter === tab.key ? "contained" : "outlined"
                      }
                      onClick={() => handleFilterSelection(tab.key)}
                      sx={{
                        backgroundColor:
                          selectedFilter === tab.key
                            ? primary.main
                            : primary.light,
                        color:
                          selectedFilter === tab.key
                            ? primary.contrastText
                            : primary.main,
                        border: `1px solid ${primary.main}`,
                        borderRadius:
                          index === 0
                            ? "30px 0px 0px 30px"
                            : index === filterTabs.length - 1
                            ? "0px 30px 30px 0px"
                            : 0,
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: "8px 16px",
                        minWidth: "auto",
                        "&:hover": {
                          backgroundColor:
                            selectedFilter === tab.key
                              ? primary.dark
                              : `${primary.main}10`,
                        },
                      }}
                    >
                      <span className="mr-2 hidden sm:inline">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">
                        {tab.label.split(" ")[0]}
                      </span>
                    </Button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <Typography
                    variant="body2"
                    className="text-gray-600 hidden sm:block"
                  >
                    Ordenar por:
                  </Typography>
                  <IconButton
                    onClick={handleSortClick}
                    sx={{
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: "30px",
                      padding: "8px",
                    }}
                  >
                    <ArrowDownNarrowWide
                      size={20}
                      color={theme.palette.primary.main}
                    />
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
                        sx={{
                          fontSize: "0.875rem",
                          padding: "12px 20px",
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>
            </div>

            {/* Experience Cards */}
            <div className="space-y-2">
              {isLoading || isFetching ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <HorizontalExperienceCardSkeleton
                      key={index}
                      className="w-full"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex justify-center py-12">
                  <ErrorMessage message="No se pudieron obtener los datos de las experiencias." />
                </div>
              ) : data?.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6">
                    <img
                      src="/assets/no-results.png"
                      alt="No results"
                      className="w-64 h-auto mx-auto opacity-80"
                    />
                  </div>
                  <Typography
                    variant="h4"
                    className="font-bold mb-4"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    No se encontraron resultados
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-gray-600 max-w-md"
                  >
                    {searchKeyword
                      ? `No hay experiencias que coincidan con "${searchKeyword}"`
                      : "Intenta ajustar los filtros o buscar otros términos."}
                  </Typography>
                </div>
              ) : (
                <div className="space-y-6">
                  {data?.data.map((experience) => (
                    <HorizontalExperienceCard
                      key={experience._id}
                      experience={experience}
                      user={user}
                      token={jwt}
                      className="w-full"
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPageCount > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <Pagination
                  onPageChange={(page) => handlePageChange(page)}
                  currentPage={currentPage}
                  totalPageCount={isNaN(totalPageCount) ? 0 : totalPageCount}
                />
              </div>
            )}
          </main>

          {/* Map Sidebar - Desktop */}
          <aside className="xl:col-span-1 order-3 hidden xl:block">
            <div className="sticky top-20">
              <div className="rounded-xl overflow-hidden shadow-lg border">
                <MapAside experiences={data?.data || []} />
              </div>
            </div>
          </aside>
        </div>

        {/* Map Section - Mobile */}
        <div className="xl:hidden mt-8">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <MapAside experiences={data?.data || []} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ExperiencePage;
