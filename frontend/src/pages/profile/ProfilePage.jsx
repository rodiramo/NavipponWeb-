import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import MainLayout from "../../components/MainLayout";
import { getUserProfile, updateProfile } from "../../services/index/users";
import ProfilePicture from "../../components/ProfilePicture";
import { userActions } from "../../store/reducers/userReducers";
import { toast } from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { Button, Collapse, Box, Typography } from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, jwt } = useUser();
  const [isEditing, setIsEditing] = useState(false); // Toggle form

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder al perfil");
    }
  }, [jwt, navigate]);

  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt,
  });
  const handleCreateItinerary = () => {
    if (!jwt) {
      return toast.error("Debes estar logueado para crear un itinerario");
    }
    navigate("/user/itineraries/manage/create");
  };

  const { mutate, isLoading: updateProfileIsLoading } = useMutation({
    mutationFn: ({ name, email, password }) =>
      updateProfile({
        token: jwt,
        userData: { name, email, password },
        userId: user._id,
      }),
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      toast.success("Perfil actualizado");
      setIsEditing(false); // Hide form after updating
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    values: useMemo(
      () => ({
        name: profileIsLoading ? "" : profileData?.name || "",
        email: profileIsLoading ? "" : profileData?.email || "",
      }),
      [profileData?.email, profileData?.name, profileIsLoading]
    ),
    mode: "onChange",
  });

  const submitHandler = (data) => {
    mutate(data);
  };

  return (
    <MainLayout>
      <section
        id="body"
        className="container mx-auto px-5 "
        style={{ paddingTop: "10rem" }}
      >
        <div className="w-full max-w-sm mx-auto text-center">
          <ProfilePicture avatar={profileData?.avatar} />

          {/* Show user name and email if not editing */}
          {!isEditing && (
            <Box>
              <div className="my-6">
                <h2 className="text-xl font-bold">
                  {profileData?.name || "Usuario"}
                </h2>
                <p className="text-gray-600">{profileData?.email}</p>
              </div>
              {/* ✅ Create Itinerary Button */}
              <Button
                variant="contained"
                color="secondary"
                className="mt-4 px-6 py-3 rounded-lg w-full"
                onClick={handleCreateItinerary}
                style={{ marginTop: "1rem" }}
              >
                Crear Nuevo Itinerario
              </Button>
            </Box>
          )}

          {/* Edit Button */}
          {!isEditing && (
            <Button
              variant="contained"
              className="bg-primary text-white font-bold px-6 py-3 rounded-lg mt-4"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </Button>
          )}

          {/* Form with animation */}
          <Collapse in={isEditing}>
            <form onSubmit={handleSubmit(submitHandler)} className="mt-6">
              <div className="flex flex-col mb-6 w-full">
                <label htmlFor="name" className="text-gray-600 font-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 1,
                      message: "Debe tener al menos 1 caracter",
                    },
                  })}
                  className={`mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col mb-6 w-full">
                <label htmlFor="email" className="text-gray-600 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Ingresa un email válido",
                    },
                  })}
                  className={`mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col mb-6 w-full">
                <label
                  htmlFor="password"
                  className="text-gray-600 font-semibold"
                >
                  Nueva Contraseña (opcional)
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border border-gray-300"
                  placeholder="Ingresar nueva contraseña"
                />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-between">
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-primary text-white font-bold px-6 py-3 rounded-lg w-full mr-2"
                  disabled={
                    !isValid || profileIsLoading || updateProfileIsLoading
                  }
                >
                  Actualizar
                </Button>

                <Button
                  variant="outlined"
                  className="border border-primary text-primary font-bold px-6 py-3 rounded-lg w-full ml-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Collapse>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;
