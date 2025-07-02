import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllExperiences } from "../../services/index/experiences";
import HorizontalExperienceCardSkeleton from "./container/HorizontalExperienceCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import HorizontalExperienceCard from "./container/HorizontalExperienceCard";
import ExperienceCard from "../../components/ExperienceCard";
import MainLayout from "../../components/MainLayout";
import Header from "./container/Hero";
import Pagination from "../../components/Pagination";
import {
  Typography,
  Button,
  useTheme,
  Box,
  Grid,
  Modal,
  IconButton,
  Fab,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import MapAside from "../../components/MapAside";
import useUser from "../../hooks/useUser";
import Aside from "./container/Aside";
import {
  ArrowDownNarrowWide,
  Grid3X3,
  List,
  Filter,
  Map,
  X,
} from "lucide-react";
import { Menu, MenuItem } from "@mui/material";

let isFirstRun = true;

const ExperiencePage = ({ filters: initialFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const { user, jwt } = useUser();
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("list");

  // Modal states
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
    refetchMap();
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

  // Separate query for map data - gets all experiences without pagination
  const { data: mapData, refetch: refetchMap } = useQuery({
    queryFn: () =>
      getAllExperiences(searchKeyword, 1, 1000, { ...filters, sortBy }), // Higher limit for map
    queryKey: ["mapExperiences", searchKeyword, filters, sortBy], // No currentPage dependency
    onError: (error) => {
      console.log("Map data error:", error);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
    refetchMap();
  }, [currentPage, searchKeyword, filters, refetch, refetchMap]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  const handleFavoriteToggle = () => {
    refetch();
    refetchMap();
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
    refetchMap();
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
      refetchMap();
      return;
    }

    setSelectedFilter(newTab);
    let updatedFilters = { ...filters, ...newFilters };

    setFilters(updatedFilters);
    setSearchParams(updatedFilters);
    refetch();
    refetchMap();
  };

  useEffect(() => {
    const updatedFilters = { ...filters };

    if (selectedFilter === "resultados") {
      updatedFilters.search = searchKeyword;
    } else if (selectedFilter !== "todo") {
      updatedFilters.category = selectedFilter;
    } else {
      delete updatedFilters.category;
    }

    if (searchKeyword && !updatedFilters.search) {
      updatedFilters.search = searchKeyword;
    }

    if (currentPage > 1) {
      updatedFilters.page = currentPage;
    }

    console.log("Setting search params to:", updatedFilters);
    setSearchParams(updatedFilters);
    refetch();
    refetchMap();
  }, [
    selectedFilter,
    filters,
    searchKeyword,
    currentPage,
    refetch,
    refetchMap,
  ]);

  const totalPageCount = parseInt(data?.headers?.["x-totalpagecount"], 10);
  const selectedSortOption = sortingOptions.find(
    (option) => option.value === sortBy
  );

  // Modal styles
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 24,
    overflow: "hidden",
    outline: "none",
  };

  const mapModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    height: "80vh",
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 24,
    overflow: "hidden",
    outline: "none",
  };

  return (
    <MainLayout>
      {/* Header with integrated search */}
      <Header onSearchKeyword={handleSearch} />

      <section className="mx-auto w-full px-4 sm:px-6 lg:px-2 py-8 m-3">
        {/* Mobile Action Buttons */}
        <div className=" flex gap-3 mb-4">
          <Button
            variant="contained"
            onClick={() => setIsFiltersModalOpen(true)}
            startIcon={<Filter size={20} />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: "50px",
              padding: "12px 24px",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "auto",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Filtros
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsMapModalOpen(true)}
            startIcon={<Map size={20} />}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              borderRadius: "50px",
              padding: "12px 24px",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "auto",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Mapa
          </Button>
        </div>

        {/* Filters Modal */}
        <Modal
          open={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          aria-labelledby="filters-modal-title"
        >
          <Box sx={modalStyle}>
            <div className="flex items-center justify-between p-4 border-b">
              <Typography id="filters-modal-title" variant="h6" component="h2">
                Filtros
              </Typography>
              <IconButton
                onClick={() => setIsFiltersModalOpen(false)}
                sx={{ color: theme.palette.text.secondary }}
              >
                <X size={24} />
              </IconButton>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <Aside
                onFilterChange={(newFilters, newTab, isClear) => {
                  handleFilterChange(newFilters, newTab, isClear);
                  if (isClear) {
                    setIsFiltersModalOpen(false);
                  }
                }}
                selectedFilter={selectedFilter}
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Button
                fullWidth
                variant="contained"
                onClick={() => setIsFiltersModalOpen(false)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Aplicar Filtros
              </Button>
            </div>
          </Box>
        </Modal>

        {/* Map Modal */}
        <Modal
          open={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          aria-labelledby="map-modal-title"
        >
          <Box sx={mapModalStyle}>
            <div className="flex items-center justify-between p-4 border-b">
              <Typography id="map-modal-title" variant="h6" component="h2">
                Mapa de Experiencias
              </Typography>
              <IconButton
                onClick={() => setIsMapModalOpen(false)}
                sx={{ color: theme.palette.text.secondary }}
              >
                <X size={24} />
              </IconButton>
            </div>
            <div className="h-full">
              <MapAside experiences={mapData?.data || []} />
            </div>
          </Box>
        </Modal>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="xl:col-span-1 order-2 xl:order-1 hidden xl:block">
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

              {/* Filter Tabs, Sort and View Toggle Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Category Filter Tabs */}
                <div className="flex overflow-x-auto pb-2">
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
                        whiteSpace: "nowrap",
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

                {/* Sort Dropdown and View Toggle */}
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" className="hidden sm:block">
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
                      PaperProps={{
                        sx: {
                          borderRadius: "12px",
                          mt: 1,
                          minWidth: "180px",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      {sortingOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          onClick={() => handleSortSelection(option.value)}
                          sx={{
                            fontSize: "0.875rem",
                            padding: "12px 20px",
                            "&:hover": {
                              backgroundColor: `${theme.palette.primary.main}10`,
                            },
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === "grid" ? "contained" : "outlined"}
                      onClick={() => setViewMode("grid")}
                      sx={{
                        minWidth: "40px",
                        borderRadius: "30px",
                        border: `1px solid ${theme.palette.primary.main}`,
                        ...(viewMode === "grid"
                          ? {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                              },
                            }
                          : {
                              color: theme.palette.primary.main,
                              backgroundColor: "transparent",
                              "&:hover": {
                                backgroundColor: `${theme.palette.primary.main}08`,
                              },
                            }),
                      }}
                    >
                      <Grid3X3 size={24} />
                    </Button>

                    <Button
                      variant={viewMode === "list" ? "contained" : "outlined"}
                      onClick={() => setViewMode("list")}
                      sx={{
                        minWidth: "40px",
                        borderRadius: "30px",
                        border: `1px solid ${theme.palette.primary.main}`,
                        ...(viewMode === "list"
                          ? {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                              },
                            }
                          : {
                              color: theme.palette.primary.main,
                              backgroundColor: "transparent",
                              "&:hover": {
                                backgroundColor: `${theme.palette.primary.main}08`,
                              },
                            }),
                      }}
                    >
                      <List size={24} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Cards */}
            <div className={viewMode === "grid" ? "" : "space-y-2"}>
              {isLoading || isFetching ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2"
                      : "space-y-6"
                  }
                >
                  {[...Array(viewMode === "grid" ? 6 : 3)].map((_, index) => (
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
                <>
                  {/* Grid View */}
                  {viewMode === "grid" ? (
                    <Grid container spacing={3}>
                      {data?.data.map((experience) => (
                        <Grid
                          item
                          xs={12} // 1 column on mobile (0px+)
                          sm={6} // 2 columns on small screens (600px+)
                          md={6} // 2 columns on medium screens (900px+)
                          lg={6} // 2 columns on large screens (1200px+)
                          xl={4}
                          key={experience._id}
                        >
                          <ExperienceCard
                            experience={experience}
                            user={user}
                            token={jwt}
                            onFavoriteToggle={handleFavoriteToggle}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    /* List View */
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
                </>
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

          {/* Map Sidebar - Desktop Only */}
          <aside className="xl:col-span-1 order-3 hidden xl:block">
            <div className="sticky top-20">
              <div className="rounded-xl overflow-hidden shadow-lg border">
                <MapAside experiences={mapData?.data || []} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
};

export default ExperiencePage;
