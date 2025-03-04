import Pagination from "../../../components/Pagination";
import { useTheme, Box, Button, TextField } from "@mui/material";

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
  let totalPageCount = 0;
  const theme = useTheme();

  if (headers && headers["x-totalpagecount"]) {
    try {
      totalPageCount = JSON.parse(headers["x-totalpagecount"]);
    } catch (error) {
      console.error("Error parsing total page count:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>

      <div className="w-full px-4 mx-auto">
        <div className="py-8">
          <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
            <h2 className="text-2xl leading-tight">{dataListName}</h2>
            <div className="text-end">
              <Box
                component="form"
                onSubmit={searchKeywordOnSubmitHandler}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TextField
                  id="form-subscribe-Filter"
                  variant="outlined"
                  placeholder={searchInputPlaceHolder}
                  onChange={searchKeywordOnChangeHandler}
                  value={searchKeyword}
                  sx={{
                    flex: 1,
                    borderRadius: "50px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px",
                      borderColor: theme.palette.secondary.light,
                      "&:hover fieldset": {
                        borderColor: theme.palette.secondary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.secondary.dark,
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.main, // 🎨 Primary main color
                    color: "white",
                    borderRadius: "50px",
                    padding: "10px 20px",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark, // 🎨 Darker primary on hover
                    },
                  }}
                >
                  Filtrar
                </Button>
              </Box>
            </div>
          </div>
          <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    {tableHeaderTitleList.map((title, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        Cargando...
                      </td>
                    </tr>
                  ) : data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 w-full">
                        No se encontraron registros
                      </td>
                    </tr>
                  ) : (
                    children
                  )}
                </tbody>
              </table>
              {!isLoading && (
                <Pagination
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  totalPageCount={totalPageCount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
