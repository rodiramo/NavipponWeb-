import React, { useEffect } from "react";
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
  Bug,
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
import axios from "axios";

const Users = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  console.log("JWT Token:", jwt ? "Present" : "Missing");

  // 🔧 PRODUCTION DIAGNOSTIC FUNCTION
  const runProductionDiagnostic = async () => {
    console.log("🔧 PRODUCTION DIAGNOSTIC STARTING...");
    console.log("================================================");

    // 1. Environment Check
    console.log("1️⃣ ENVIRONMENT CHECK:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
    console.log("- Window hostname:", window.location.hostname);
    console.log("- Window origin:", window.location.origin);
    console.log("- Current URL:", window.location.href);

    let API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    console.log("- Raw API_URL:", API_URL);

    // Fix API URL for production
    if (
      window.location.hostname === "navippon.com" &&
      API_URL.includes("localhost")
    ) {
      const possibleUrls = [
        <Button
          onClick={() => {
            console.log("🔍 TOKEN STORAGE DEBUG:");
            console.log(
              "- localStorage jwt:",
              localStorage.getItem("jwt") ? "EXISTS" : "MISSING"
            );
            console.log(
              "- sessionStorage jwt:",
              sessionStorage.getItem("jwt") ? "EXISTS" : "MISSING"
            );
            console.log(
              "- localStorage authToken:",
              localStorage.getItem("authToken") ? "EXISTS" : "MISSING"
            );
            console.log(
              "- sessionStorage authToken:",
              sessionStorage.getItem("authToken") ? "EXISTS" : "MISSING"
            );

            const tokens = {
              localJWT: localStorage.getItem("jwt"),
              sessionJWT: sessionStorage.getItem("jwt"),
              localAuthToken: localStorage.getItem("authToken"),
              sessionAuthToken: sessionStorage.getItem("authToken"),
            };

            console.log("🔍 All stored tokens:", tokens);

            toast("Check console for token storage details", {
              icon: "🔍",
              duration: 3000,
            });
          }}
          variant="outlined"
          color="secondary"
          sx={{ mr: 2 }}
        >
          🔍 Debug Tokens
        </Button>,
      ];
      console.log("⚠️ Production site using localhost API URL!");
      console.log("🔧 Possible production API URLs:", possibleUrls);
      API_URL = "https://navippon.up.railway.app"; // Use Railway URL
    }

    console.log("- Final API_URL being used:", API_URL);

    // 2. JWT Check
    console.log("\n2️⃣ JWT TOKEN CHECK:");
    if (!jwt) {
      console.error("❌ No JWT token found");
      return;
    }

    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      console.log("- Token valid:", true);
      console.log("- User ID:", payload.id);
      console.log("- payload.admin:", payload.admin);
      console.log("- payload.isAdmin:", payload.isAdmin);
      console.log("- payload.role:", payload.role);

      const isAdmin =
        payload.admin === true ||
        payload.isAdmin === true ||
        payload.role === "admin";
      console.log("- Computed Is Admin:", isAdmin);
      console.log("- Expires:", new Date(payload.exp * 1000));
      console.log("- Is Expired:", payload.exp * 1000 < Date.now());
      console.log("- Full payload:", payload);
    } catch (error) {
      console.error("❌ Invalid JWT token:", error.message);
      return;
    }

    // 3. API Connectivity Test
    console.log("\n3️⃣ API CONNECTIVITY TEST:");
    const testEndpoints = [
      {
        name: "Railway API",
        url: `https://navippon.up.railway.app/api/users/count`,
      },
      { name: "User Count", url: `${API_URL}/api/users/count` },
      { name: "Get Users", url: `${API_URL}/api/users?page=1&limit=1` },
    ];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
        const response = await fetch(endpoint.url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`- Status: ${response.status}`);
        console.log(`- OK: ${response.ok}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.log(`- Error response: ${errorText}`);
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} failed:`, error.message);
      }
    }

    // 4. Delete Endpoint Test
    console.log("\n4️⃣ DELETE ENDPOINT TEST:");
    const deleteUrl = `https://navippon.up.railway.app/api/users/test-user-id`;
    console.log("- Delete URL would be:", deleteUrl);

    try {
      // Don't actually delete, just test if endpoint exists
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      console.log("- Delete endpoint status:", response.status);
      if (response.status === 404) {
        console.log("✅ Endpoint exists but user not found (expected)");
      } else if (response.status === 403) {
        console.log("❌ Forbidden - user lacks admin privileges");
      } else if (response.status === 401) {
        console.log("❌ Unauthorized - JWT issue");
      } else if (response.status === 500) {
        console.log("⚠️ Server error - backend issue");
        const errorText = await response.text();
        console.log("- Server error details:", errorText);
      } else {
        console.log("- Response:", await response.text());
      }
    } catch (error) {
      console.error("❌ Delete endpoint test failed:", error.message);
    }

    console.log("\n================================================");
    console.log("🔧 DIAGNOSTIC COMPLETE");
  };

  // 🔍 CHECK API URL AND CONNECTIVITY
  useEffect(() => {
    let API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Fix for production
    if (
      window.location.hostname === "navippon.com" &&
      API_URL.includes("localhost")
    ) {
      API_URL = "https://navippon.up.railway.app";
    }

    console.log("🔍 PRODUCTION API URL CHECK:");
    console.log("🔍 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
    console.log("🔍 Final API_URL:", API_URL);
    console.log("🔍 Environment:", process.env.NODE_ENV);
    console.log("🔍 Current origin:", window.location.origin);

    // Test if API is reachable
    if (jwt) {
      console.log("🔍 Testing API connectivity...");
      fetch(`${API_URL}/api/users/count`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          console.log("🔍 API connectivity test:", response.status);
          if (response.ok) {
            console.log("✅ API is reachable");
          } else {
            console.error("❌ API returned error status:", response.status);
          }
        })
        .catch((error) => {
          console.error("❌ API connectivity failed:", error.message);
        });
    }
  }, [jwt]);

  // 🔍 CHECK ADMIN STATUS
  const checkAdminStatus = () => {
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      console.log("🔍 Current user from JWT:");
      console.log("- User ID:", payload.id);
      console.log("- Is Admin (payload.admin):", payload.admin);
      console.log("- Is Admin (payload.isAdmin):", payload.isAdmin);
      console.log("- Token expires:", new Date(payload.exp * 1000));
      console.log("- Full payload:", payload);

      // Check for admin status in different possible fields
      const isAdmin =
        payload.admin === true ||
        payload.isAdmin === true ||
        payload.admin === "true" ||
        payload.isAdmin === "true" ||
        payload.role === "admin";

      console.log("🔍 Computed admin status:", isAdmin);

      if (!isAdmin) {
        console.warn(
          "⚠️ JWT doesn't show admin, but you can change roles, so proceeding anyway..."
        );
        // Don't show error since they can actually do admin actions
      }

      return isAdmin;
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return false;
    }
  };

  useEffect(() => {
    if (jwt) {
      checkAdminStatus();
    }
  }, [jwt]);

  // 🧪 BYPASS DELETE FUNCTION (uses Railway URL directly)
  const bypassDeleteUser = async (userToDelete) => {
    console.log("🔥 BYPASS DELETE - Using Railway URL directly");

    // Since Railway URL works (Status 200), use it directly
    const railwayUrl = "https://navippon.up.railway.app";

    try {
      const deleteUrl = `${railwayUrl}/api/users/${userToDelete._id}`;
      console.log(`🔥 Using working Railway URL: ${deleteUrl}`);

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`🔥 Railway Response Status: ${response.status}`);

      if (response.ok) {
        console.log("🔥 ✅ DELETE SUCCESS with Railway!");
        const responseText = await response.text();
        console.log("🔥 Response:", responseText);

        queryClient.invalidateQueries(["users"]);
        toast.success("Usuario eliminado exitosamente");
        return;
      } else if (response.status === 500) {
        // Server error - get details
        const errorText = await response.text();
        console.error("🔥 ❌ SERVER ERROR (500):", errorText);
        toast.error(
          `Error del servidor: ${errorText || "Error interno del servidor"}`
        );
        return;
      } else if (response.status === 403) {
        // Forbidden - JWT lacks admin privileges
        const errorText = await response.text();
        console.error("🔥 ❌ FORBIDDEN (403):", errorText);
        toast.error(
          "No tienes permisos de administrador para eliminar usuarios"
        );
        return;
      } else if (response.status === 401) {
        // Unauthorized - JWT issue
        const errorText = await response.text();
        console.error("🔥 ❌ UNAUTHORIZED (401):", errorText);
        toast.error("Token de autenticación inválido");
        return;
      } else if (response.status === 404) {
        // User not found
        const errorText = await response.text();
        console.error("🔥 ❌ NOT FOUND (404):", errorText);
        toast.error("Usuario no encontrado");
        return;
      } else {
        // Other error
        const errorText = await response.text();
        console.error(`🔥 ❌ ERROR (${response.status}):`, errorText);
        toast.error(`Error ${response.status}: ${errorText}`);
        return;
      }
    } catch (error) {
      console.error("🔥 ❌ NETWORK ERROR:", error.message);
      toast.error(`Error de conexión: ${error.message}`);
    }
  };

  // Mutation for updating admin status
  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationFn: ({ isAdmin, userId }) => {
        console.log("Updating user admin status:", {
          isAdmin,
          userId: String(userId),
          token: jwt,
        });
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

  // Debug useDataTable hook
  console.log("🔍 useDataTable hook values:");
  console.log("🔍 deleteDataHandler type:", typeof deleteDataHandler);
  console.log("🔍 isLoadingDeleteData:", isLoadingDeleteData);
  console.log("🔍 usersData:", usersData);

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
            onClick={() => {
              console.log("🔴 MOBILE DELETE BUTTON CLICKED");
              console.log("🔴 User to delete:", userItem);
              console.log("🔴 User ID:", userItem._id);
              console.log("🔴 JWT exists:", !!jwt);

              if (
                window.confirm(
                  `¿Estás seguro de que quieres eliminar a ${userItem.name}?`
                )
              ) {
                console.log("🔴 DELETE CONFIRMED - Calling bypassDeleteUser");
                bypassDeleteUser(userItem);
              } else {
                console.log("🔴 DELETE CANCELLED");
              }
            }}
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
      {/* Debug Panel */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<Bug />}
          onClick={runProductionDiagnostic}
          variant="outlined"
          color="warning"
          sx={{ mr: 2 }}
        >
          Run Production Diagnostic
        </Button>

        <Button
          onClick={() => {
            console.log(
              "🔄 Recommending re-login for fresh JWT with admin privileges"
            );
            if (
              window.confirm(
                "Tu JWT no tiene permisos de admin. ¿Quieres cerrar sesión y volver a entrar para obtener un token válido?"
              )
            ) {
              // Clear ALL possible auth tokens
              localStorage.removeItem("jwt"); // useUser hook key
              sessionStorage.removeItem("jwt"); // useUser hook key
              localStorage.removeItem("authToken"); // login service key
              sessionStorage.removeItem("authToken"); // login service key

              console.log("🔄 All tokens cleared, redirecting to login...");
              // Redirect to login
              window.location.href = "/login";
            }
          }}
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
        >
          🔑 Fix JWT - Re-login
        </Button>

        <Button
          onClick={() => {
            const payload = JSON.parse(atob(jwt.split(".")[1]));
            console.log("🔍 JWT ANALYSIS:");
            console.log("Current JWT payload:", payload);
            console.log("Missing fields needed for admin:");
            console.log("- admin:", payload.admin, "❌");
            console.log("- isAdmin:", payload.isAdmin, "❌");
            console.log("- role:", payload.role, "❌");

            toast("Check console for detailed JWT analysis", {
              icon: "🔍",
              duration: 4000,
            });
          }}
          variant="outlined"
          color="warning"
          sx={{ mr: 2 }}
        >
          🔍 Analyze JWT
        </Button>

        <Button
          onClick={async () => {
            // Test different API URLs for production
            const possibleUrls = [
              "https://navippon.up.railway.app", // Railway production URL
              "https://api.navippon.com",
              "https://navippon.com/api",
              "https://backend.navippon.com",
              process.env.REACT_APP_API_URL || "http://localhost:5001",
            ];

            console.log("🧪 TESTING POSSIBLE API URLS:");
            for (const url of possibleUrls) {
              try {
                console.log(`Testing: ${url}/api/users/count`);
                const response = await fetch(`${url}/api/users/count`, {
                  method: "GET",
                  headers: { Authorization: `Bearer ${jwt}` },
                });
                console.log(
                  `- ${url}: Status ${response.status} ${response.ok ? "✅" : "❌"}`
                );
                if (response.ok) {
                  toast.success(`Working API URL: ${url}`);
                  break;
                }
              } catch (error) {
                console.log(`- ${url}: Failed (${error.message}) ❌`);
              }
            }
          }}
          variant="outlined"
          color="secondary"
          sx={{ mr: 2 }}
        >
          Test API URLs
        </Button>

        <Button
          onClick={async () => {
            console.log("🔄 CHECKING BACKEND PROFILE...");
            try {
              const response = await fetch(
                "https://navippon.up.railway.app/api/users/profile",
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${jwt}` },
                }
              );

              if (response.ok) {
                const userData = await response.json();
                console.log("🔄 Current user data from backend:", userData);
                toast(`Backend says admin: ${userData.admin ? "YES" : "NO"}`, {
                  icon: "🔍",
                  duration: 4000,
                });
              } else {
                console.error("🔄 Failed to get profile:", response.status);
                toast.error("No se pudo obtener el perfil del usuario");
              }
            } catch (error) {
              console.error("🔄 Profile request failed:", error);
              toast.error("Error al obtener perfil: " + error.message);
            }
          }}
          variant="outlined"
          color="warning"
        >
          Check Backend Profile
        </Button>
      </Box>

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
                  onClick={() => {
                    console.log("🔴 DESKTOP DELETE BUTTON CLICKED");
                    console.log("🔴 User to delete:", userItem);
                    console.log("🔴 User ID:", userItem._id);
                    console.log("🔴 JWT exists:", !!jwt);

                    if (
                      window.confirm(
                        `¿Estás seguro de que quieres eliminar a ${userItem.name}?`
                      )
                    ) {
                      console.log(
                        "🔴 DELETE CONFIRMED - Calling bypassDeleteUser"
                      );
                      bypassDeleteUser(userItem);
                    } else {
                      console.log("🔴 DELETE CANCELLED");
                    }
                  }}
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
