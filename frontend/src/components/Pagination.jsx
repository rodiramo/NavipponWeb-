import React from "react";
import { usePagination, DOTS } from "../hooks/usePagination";
import { Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Pagination = ({
  onPageChange,
  currentPage,
  siblingCount = 1,
  totalPageCount,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Adjust sibling count based on screen size
  const responsiveSiblingCount = isMobile ? 0 : isTablet ? 1 : siblingCount;

  const paginationRange = usePagination({
    currentPage,
    siblingCount: responsiveSiblingCount,
    totalPageCount,
  });

  // Don't render if no pagination needed
  if (
    !totalPageCount ||
    totalPageCount <= 1 ||
    !paginationRange ||
    paginationRange.length < 2
  ) {
    return null;
  }

  const onNext = () => {
    if (currentPage < totalPageCount) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div
      className={
        isMobile
          ? "flex flex-col items-center px-2 py-3 w-full"
          : "flex flex-col items-center px-5 py-5 xs:flex-row xs:justify-between"
      }
    >
      {/* Mobile: Simplified layout */}
      {isMobile ? (
        <div className="flex items-center justify-between w-full max-w-sm gap-4">
          {/* Previous Button - Mobile */}
          <button
            disabled={currentPage === 1}
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm text-gray-600 rounded-full hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-90 transition-all"
            onClick={onPrevious}
            style={{ border: `1.5px solid white`, backgroundColor: "white" }}
          >
            <svg
              width="14"
              fill="currentColor"
              height="14"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
            </svg>
          </button>

          {/* Current Page Indicator */}
          <Button
            variant="contained"
            sx={{
              minWidth: "48px",
              height: "40px",
              borderRadius: "30rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderColor:
                theme.palette.secondary?.medium || theme.palette.primary.main,
              bgcolor:
                theme.palette.secondary?.medium || theme.palette.primary.main,
              color: theme.palette.primary?.white || "white",
              "&:hover": {
                bgcolor:
                  theme.palette.secondary?.main || theme.palette.primary.dark,
              },
            }}
          >
            {currentPage}
          </Button>

          {/* Page Info */}
          <div
            className="text-xs font-medium px-2"
            style={{ color: theme.palette.primary.black }}
          >
            de {totalPageCount}
          </div>

          {/* Next Button - Mobile */}
          <button
            disabled={currentPage === lastPage}
            type="button"
            className="flex items-center justify-center px-4 py-2 text-sm text-gray-600 border rounded-full hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
            onClick={onNext}
            style={{
              borderColor: theme.palette.grey[300],
              backgroundColor: "white",
            }}
          >
            <span className="mr-1 font-medium">Next</span>
            <svg
              width="14"
              fill="currentColor"
              height="14"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
            </svg>
          </button>
        </div>
      ) : (
        /* Desktop/Tablet: Original full pagination with responsive sizing */
        <div className="flex items-center">
          {/* Previous Button - Desktop/Tablet */}
          <button
            disabled={currentPage === 1}
            type="button"
            className={`
              text-base text-gray-600 border rounded-full hover:bg-gray-100 
              disabled:cursor-not-allowed disabled:opacity-90 transition-all
              ${isTablet ? "w-10 h-10 p-2 mr-2" : "w-full p-4 mr-3"}
            `}
            onClick={onPrevious}
            style={{
              borderColor: theme.palette.grey[300],
              backgroundColor: "white",
            }}
          >
            <svg
              width={isTablet ? "16" : "9"}
              fill="currentColor"
              height={isTablet ? "16" : "8"}
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
            </svg>
          </button>

          {/* Page Numbers - Desktop/Tablet */}
          <div className="flex items-center gap-1">
            {paginationRange.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return (
                  <button
                    key={`dots-${index}`}
                    className={`
                      cursor-default px-4 py-2 text-base
                      ${isTablet ? "px-2 text-sm" : "px-4"}
                    `}
                    disabled
                    style={{ color: theme.palette.grey[500] }}
                  >
                    &#8230;
                  </button>
                );
              }

              return (
                <Button
                  key={pageNumber}
                  type="button"
                  variant={
                    pageNumber === currentPage ? "contained" : "outlined"
                  }
                  onClick={() => handlePageClick(pageNumber)}
                  sx={{
                    width: "100%",
                    px: isTablet ? 1.5 : 2,
                    py: isTablet ? "4px" : "6px",
                    fontSize: isTablet ? "0.875rem" : "1rem",
                    borderRadius: "30rem",
                    mx: isTablet ? 0.25 : 0.5,
                    minWidth: isTablet ? "36px" : "auto",
                    height: isTablet ? "36px" : "auto",
                    borderColor:
                      pageNumber === currentPage
                        ? theme.palette.secondary?.medium ||
                          theme.palette.primary.main
                        : theme.palette.grey[300],
                    bgcolor:
                      pageNumber === currentPage
                        ? theme.palette.secondary?.medium ||
                          theme.palette.primary.main
                        : "white",
                    color:
                      pageNumber === currentPage
                        ? theme.palette.primary?.white || "white"
                        : theme.palette.grey[600],
                    "&:hover": {
                      bgcolor:
                        pageNumber === currentPage
                          ? theme.palette.secondary?.main ||
                            theme.palette.primary.dark
                          : theme.palette.grey[100],
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          {/* Next Button - Desktop/Tablet */}
          <button
            disabled={currentPage === lastPage}
            type="button"
            className={`
              text-base text-gray-600 border rounded-full hover:bg-gray-100 
              disabled:cursor-not-allowed disabled:opacity-60 transition-all
              ${isTablet ? "w-10 h-10 p-2 ml-2" : "w-full p-4 ml-3"}
            `}
            onClick={onNext}
            style={{
              borderColor: theme.palette.grey[300],
              backgroundColor: "white",
            }}
          >
            <svg
              width={isTablet ? "16" : "9"}
              fill="currentColor"
              height={isTablet ? "16" : "8"}
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
