import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteUser,
  getAllUsers,
  updateProfile,
} from "../../../../services/index/users";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import useUser from "../../../../hooks/useUser";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

const Users = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  console.log("JWT Token:", jwt ? "Present" : "Missing");

  // Mutation for updating admin status
  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationFn: ({ isAdmin, userId }) => {
        console.log("Updating user admin status:", {
          isAdmin,
          userId: String(userId),
          token: jwt,
        });
        // Fix: Call with correct parameter order (userId, userData, token)
        return updateProfile(String(userId), { admin: isAdmin }, jwt);
      },
      onSuccess: (data) => {
        console.log("Admin update success:", data);
        queryClient.invalidateQueries(["users"]);
        toast.success("Usuario actualizado");
      },
      onError: (error) => {
        console.error("Admin update error:", error);
        toast.error(error.message || "Error al actualizar usuario");
      },
    });

  // Mutation for updating verified status
  const { mutate: mutateUpdateVerified, isLoading: isLoadingUpdateVerified } =
    useMutation({
      mutationFn: ({ isVerified, userId }) => {
        console.log("Updating user verified status:", {
          isVerified,
          userId: String(userId),
          token: jwt,
        });
        // Fix: Call with correct parameter order (userId, userData, token)
        return updateProfile(String(userId), { verified: isVerified }, jwt);
      },
      onSuccess: (data) => {
        console.log("Verified update success:", data);
        queryClient.invalidateQueries(["users"]);
        toast.success("Estado de verificación actualizado");
      },
      onError: (error) => {
        console.error("Verified update error:", error);
        toast.error(error.message || "Error al actualizar verificación");
      },
    });

  // Fixed admin toggle function
  const handleAdminToggle = (e, userItem) => {
    const selectedValue = e.target.value;
    const newAdminStatus = selectedValue === "admin";

    // Only proceed if the status is actually changing
    if (userItem.admin !== newAdminStatus) {
      if (
        window.confirm(
          `¿Quieres cambiar este usuario ${
            newAdminStatus ? "a administrador" : "a usuario regular"
          }?`
        )
      ) {
        mutateUpdateUser({ isAdmin: newAdminStatus, userId: userItem._id });
      } else {
        // Reset the select to original value if user cancels
        e.target.value = userItem.admin ? "admin" : "user";
      }
    }
  };

  // Verified toggle function
  const handleVerifiedToggle = (userItem) => {
    const newStatus = !userItem.verified;
    if (
      window.confirm(
        "¿Quieres cambiar el estado de verificación de este usuario?"
      )
    ) {
      mutateUpdateVerified({ isVerified: newStatus, userId: userItem._id });
    }
  };

  const {
    currentPage,
    searchKeyword,
    data: usersData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllUsers(jwt, searchKeyword, currentPage),
    dataQueryKey: "users",
    deleteDataMessage: "Usuario eliminado",
    mutateDeleteFn: ({ slug, token }) => deleteUser({ slug, token }),
  });

  // Check if JWT is missing or invalid
  if (!jwt) {
    return (
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
        }}
      >
        <Card
          sx={{
            backgroundColor: theme.palette.error.lightest,
            borderColor: theme.palette.error.main,
          }}
        >
          <CardContent>
            <Typography color="error">
              Error: No se encontró token de autenticación. Por favor, inicia
              sesión nuevamente.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Mobile Card Component
  const UserCard = ({ userItem }) => (
    <Card
      sx={{
        mb: 2,
        boxShadow: "none",
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* User Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={
              userItem?.avatar
                ? stables.UPLOAD_FOLDER_BASE_URL + userItem?.avatar
                : images.userImage
            }
            alt={userItem.name}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              {userItem.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Mail
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                {userItem.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* User Info Grid */}
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
              {new Date(userItem.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Shield
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Estado:
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={userItem.verified ? "Verificado" : "Sin verificar"}
                color={userItem.verified ? "success" : "error"}
                variant={userItem.verified ? "filled" : "outlined"}
              />
              <Chip
                size="small"
                label={userItem.admin ? "Admin" : "Usuario"}
                color={userItem.admin ? "primary" : "default"}
                variant={userItem.admin ? "filled" : "outlined"}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Verified Toggle */}
          <Tooltip title="Cambiar verificación">
            <IconButton
              onClick={() => handleVerifiedToggle(userItem)}
              disabled={isLoadingUpdateVerified}
              sx={{
                backgroundColor: userItem.verified
                  ? theme.palette.success.lightest
                  : theme.palette.error.lightest,
                color: userItem.verified
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                "&:hover": {
                  backgroundColor: userItem.verified
                    ? theme.palette.success.light
                    : theme.palette.error.light,
                },
              }}
            >
              {userItem.verified ? <BsCheckLg /> : <AiOutlineClose />}
            </IconButton>
          </Tooltip>

          {/* Admin Select */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={userItem.admin ? "admin" : "user"}
              onChange={(e) => handleAdminToggle(e, userItem)}
              disabled={isLoadingUpdateUser}
              sx={{
                borderRadius: 30,
                height: 30,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="user">Usuario Regular</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>

          {/* Delete Button */}
          <Button
            disabled={isLoadingDeleteData}
            startIcon={<Trash2 size={16} />}
            onClick={() =>
              deleteDataHandler({ slug: userItem._id, token: jwt })
            }
            sx={{
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              gap: 1,
              textTransform: "none",
              borderRadius: 30,
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
        dataListName="Administrar usuarios"
        searchInputPlaceHolder="Email del usuario..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile
            ? []
            : ["Usuario", "Email", "Creado", "Verificado", "Rol", "Acciones"]
        }
        isLoading={isLoading}
        isFetching={isFetching}
        data={usersData?.data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={usersData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {usersData?.data.map((userItem) => (
              <UserCard key={userItem._id} userItem={userItem} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout
          usersData?.data.map((userItem) => (
            <tr
              key={userItem._id}
              style={{
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              {/* User Info */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      userItem?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + userItem?.avatar
                        : images.userImage
                    }
                    alt={userItem.name}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Box>
                    <Link
                      to={`/profile/${userItem._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          "&:hover": {
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        {userItem.name}
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </td>

              {/* Email */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Mail
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                  <Typography variant="body2" color="textPrimary">
                    {userItem.email}
                  </Typography>
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
                    {new Date(userItem.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </td>

              {/* Verified Status */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Tooltip title="Click para cambiar estado">
                  <IconButton
                    onClick={() => handleVerifiedToggle(userItem)}
                    disabled={isLoadingUpdateVerified}
                    sx={{
                      backgroundColor: userItem.verified
                        ? theme.palette.success.lightest
                        : theme.palette.error.lightest,
                      color: userItem.verified
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      width: 48,
                      height: 48,
                      "&:hover": {
                        backgroundColor: userItem.verified
                          ? theme.palette.success.light
                          : theme.palette.error.light,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {userItem.verified ? (
                      <BsCheckLg size={20} />
                    ) : (
                      <AiOutlineClose size={20} />
                    )}
                  </IconButton>
                </Tooltip>
              </td>

              {/* Admin Role */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <FormControl size="small" fullWidth sx={{ maxWidth: 160 }}>
                  <Select
                    value={userItem.admin ? "admin" : "user"}
                    onChange={(e) => handleAdminToggle(e, userItem)}
                    disabled={isLoadingUpdateUser}
                    sx={{
                      borderRadius: 30,

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.dark,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="user">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <User size={16} style={{ marginRight: 1 }} />
                        Usuario Regular
                      </Box>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ShieldCheck size={16} style={{ marginRight: 1 }} />
                        Administrador
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Button
                  disabled={isLoadingDeleteData}
                  startIcon={<Trash2 size={16} />}
                  onClick={() =>
                    deleteDataHandler({ slug: userItem._id, token: jwt })
                  }
                  sx={{
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor: theme.palette.error.lightest,
                      borderColor: theme.palette.error.dark,
                    },
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 30,
                  }}
                  variant="outlined"
                  size="small"
                >
                  Borrar
                </Button>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </Box>
  );
};

export default Users;
