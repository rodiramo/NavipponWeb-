import React, { useState, useEffect } from "react";
import { images, stables } from "../../../../constants";
import {
  deleteExperience,
  getAllExperiences,
} from "../../../../services/index/experiences";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import {
  Trash2,
  Edit,
  Calendar,
  FolderOpen,
  MapPin,
  Star,
  Eye,
} from "lucide-react";
import useUser from "../../../../hooks/useUser";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Tooltip,
  CardMedia,
  Stack,
  Rating,
} from "@mui/material";

const ManageExperiences = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    currentPage,
    searchKeyword,
    data: experiencesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllExperiences(searchKeyword, currentPage),
    dataQueryKey: "experiences",
    deleteDataMessage: "Experiencia Borrada",
    mutateDeleteFn: ({ slug }) => {
      return deleteExperience({
        slug,
        token: jwt,
      });
    },
  });

  const [updatedExperiences, setUpdatedExperiences] = useState(
    experiencesData?.data || []
  );

  useEffect(() => {
    setUpdatedExperiences(experiencesData?.data || []);
  }, [experiencesData]);

  // Mobile Card Component
  const ExperienceCard = ({ experience }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Experience Image Header */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          position: "relative",
          backgroundImage: `url(${
            experience?.photo
              ? stables.UPLOAD_FOLDER_BASE_URL + experience?.photo
              : images.sampleExperienceImage
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
          }}
        >
          <Chip
            size="small"
            label="Experiencia"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardMedia>

      <CardContent>
        {/* Experience Title */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {experience.title}
        </Typography>

        {/* Experience Info Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Creado:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {(() => {
                // Check if experience.createdAt exists and is a valid date
                if (!experience.createdAt) {
                  return "Fecha no definida";
                }

                const date = new Date(experience.createdAt);

                // Check if the date is valid
                if (isNaN(date.getTime())) {
                  return "Fecha no válida";
                }

                // Return formatted date if valid
                return date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
              })()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FolderOpen
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Categoría:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {typeof experience.categories === "string"
                ? experience.categories
                : "Sin categorizar"}
            </Typography>
          </Grid>
        </Grid>

        {/* Description Preview */}
        {experience.caption && typeof experience.caption === "string" && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontStyle: "italic",
              }}
            >
              {experience.caption}
            </Typography>
          </Box>
        )}

        {/* Location if available */}
        {experience.location && typeof experience.location === "string" && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MapPin
              size={16}
              style={{ marginRight: 8, color: theme.palette.secondary.main }}
            />
            <Typography variant="body2" color="textSecondary">
              {experience.location}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Edit Button */}{" "}
          <Button
            startIcon={<Eye size={16} />}
            component={Link}
            to={`/experience/${experience?.slug}`}
            sx={{
              textTransform: "none",
              borderRadius: 30,
              color: theme.palette.secondary.medium,
              borderColor: theme.palette.secondary.medium,
              "&:hover": {
                backgroundColor: theme.palette.secondary.light,
                borderColor: theme.palette.secondary.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Ver Detalles
          </Button>
          <Button
            startIcon={<Edit size={16} />}
            component={Link}
            to={`/admin/experiences/manage/edit/${experience?.slug}`}
            sx={{
              textTransform: "none",
              borderRadius: 30,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Editar
          </Button>
          {/* Delete Button */}
          <Button
            disabled={isLoadingDeleteData}
            startIcon={<Trash2 size={16} />}
            onClick={() => deleteDataHandler({ slug: experience?.slug })}
            sx={{
              textTransform: "none",
              borderRadius: 30,
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.lightest,
                borderColor: theme.palette.error.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Borrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <DataTable
        pageTitle=""
        dataListName="Administrar Experiencias"
        searchInputPlaceHolder="Título Experiencia..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile ? [] : ["Experiencia", "Categoría", "Creado", "Acciones"]
        }
        isLoading={isLoading}
        isFetching={isFetching}
        data={updatedExperiences}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={experiencesData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {updatedExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout
          updatedExperiences.map((experience) => (
            <tr
              key={experience._id}
              style={{
                backgroundColor: theme.palette.background.default,
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              {/* Experience Image and Title */}
              <td
                style={{
                  padding: "16px 24px",
                  minWidth: "350px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      experience?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + experience?.photo
                        : images.sampleExperienceImage
                    }
                    alt={experience.title}
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 60,
                      mr: 2,
                      border: `2px solid ${theme.palette.primary.main}`,
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {experience.title}
                    </Typography>
                    {experience.caption &&
                      typeof experience.caption === "string" && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontStyle: "italic",
                          }}
                        >
                          {experience.caption}
                        </Typography>
                      )}
                  </Box>
                </Box>
              </td>

              {/* Category */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FolderOpen
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                  {experience.categories &&
                  typeof experience.categories === "string" ? (
                    <Chip
                      size="small"
                      label={experience.categories}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.secondary.medium,
                        color: theme.palette.secondary.medium,
                        fontSize: "0.75rem",
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin categorizar
                    </Typography>
                  )}
                </Box>
              </td>

              {/* Created Date */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                  <Typography variant="body2" color="textPrimary">
                    {(() => {
                      try {
                        if (!experience.createdAt) return "Fecha no disponible";

                        const date = new Date(experience.createdAt);

                        if (isNaN(date.getTime())) return "Fecha no válida";

                        return date.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                      } catch {
                        return "Fecha no disponible";
                      }
                    })()}
                  </Typography>
                </Box>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<Edit size={16} />}
                    component={Link}
                    to={`/admin/experiences/manage/edit/${experience?.slug}`}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      borderRadius: 30,
                      borderColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        borderColor: theme.palette.primary.dark,
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Editar
                  </Button>

                  <Button
                    disabled={isLoadingDeleteData}
                    startIcon={<Trash2 size={16} />}
                    onClick={() =>
                      deleteDataHandler({ slug: experience?.slug })
                    }
                    sx={{
                      color: theme.palette.error.main,
                      textTransform: "none",
                      borderRadius: 30,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: theme.palette.error.lightest,
                        borderColor: theme.palette.error.dark,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Borrar
                  </Button>
                </Stack>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </Box>
  );
};

export default ManageExperiences;
