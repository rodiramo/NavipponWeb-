import Pagination from "../../../components/Pagination";
import {
  useTheme,
  Box,
  Button,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  useMediaQuery,
  Paper,
  Container,
} from "@mui/material";
import { Search, Filter, Database, TrendingUp } from "lucide-react";

const DataTable = ({
  pageTitle,
  dataListName,
  searchKeywordOnSubmitHandler,
  searchInputPlaceHolder,
  searchKeywordOnChangeHandler,
  searchKeyword,
  tableHeaderTitleList,
  isLoading,
  isFetching,
  data,
  children,
  setCurrentPage,
  currentPage,
  headers,
}) => {
  const theme = useTheme();

  // Enhanced responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const isWideTablet = useMediaQuery(
    "(min-width: 900px) and (max-width: 1100px)"
  );

  let totalPageCount = 0;
  let totalCount = 0;

  if (headers && headers["x-totalpagecount"]) {
    try {
      totalPageCount = JSON.parse(headers["x-totalpagecount"]);
    } catch (error) {
      totalPageCount = parseInt(headers["x-totalpagecount"], 10);
    }
  }

  if (headers && headers["x-totalcount"]) {
    try {
      totalCount = JSON.parse(headers["x-totalcount"]);
    } catch (error) {
      totalCount = parseInt(headers["x-totalcount"], 10);
    }
  }

  const LoadingState = () => (
    <TableRow>
      <TableCell
        colSpan={tableHeaderTitleList.length || 5}
        sx={{
          textAlign: "center",
          py: { xs: 6, sm: 8, md: 10 },
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          <CircularProgress
            size={isMobile ? 32 : 40}
            thickness={4}
            color="primary"
          />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Cargando datos...
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  const EmptyState = () => (
    <TableRow>
      <TableCell
        colSpan={tableHeaderTitleList.length || 5}
        sx={{
          textAlign: "center",
          py: { xs: 6, sm: 8, md: 10 },
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 1.5, md: 2 },
            px: 2,
          }}
        >
          <Database
            size={isMobile ? 40 : 48}
            color={theme.palette.text.secondary}
            style={{ opacity: 0.5 }}
          />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="text.secondary"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            No se encontraron registros
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            {searchKeyword
              ? `No hay resultados para "${searchKeyword}"`
              : "No hay datos disponibles en este momento"}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "transparent",
        minHeight: { xs: "auto", md: "60vh" },
      }}
    >
      {/* Page Title - Only show if provided */}
      {pageTitle && (
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 0, sm: 2, md: 3 },
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2rem",
                lg: "2.125rem",
              },
              textAlign: { xs: "center", md: "left" },
              lineHeight: 1.2,
            }}
          >
            {pageTitle}
          </Typography>
        </Container>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: "12px", sm: "16px", md: "16px" },
          overflow: "hidden",
          backgroundColor: theme.palette.background.blue,
          border: `1px solid ${theme.palette.divider}`,
          width: "100%",
        }}
      >
        {/* Header Section */}
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            pb: { xs: 2, md: 2 },
            backgroundColor: "transparent",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {/* Title and Stats Row */}
            <Box
              sx={{
                textAlign: { xs: "center", sm: "left" },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 0.5, md: 1 },
                    color: theme.palette.text.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", sm: "flex-start" },
                    flexWrap: "wrap",
                    gap: { xs: 1, md: 1.5 },
                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUp
                      size={isMobile ? 20 : 24}
                      color={theme.palette.primary.main}
                    />
                    {dataListName}
                  </Box>
                  {totalCount > 0 && (
                    <Chip
                      label={`${totalCount.toLocaleString("es-ES")} total`}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        height: { xs: 24, md: 28 },
                      }}
                    />
                  )}
                </Typography>

                {/* Stats text - responsive layout */}
                {totalCount > 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      display: { xs: "block", sm: "block" },
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    Página {currentPage} de {totalPageCount} •{" "}
                    {data?.length || 0} de {totalCount} registros
                  </Typography>
                )}
              </Box>

              {/* Quick stats on larger screens */}
              {isDesktop && totalCount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: `${theme.palette.success.main}10`,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.success.main}20`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    >
                      {data?.length || 0} mostrados
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>

            {/* Search Section - Enhanced Responsive */}
            <Box
              component="form"
              onSubmit={searchKeywordOnSubmitHandler}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1.5, sm: 2 },
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <TextField
                id="search-experiences"
                variant="outlined"
                placeholder={searchInputPlaceHolder}
                onChange={searchKeywordOnChangeHandler}
                value={searchKeyword}
                size={isMobile ? "small" : "medium"}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        size={isMobile ? 18 : 20}
                        color={theme.palette.text.secondary}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  maxWidth: { sm: "400px", md: "500px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "25px", md: "30px" },
                    backgroundColor: theme.palette.background.default,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.palette.background.blue,
                      "& fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.blue,
                      "& fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "2px",
                      },
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    py: { xs: 1.5, md: 1.75 },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: theme.palette.text.secondary,
                    opacity: 0.7,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<Filter size={isMobile ? 14 : 16} />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: { xs: "25px", md: "30px" },
                  px: { xs: 2, sm: 2.5, md: 3 },
                  py: { xs: 1.5, md: 1.75 },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  minWidth: { xs: "auto", sm: "120px" },
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {isMobile ? "Buscar" : "Filtrar"}
              </Button>
            </Box>
          </Box>
        </CardContent>

        {/* Table Section - Enhanced Responsive */}
        <Box
          sx={{
            mx: { xs: 0, sm: 1, md: isWideTablet ? 1 : 2 },
            mb: { xs: 0, sm: 1, md: isWideTablet ? 1 : 2 },
            borderRadius: { xs: 0, sm: "8px", md: "12px" },
            overflow: "hidden",
          }}
        >
          {tableHeaderTitleList.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                backgroundColor: "transparent",
                borderRadius: { xs: 0, sm: "8px", md: "12px" },
                overflowX: "auto",
                maxWidth: "100%",
                "&::-webkit-scrollbar": {
                  height: { xs: 4, md: 6 },
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 3,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: theme.palette.grey[500],
                  },
                },
              }}
            >
              <Table
                sx={{
                  minWidth: {
                    xs: 300,
                    sm: 600,
                    md: isWideTablet ? 800 : 650,
                    lg: 900,
                  },
                  "& .MuiTableCell-root": {
                    padding: {
                      xs: "8px 12px",
                      sm: "12px 16px",
                      md: isWideTablet ? "12px 14px" : "16px 20px",
                    },
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.8rem",
                      md: isWideTablet ? "0.8rem" : "0.875rem",
                    },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                }}
              >
                {/* Table Header - Enhanced */}
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}08`,
                    }}
                  >
                    {tableHeaderTitleList.map((title, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                          color: theme.palette.text.primary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          borderBottom: `2px solid ${theme.palette.primary.main}30`,
                          backgroundColor: "transparent",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          // Responsive column hiding
                          display: {
                            xs:
                              index > (isMobile ? 1 : 2)
                                ? "none"
                                : "table-cell",
                            sm: index > 2 ? "none" : "table-cell",
                            md:
                              isWideTablet && index > 2 ? "none" : "table-cell",
                            lg: "table-cell",
                          },
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* Table Body - Enhanced */}
                <TableBody
                  sx={{
                    backgroundColor: "transparent",
                    "& .MuiTableRow-root": {
                      backgroundColor: "transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}04`,
                        transform: isDesktop ? "translateY(-1px)" : "none",
                        boxShadow: isDesktop
                          ? "0 2px 8px rgba(0,0,0,0.1)"
                          : "none",
                      },
                      "& .MuiTableCell-root": {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        backgroundColor: "transparent",
                        // Enhanced responsive behavior
                        whiteSpace: { xs: "nowrap", md: "normal" },
                        overflow: { xs: "hidden", md: "visible" },
                        textOverflow: { xs: "ellipsis", md: "clip" },
                        maxWidth: { xs: "120px", sm: "180px", md: "none" },
                        // Hide columns responsively to match headers
                        "&:nth-of-type(n+3)": {
                          display: {
                            xs: "none",
                            sm: "none",
                            md: isWideTablet ? "none" : "table-cell",
                            lg: "table-cell",
                          },
                        },
                        "&:nth-of-type(n+4)": {
                          display: {
                            xs: "none",
                            sm: "none",
                            md: isWideTablet ? "none" : "table-cell",
                            lg: "table-cell",
                          },
                        },
                      },
                    },
                  }}
                >
                  {isLoading || isFetching ? (
                    <LoadingState />
                  ) : data?.length === 0 ? (
                    <EmptyState />
                  ) : (
                    children
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // Card layout container for mobile when no headers
            <Box
              sx={{
                backgroundColor: "transparent",
                borderRadius: { xs: 0, sm: "8px", md: "12px" },
                p: { xs: 1, sm: 2 },
              }}
            >
              {isLoading || isFetching ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <CircularProgress size={40} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Cargando datos...
                  </Typography>
                </Box>
              ) : data?.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Database
                    size={48}
                    color={theme.palette.text.secondary}
                    style={{ opacity: 0.5 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 2, fontWeight: 600 }}
                  >
                    No se encontraron registros
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchKeyword
                      ? `No hay resultados para "${searchKeyword}"`
                      : "No hay datos disponibles"}
                  </Typography>
                </Box>
              ) : (
                children
              )}
            </Box>
          )}
        </Box>

        {/* Pagination Section - Enhanced Responsive */}
        {!isLoading && data?.length > 0 && totalPageCount > 1 && (
          <Box
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: `${theme.palette.background.default}50`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 2, md: 3 },
            }}
          >
            {/* Pagination info for mobile */}
            {isMobile && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  textAlign: "center",
                }}
              >
                Página {currentPage} de {totalPageCount}
              </Typography>
            )}

            <Pagination
              onPageChange={(page) => setCurrentPage(page)}
              currentPage={currentPage}
              totalPageCount={totalPageCount}
            />

            {/* Additional stats for desktop */}
            {isDesktop && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  textAlign: "center",
                  opacity: 0.8,
                }}
              >
                Mostrando {data?.length || 0} de {totalCount} registros totales
              </Typography>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default DataTable;
