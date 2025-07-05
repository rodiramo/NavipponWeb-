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
} from "@mui/material";
import { Search, Filter, Database } from "lucide-react";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let totalPageCount = 0;
  let totalCount = 0;

  if (headers && headers["x-totalpagecount"]) {
    try {
      totalPageCount = JSON.parse(headers["x-totalpagecount"]);
    } catch (error) {
      // Try parsing as integer instead of JSON
      totalPageCount = parseInt(headers["x-totalpagecount"], 10);
    }
  } else {
    console.log("❌ No x-totalpagecount header found");
  }

  const LoadingState = () => (
    <TableRow>
      <TableCell
        colSpan={tableHeaderTitleList.length || 5}
        sx={{
          textAlign: "center",
          py: 8,
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={40} thickness={4} color="primary" />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
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
          py: 8,
          border: "none",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Database
            size={48}
            color={theme.palette.text.secondary}
            style={{ opacity: 0.5 }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            No se encontraron registros
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
        backgroundColor: theme.palette.background.default,
        padding: 0,
        minHeight: { xs: "auto", md: "100vh" },
      }}
    >
      {/* Page Title */}
      {pageTitle && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: { xs: 2, md: 3 },
            color: theme.palette.text.primary,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {pageTitle}
        </Typography>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: "12px", md: "16px" },
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
          // Full width on mobile
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Header Section */}
        <CardContent
          sx={{
            p: { xs: 0, sm: 0, md: 3 },
            pb: 0,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
              mb: { xs: 2, md: 3 },
            }}
          >
            {/* Title and Stats */}
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  flexWrap: "wrap",
                  gap: 1,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {dataListName}
                {totalCount > 0 && (
                  <Chip
                    label={`${totalCount.toLocaleString("es-ES")} total`}
                    size="small"
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Typography>
              {totalCount > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                >
                  Página {currentPage} de {totalPageCount} • Mostrando{" "}
                  {data?.length || 0} registros
                </Typography>
              )}
            </Box>

            {/* Search Section */}
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
                id="form-subscribe-Filter"
                variant="outlined"
                placeholder={searchInputPlaceHolder}
                onChange={searchKeywordOnChangeHandler}
                value={searchKeyword}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    backgroundColor: theme.palette.background.default,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                    fontSize: { xs: "0.875rem", md: "1rem" },
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
                startIcon={<Filter size={16} />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: "30px",
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.5 },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  boxShadow: "none",
                  minWidth: { xs: "auto", sm: "120px" },
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Filtrar
              </Button>
            </Box>
          </Box>
        </CardContent>

        {/* Table Section */}
        <Box
          sx={{
            mx: { xs: 1, sm: 1.5, md: 3 },
            mb: { xs: 2, md: 3 },
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <TableContainer
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "12px",
              // Enable horizontal scroll on mobile
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <Table
              sx={{
                minWidth: { xs: "100%", md: 650 },
                // Make table more compact on mobile
                "& .MuiTableCell-root": {
                  padding: { xs: "8px 12px", md: "16px" },
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                },
              }}
            >
              {/* Table Header */}
              {tableHeaderTitleList.length > 0 && (
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
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          color: theme.palette.text.primary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          borderBottom: `2px solid ${theme.palette.divider}`,
                          backgroundColor: "transparent",
                          // Hide some columns on mobile if needed
                          display: {
                            xs: index > 2 ? "none" : "table-cell",
                            sm: "table-cell",
                          },
                        }}
                      >
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              )}

              {/* Table Body */}
              <TableBody
                sx={{
                  backgroundColor: theme.palette.background.default,
                  "& .MuiTableRow-root": {
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}04`,
                    },
                    "& .MuiTableCell-root": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      backgroundColor: "transparent",
                      // Responsive cell behavior
                      whiteSpace: { xs: "nowrap", md: "normal" },
                      overflow: { xs: "hidden", md: "visible" },
                      textOverflow: { xs: "ellipsis", md: "clip" },
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
        </Box>

        {/* Pagination Section */}
        {!isLoading && data?.length > 0 && (
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              onPageChange={(page) => setCurrentPage(page)}
              currentPage={currentPage}
              totalPageCount={totalPageCount}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default DataTable;
