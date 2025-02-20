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
      <section className="flex flex-col container mx-auto">
        {/* ✅ Search Bar */}
        <div className="flex justify-center mb-10">
          <Search className="w-full max-w-xl" onSearchKeyword={handleSearch} />
        </div>

        <div className="flex flex-row gap-5">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4">
            <Aside
              onFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
            />
          </div>

          {/* Experiences List */}
          <div
            className="w-full md:w-3/4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {" "}
            <div>
              {/* ✅ Filter Buttons */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                {/* ✅ Search Results Tab */}
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
                      borderRadius: "30px 30px 30px 30px",
                      marginRight: "10px",
                    }}
                  >
                    Resultados
                  </Button>
                )}{" "}
                <Button
                  variant="contained"
                  onClick={() => handleFilterSelection("todo")}
                  sx={{
                    backgroundColor:
                      selectedFilter === "todo" ? primary.main : primary.light, // ✅ Main if active, Light if not
                    color:
                      selectedFilter === "todo"
                        ? primary.contrastText
                        : primary.main,
                    border: `1px solid ${primary.main}`,
                    borderRadius: "30px 0px 0px 30px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: primary.main, // ✅ Maintain primary color on hover
                      opacity: 0.9, // Slight opacity change for effect
                    },
                  }}
                  className="py-2 px-4"
                >
                  Todo el contenido
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleFilterSelection("Atractivos")}
                  sx={{
                    border: `1px solid ${primary.main}`,
                    backgroundColor:
                      selectedFilter === "Atractivos"
                        ? primary.main
                        : primary.light, // ✅ Main if active, Light if not
                    color:
                      selectedFilter === "Atractivos"
                        ? primary.contrastText
                        : primary.main,
                    borderRadius: 0,
                    textTransform: "none",
                  }}
                  className="py-2 px-4 hover:bg-opacity-90"
                >
                  Atractivos
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleFilterSelection("Hoteles")}
                  sx={{
                    backgroundColor:
                      selectedFilter === "Hoteles"
                        ? primary.main
                        : primary.light, // ✅ Main if active, Light if not
                    color:
                      selectedFilter === "Hoteles"
                        ? primary.contrastText
                        : primary.main,
                    textTransform: "none",
                    border: `1px solid ${primary.main}`,
                    borderRadius: 0,
                  }}
                  className="py-2 px-4 hover:bg-opacity-90"
                >
                  Hoteles
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleFilterSelection("Restaurantes")}
                  sx={{
                    border: `1px solid ${primary.main}`,
                    borderRadius: "0px 30px 30px 0px",
                    backgroundColor:
                      selectedFilter === "Restaurantes"
                        ? primary.main
                        : primary.light, // ✅ Main if active, Light if not
                    color:
                      selectedFilter === "Restaurantes"
                        ? primary.contrastText
                        : primary.main,
                    textTransform: "none",
                  }}
                  className="py-2 px-4 hover:bg-opacity-90"
                >
                  Restaurantes
                </Button>
              </Box>
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
            </div>
            <div className="flex flex-col gap-y-5 pb-10">
              {isLoading || isFetching ? (
                [...Array(3)].map((item, index) => (
                  <ExperienceCardSkeleton key={index} className="w-full" />
                ))
              ) : isError ? (
                <ErrorMessage message="No se pudieron obtener los datos de las experiencias." />
              ) : data?.data.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                  }}
                >
                  <img
                    src="/assets/no-results.png"
                    alt="No results"
                    style={{ maxWidth: "300px", marginBottom: "1rem" }}
                  />
                  <Typography
                    variant="h5"
                    color={theme.palette.primary.main}
                    style={{ fontWeight: "bold" }}
                    gutterBottom
                  >
                    No se encontraron resultados.
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      color: theme.palette.secondary.main,
                      marginBottom: "1rem",
                      textAlign: "center",
                    }}
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
            {/* Pagination */}
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
