import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import { Search, Download } from "lucide-react";
import {
  useTheme,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  Paper,
} from "@mui/material";

const AdminImport = () => {
  const { jwt } = useUser();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState("Tokyo");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("google");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [stats, setStats] = useState(null);

  const prefectures = [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Hokkaido",
    "Fukuoka",
    "Hiroshima",
    "Aichi",
    "Miyagi",
    "Nara",
  ];
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/import/stats`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [jwt]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSearch = async () => {
    if (!searchQuery && selectedCategory === "all") {
      toast.error(
        "Por favor ingresa una consulta de búsqueda o selecciona una categoría específica"
      );
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery || selectedCategory,
        source: selectedSource,
        prefecture: selectedPrefecture,
        category: selectedCategory,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/import/search-external?${params}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setSelectedItems([]);
        toast.success(
          `Se encontraron ${data.results?.length || 0} experiencias`
        );
      } else {
        toast.error("Error al buscar experiencias");
      }
    } catch (error) {
      toast.error("Error en la búsqueda: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (selectedItems.length === 0) {
      toast.error("Por favor selecciona experiencias para importar");
      return;
    }

    setImporting(true);
    setImportProgress(0);

    try {
      const itemsToImport = selectedItems.map((index) => searchResults[index]);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/import/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            source: selectedSource,
            data: itemsToImport,
            category:
              selectedCategory === "all"
                ? "Atractivos"
                : mapCategoryName(selectedCategory),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `¡Importación completada!\nImportadas: ${data.imported}\nDuplicadas: ${data.duplicates}\nErrores: ${data.errors}`
        );
        setSelectedItems([]);
        loadStats();
      } else {
        toast.error("Error en la importación");
      }
    } catch (error) {
      toast.error("Error en la importación: " + error.message);
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const mapCategoryName = (category) => {
    const mapping = {
      hotels: "Hoteles",
      restaurants: "Restaurantes",
      attractions: "Atractivos",
    };
    return mapping[category] || "Atractivos";
  };

  const toggleSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: theme.palette.primary.main,
        }}
      >
        Importar experiencias
      </Typography>

      {/* Stats Section */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                >
                  {stats.total}
                </Typography>
                <Typography color="textSecondary">Experiencias</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {stats.imported}
                </Typography>
                <Typography color="textSecondary">Importadas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {stats.manual}
                </Typography>
                <Typography color="textSecondary">Manuales</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {stats.pending}
                </Typography>
                <Typography color="textSecondary">Pendientes</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search Controls */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.neutral.light}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 3,
            color: theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          Buscar e importar
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Fuente</InputLabel>
              <Select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                label="Fuente"
              >
                <MenuItem value="google">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Google Places
                  </Box>
                </MenuItem>
                <MenuItem value="osm">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    OpenStreetMap
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Prefectura</InputLabel>
              <Select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                label="Prefectura"
              >
                {prefectures.map((prefecture) => (
                  <MenuItem key={prefecture} value={prefecture}>
                    {prefecture}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoría"
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="hotels">Hoteles</MenuItem>
                <MenuItem value="restaurants">Restaurantes</MenuItem>
                <MenuItem value="attractions">Atractivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ej: templos, hoteles, sushi"
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <Search />
                }
                fullWidth
                sx={{
                  textTransform: "none",
                  borderRadius: 20,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Import Progress */}
      {importing && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={importProgress} />
          <Typography variant="caption" sx={{ mt: 1 }}>
            Importando experiencias... {importProgress}%
          </Typography>
        </Box>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Paper
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.neutral.light}`,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
              }}
            >
              Resultados ({searchResults.length})
            </Typography>
            <Button
              variant="contained"
              onClick={handleBulkImport}
              disabled={selectedItems.length === 0 || importing}
              startIcon={<Download />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Importar seleccionados ({selectedItems.length})
            </Button>
          </Box>

          <Grid container spacing={2}>
            {searchResults.map((experience, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    border: selectedItems.includes(index)
                      ? "2px solid"
                      : "1px solid",
                    borderColor: selectedItems.includes(index)
                      ? theme.palette.primary.main
                      : theme.palette.neutral.light,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => toggleSelection(index)}
                >
                  <Box sx={{ position: "relative" }}>
                    <Checkbox
                      checked={selectedItems.includes(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        bgcolor: "white",
                        borderRadius: 1,
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    >
                      {experience.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {experience.caption}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={experience.categories}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={experience.prefecture}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      {experience.price > 0 && (
                        <Chip
                          label={`¥${experience.price}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {experience.ratings > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {experience.ratings} ({experience.numReviews} reseñas)
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {searchResults.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Box>
            <Typography variant="body2" gutterBottom>
              Usa el buscador para encontrar experiencias desde:
            </Typography>
            <Typography variant="body2">
              • <strong> Google Places:</strong> Datos detallados con fotos,
              reseñas y horarios (requiere API key)
            </Typography>
            <Typography variant="body2">
              • <strong>OpenStreetMap:</strong> Datos comunitarios gratuitos,
              ideal para lugares locales
            </Typography>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default AdminImport;
