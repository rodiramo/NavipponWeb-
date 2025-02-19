import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getSingleUserPost,
  updateUserPost,
  createUserPost,
} from "../services/index/userPosts";
import { v4 as uuidv4 } from "uuid";
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
import { Button, TextField, Box, Typography, Chip } from "@mui/material";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .slice(0, 40); // Limit base slug length

  const uniqueId = uuidv4().slice(0, 8); // Generate a short unique identifier

  return `${baseSlug}-${uniqueId}`; // Combine base slug with unique ID
};

const PostForm = ({ slug = null, open, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // ✅ Selected categories

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [postSlug, setPostSlug] = useState(slug || "");
  const [caption, setCaption] = useState("");
  const theme = useTheme();
  // Fetch post data if editing
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleUserPost({ slug, token: jwt }),
    queryKey: ["userPost", slug],
    enabled: !!slug, // Run only if editing
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

  // ✅ Fetch Categories
  useQuery({
    queryFn: getAllCategories,
    queryKey: ["categories"],
    onSuccess: (data) => {
      console.log("✅ Categories Fetched:", data?.data); // Debugging Log
      setCategories(data?.data || []); // 🔥 Fix: Ensure it extracts categories
    },
    onError: (error) => {
      console.error("❌ Error fetching categories:", error);
      setCategories([]);
    },
  });
  // Mutation for Updating Post
  const { mutate: mutateUpdatePost, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: ({ updatedData, slug, token }) =>
      updateUserPost({ updatedData, slug, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userPost", slug]);
      toast.success("Post actualizado");
      onClose(); // Close Modal
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  // Mutation for Creating Post
  const { mutate: mutateCreatePost, isLoading: isLoadingCreate } = useMutation({
    mutationFn: ({ postData, token }) => createUserPost({ postData, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post creado con éxito");
      onClose(); // Close Modal
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

  // Auto-generate slug from title
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

    // ✅ Append only if a photo exists
    if (photo) {
      formData.append("postPicture", photo);
    }

    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("slug", postSlug);
    formData.append("body", JSON.stringify(body)); // ✅ Convert to JSON string
    formData.append("tags", JSON.stringify(tags)); // ✅ Convert to JSON string

    formData.append("categories", JSON.stringify(selectedCategories)); // ✅ Convert to JSON string

    console.log("📤 Final Data Sent to Backend:");
    for (let [key, value] of formData.entries()) {
      console.log(`✅ FormData Key: ${key}, Value:`, value);
    }

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
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 1,
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", color: theme.palette.secondary.medium }}
      >
        {slug ? "Editar Publicación" : "Sube una Nueva Publicación"}
      </Typography>

      {/* Upload Image */}
      <label htmlFor="postPicture">
        {photo ? (
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={URL.createObjectURL(photo)}
              alt={title}
              className="rounded-full h-[100px]"
              style={{ cursor: "pointer" }}
            />
            <Typography
              sx={{ color: theme.palette.primary.main, cursor: "pointer" }}
            >
              Cambiar Imagen
            </Typography>
          </Box>
        ) : initialPhoto ? (
          <img
            src={`https://res.cloudinary.com/mycloud/image/upload/${initialPhoto}`}
            alt={title}
            className="rounded-xl h-[100px]"
          />
        ) : (
          <div
            className="w-full min-h-[100px] flex justify-center items-center"
            style={{
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "20rem",
            }}
          >
            <Typography>Subir Imagen</Typography>
          </div>
        )}
      </label>
      <input
        type="file"
        id="postPicture"
        onChange={handleFileChange}
        className="sr-only"
      />

      {/* Title */}
      <TextField
        label="Título"
        variant="filled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{
          bgcolor: "white",
          borderRadius: "1rem",
          "& .MuiInputBase-root": {
            borderRadius: "1rem",
            border: `2px solid ${theme.palette.secondary.light}`,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: "white",
            "&:before, &:after": {
              display: "none", // Removes the default underline
            },
          },
        }}
      />

      {/* Caption */}
      <TextField
        label="Resumen"
        variant="filled"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        multiline
        rows={2}
        fullWidth
        required
        sx={{
          bgcolor: "white",
          borderRadius: "1rem",
          "& .MuiInputBase-root": {
            borderRadius: "1.5rem",
            border: `2px solid ${theme.palette.secondary.light}`,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: "white",
            "&:before, &:after": {
              display: "none", // Removes the default underline
            },
          },
        }}
      />

      {/* Description */}
      <Typography variant="subtitle1">Descripción</Typography>
      <TextField
        placeholder="Escribe la descripción aquí..."
        variant="filled"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        multiline
        rows={4}
        fullWidth
        required
        sx={{
          bgcolor: "white",
          borderRadius: "2rem",
          "& .MuiInputBase-root": {
            borderRadius: "2rem",
            border: `2px solid ${theme.palette.secondary.light}`,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: "white",
            "&:before, &:after": {
              display: "none", // Removes the default underline
            },
          },
        }}
      />
      {/* Categories as Toggle Chips */}
      <Typography variant="subtitle1">Categorías</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category._id}
            label={category.title}
            clickable
            color={
              selectedCategories.includes(category._id) ? "primary" : "default"
            }
            onClick={() => handleCategoryToggle(category._id)}
          />
        ))}
      </Box>
      {/* Tags */}
      <Typography variant="subtitle1">Etiquetas Personalizables</Typography>
      <CreatableSelect
        defaultValue={tags.map((tag) => ({ value: tag, label: tag }))}
        isMulti
        onChange={(newValue) => setTags(newValue.map((item) => item.value))}
        className="relative z-20"
        placeholder="Añadir etiquetas..." // 🔹 Placeholder in Spanish
        noOptionsMessage={() => "No hay opciones disponibles"} // 🔹 No options message in Spanish
        formatCreateLabel={(inputValue) => `Crear etiqueta: "${inputValue}"`} // 🔹 Spanish label for new tags
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "white", // 🔹 White background
            borderRadius: "1.5rem", // 🔹 Fully rounded input
            border: `2px solid ${theme.palette.secondary.light}`, // 🔹 Secondary light border
            padding: "5px",
            boxShadow: state.isFocused
              ? `0 0 0 3px ${theme.palette.secondary.light}40`
              : "none", // 🔹 Focus effect
            "&:hover": {
              borderColor: theme.palette.secondary.light,
            },
          }),
          multiValue: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: theme.palette.secondary.light, // 🔹 Light background for tags
            borderRadius: "1.5rem", // 🔹 Rounded tags
            padding: "2px 10px",
            color: theme.palette.primary.dark,
          }),
          multiValueLabel: (baseStyles) => ({
            ...baseStyles,
            color: theme.palette.primary.dark, // 🔹 Dark text inside tags
            fontWeight: "bold",
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "1rem",
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              color: "white",
            },
          }),
        }}
      />

      <Box display="flex" gap={2} justifyContent="flex-end">
        {" "}
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "30rem",
            color: theme.palette.primary.main,
            boxShadow: "none",
            width: "150px",

            backgroundColor: theme.palette.primary.white,
          }}
        >
          Cancelar
        </Button>
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: "30rem",
            width: "150px",
          }}
        >
          {slug ? "Actualizar" : "Publicar"}
        </Button>
      </Box>
    </Box>
  );
};

export default PostForm;
