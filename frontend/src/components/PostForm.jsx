import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getSingleUserPost,
  updateUserPost,
  createUserPost,
} from "../services/index/userPosts";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { stables } from "../constants";
import { toast } from "react-hot-toast";
import useUser from "../hooks/useUser";
import Editor from "../components/editor/Editor";
import MultiSelectTagDropdown from "../pages/user/components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../services/index/postCategories";
import {
  categoryToOption,
  filterCategories,
} from "../utils/multiSelectTagUtils";
import { Button, TextField, Box, Typography } from "@mui/material";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const PostForm = ({ slug = null, open, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [postSlug, setPostSlug] = useState(slug || "");
  const [caption, setCaption] = useState("");

  // Fetch post data if editing
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleUserPost({ slug, token: jwt }),
    queryKey: ["userPost", slug],
    enabled: !!slug, // Run only if editing
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
      setBody(data.body);
      setCaption(data.caption);
    },
    refetchOnWindowFocus: false,
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
    formData.append("categories", JSON.stringify(categories)); // ✅ Convert to JSON string

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        maxWidth: "600px",
      }}
    >
      <Typography variant="h6">
        {slug ? "Editar Publicación" : "Crear Nueva Publicación"}
      </Typography>

      {/* Upload Image */}
      <label htmlFor="postPicture">
        {photo ? (
          <img
            src={URL.createObjectURL(photo)}
            alt={title}
            className="rounded-xl w-full"
          />
        ) : initialPhoto ? (
          <img
            src={`https://res.cloudinary.com/mycloud/image/upload/${initialPhoto}`}
            alt={title}
            className="rounded-xl w-full"
          />
        ) : (
          <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />

      {/* Caption */}
      <TextField
        label="Extracto"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        multiline
        rows={2}
        fullWidth
        required
      />

      {/* Slug */}
      <TextField
        label="Slug"
        value={postSlug}
        onChange={(e) =>
          setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
        }
        fullWidth
        required
      />

      {/* Description */}
      <Typography variant="subtitle1">Descripción</Typography>
      <TextField
        placeholder="Escribe la descripción aquí..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        multiline
        rows={4}
        fullWidth
        required
      />

      {/* Categories (Selectable Tags instead of Dropdown) */}
      <Typography variant="subtitle1">Categorías</Typography>
      <MultiSelectTagDropdown
        loadOptions={promiseOptions}
        defaultValue={categories.map(categoryToOption)}
        onChange={(newValue) =>
          setCategories(newValue.map((item) => item.value))
        }
      />

      {/* Tags */}
      <Typography variant="subtitle1">Etiquetas</Typography>
      <CreatableSelect
        defaultValue={tags.map((tag) => ({ value: tag, label: tag }))}
        isMulti
        onChange={(newValue) => setTags(newValue.map((item) => item.value))}
        className="relative z-20"
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        fullWidth
      >
        {slug ? "Actualizar" : "Publicar"}
      </Button>
    </Box>
  );
};

export default PostForm;
