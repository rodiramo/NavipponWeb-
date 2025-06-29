import Pagination from "../../../components/Pagination";
import {
  useTheme,
  Box,
  Button,
  TextField,
  Typography,
  Paper,
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
  let totalPageCount = 0;
  let totalCount = 0;

  if (headers && headers["x-totalpagecount"]) {
    try {
      totalPageCount = JSON.parse(headers["x-totalpagecount"]);
    } catch (error) {
      console.error("Error parsing total page count:", error);
    }
  }

  if (headers && headers["x-totalcount"]) {
    try {
      totalCount = JSON.parse(headers["x-totalcount"]);
    } catch (error) {
      console.error("Error parsing total count:", error);
    }
  }

  const LoadingState = () => (
    <TableRow>
      <TableCell
        colSpan={tableHeaderTitleList.length || 5}
        sx={{
          textAlign: "center",
          py: 8,
          border: "none",
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
          <CircularProgress size={40} thickness={4} />
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
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Page Title */}
      {pageTitle && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          {pageTitle}
        </Typography>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: theme.palette.background.default,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <CardContent sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              border: "none",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", lg: "center" },
              gap: 3,
              mb: 3,
            }}
          >
            {/* Title and Stats */}
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
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
                <Typography variant="body2" color="text.secondary">
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
                gap: 2,
                alignItems: "center",
                minWidth: { md: "400px" },
              }}
            >
              <TextField
                variant="outlined"
                placeholder={searchInputPlaceHolder}
                onChange={searchKeywordOnChangeHandler}
                value={searchKeyword}
                size="medium"
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
                }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Filter size={16} />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: "30px",
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
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
        <TableContainer
          sx={{
            backgroundColor: theme.palette.background.default,
            border: "none",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
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
                        fontSize: "0.875rem",
                        color: theme.palette.text.primary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        py: 2.5,
                        px: 3,
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
                "& .MuiTableRow-root": {
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}04`,
                  },
                  "& .MuiTableCell-root": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
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

        {/* Pagination Section */}
        {!isLoading && data?.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: `${theme.palette.background.default}50`,
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
