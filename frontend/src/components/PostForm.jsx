import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getSingleUserPost,
  updateUserPost,
  createUserPost,
} from "../services/index/userPosts";
import { v4 as uuidv4 } from "uuid";
import Editor from "../components/editor/Editor";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { stables } from "../constants";
import { toast } from "react-hot-toast";
import useUser from "../hooks/useUser";
import MultiSelectTagDropdown from "../pages/user/components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../services/index/postCategories";
import {
  categoryToOption,
  filterCategories,
} from "../utils/multiSelectTagUtils";
import {
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  PhotoCamera,
  Edit,
  Close,
  Add,
  Category,
  Title,
  Description,
} from "@mui/icons-material";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);

  const uniqueId = uuidv4().slice(0, 8);
  return `${baseSlug}-${uniqueId}`;
};

const PostForm = ({ slug = null, open, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [postSlug, setPostSlug] = useState(slug || "");
  const [caption, setCaption] = useState("");
  const theme = useTheme();

  // Fetch post data if editing
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleUserPost({ slug, token: jwt }),
    queryKey: ["userPost", slug],
    enabled: !!slug,
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setSelectedCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
      setBody(data.body);
      setCaption(data.caption);
    },
    refetchOnWindowFocus: false,
  });

  // Fetch Categories
  useQuery({
    queryFn: getAllCategories,
    queryKey: ["categories"],
    onSuccess: (data) => {
      setCategories(data?.data || []);
    },
    onError: (error) => {
      console.error("❌ Error fetching categories:", error);
      setCategories([]);
    },
  });

  // Mutations
  const { mutate: mutateUpdatePost, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: ({ updatedData, slug, token }) =>
      updateUserPost({ updatedData, slug, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userPost", slug]);
      toast.success("Post actualizado");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const { mutate: mutateCreatePost, isLoading: isLoadingCreate } = useMutation({
    mutationFn: ({ postData, token }) => createUserPost({ postData, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post creado con éxito");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setInitialPhoto(null);
  };

  useEffect(() => {
    if (!slug) {
      setPostSlug(generateSlug(title));
    }
  }, [title, slug]);

  const handleSubmit = async () => {
    if (!title || !caption || !body) {
      return toast.error("Todos los campos son obligatorios");
    }

    const formData = new FormData();

    if (photo) {
      formData.append("postPicture", photo);
    }

    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("slug", postSlug);
    formData.append("body", JSON.stringify(body));
    formData.append("tags", JSON.stringify(tags));
    formData.append("categories", JSON.stringify(selectedCategories));

    if (slug) {
      mutateUpdatePost({ updatedData: formData, slug, token: jwt });
    } else {
      mutateCreatePost({ postData: formData, token: jwt });
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        p: 2,
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: theme.palette.text.primary,
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {slug ? "Editar Publicación" : "Nueva Publicación"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
          }}
        >
          {slug
            ? "Actualiza tu contenido"
            : "Comparte tu experiencia con la comunidad"}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Image Upload */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PhotoCamera color="primary" />
                Imagen
              </Typography>

              <Box sx={{ position: "relative" }}>
                <label htmlFor="postPicture" style={{ cursor: "pointer" }}>
                  {photo ? (
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Typography color="white" variant="body2">
                          Cambiar Imagen
                        </Typography>
                      </Box>
                    </Box>
                  ) : initialPhoto ? (
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`https://res.cloudinary.com/mycloud/image/upload/${initialPhoto}`}
                        alt={title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Typography color="white" variant="body2">
                          Cambiar Imagen
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "200px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px dashed ${theme.palette.primary.main}`,
                        borderRadius: 3,
                        backgroundColor: theme.palette.action.hover,
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.selected,
                          borderColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <CloudUpload
                        sx={{
                          fontSize: 48,
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="primary"
                        fontWeight="medium"
                      >
                        Subir Imagen
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        JPG, PNG hasta 5MB
                      </Typography>
                    </Box>
                  )}
                </label>

                {(photo || initialPhoto) && (
                  <IconButton
                    onClick={handleDeleteImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "&:hover": { backgroundColor: "white" },
                    }}
                    size="small"
                  >
                    <Close color="error" />
                  </IconButton>
                )}
              </Box>

              <input
                type="file"
                id="postPicture"
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Form Fields */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Title */}
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Title color="primary" />
                    Título*
                  </Typography>
                  <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    placeholder="Escribe el título de tu publicación..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Caption */}
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Description color="primary" />
                    Resumen*
                  </Typography>
                  <TextField
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    required
                    placeholder="Escribe un resumen atractivo..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Edit color="primary" />
                Contenido de la publicación*
              </Typography>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Editor
                  content={body}
                  editable={true}
                  onDataChange={(data) => setBody(data)}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Category color="primary" />
                Categorías
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecciona las categorías que mejor describan tu publicación
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category._id}
                    label={category.title}
                    clickable
                    variant={
                      selectedCategories.includes(category._id)
                        ? "filled"
                        : "outlined"
                    }
                    color={
                      selectedCategories.includes(category._id)
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleCategoryToggle(category._id)}
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: selectedCategories.includes(
                          category._id
                        )
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                      },
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Add color="primary" />
                Etiquetas Personalizables
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Añade etiquetas para mejorar la búsqueda de tu contenido
              </Typography>
              <CreatableSelect
                defaultValue={tags.map((tag) => ({ value: tag, label: tag }))}
                isMulti
                onChange={(newValue) =>
                  setTags(newValue.map((item) => item.value))
                }
                placeholder="Añadir etiquetas..."
                noOptionsMessage={() => "No hay opciones disponibles"}
                formatCreateLabel={(inputValue) =>
                  `Crear etiqueta: "${inputValue}"`
                }
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "8px",
                    border: `2px solid ${
                      state.isFocused
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    padding: "8px",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                  }),
                  menuPortal: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 9999,
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 9999,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    boxShadow: theme.shadows[8],
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isSelected
                      ? theme.palette.primary.main
                      : state.isFocused
                      ? theme.palette.action.hover
                      : "transparent",
                    color: state.isSelected
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: state.isSelected
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                    },
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: "16px",
                    padding: "2px 8px",
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: theme.palette.primary.dark,
                    fontWeight: "500",
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: theme.palette.error.main,
                      color: "white",
                    },
                  }),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoadingUpdate || isLoadingCreate}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "medium",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {isLoadingUpdate || isLoadingCreate
                ? "Procesando..."
                : slug
                ? "Actualizar Publicación"
                : "Publicar"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostForm;
