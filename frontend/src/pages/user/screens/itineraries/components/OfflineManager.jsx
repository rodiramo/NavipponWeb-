// OfflineManager.jsx - Complete offline and PDF solution
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Download,
  Wifi,
  WifiOff,
  FileText,
  MapPin,
  Calendar,
  Euro,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OfflineManager = ({ itinerary, boards, open, onClose, startDate }) => {
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [offlineData, setOfflineData] = useState(null);
  const [storageUsed, setStorageUsed] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check if itinerary is already stored offline
  useEffect(() => {
    checkOfflineStatus();
  }, [itinerary]);

  const checkOfflineStatus = async () => {
    try {
      const stored = localStorage.getItem(
        `offline_itinerary_${itinerary?._id}`
      );
      if (stored) {
        const data = JSON.parse(stored);
        setOfflineData(data);
        setIsOfflineEnabled(true);
        calculateStorageUsed();
      }
    } catch (error) {
      console.error("Error checking offline status:", error);
    }
  };

  const calculateStorageUsed = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith("offline_itinerary_")) {
          totalSize += localStorage[key].length;
        }
      }
      setStorageUsed(Math.round(totalSize / 1024)); // KB
    } catch (error) {
      console.error("Error calculating storage:", error);
    }
  };

  const handleOfflineToggle = async () => {
    if (isOfflineEnabled) {
      // Remove from offline storage
      removeFromOfflineStorage();
    } else {
      // Add to offline storage
      await saveForOfflineUse();
    }
  };

  const saveForOfflineUse = async () => {
    try {
      toast.loading("Guardando para uso offline...", { id: "offline-save" });

      // Prepare comprehensive offline data
      const offlineItinerary = {
        _id: itinerary._id,
        name: itinerary.name,
        totalBudget: itinerary.totalBudget,
        travelDays: itinerary.travelDays,
        startDate: startDate?.toISOString(),
        isPrivate: itinerary.isPrivate,
        creator: itinerary.creator,
        travelers: itinerary.travelers,
        boards: boards.map((board) => ({
          ...board,
          favorites:
            board.favorites?.map((fav) => ({
              _id: fav._id,
              experienceId: {
                _id: fav.experienceId?._id,
                title: fav.experienceId?.title,
                description: fav.experienceId?.description,
                price: fav.experienceId?.price,
                prefecture: fav.experienceId?.prefecture,
                categories: fav.experienceId?.categories,
                location: fav.experienceId?.location,
                photo: fav.experienceId?.photo,
                rating: fav.experienceId?.rating,
                address: fav.experienceId?.address,
              },
            })) || [],
        })),
        savedAt: new Date().toISOString(),
        version: "1.0",
      };

      // Cache images for offline use
      await cacheImages(offlineItinerary);

      // Save to localStorage
      localStorage.setItem(
        `offline_itinerary_${itinerary._id}`,
        JSON.stringify(offlineItinerary)
      );

      setOfflineData(offlineItinerary);
      setIsOfflineEnabled(true);
      calculateStorageUsed();

      toast.success("Itinerario guardado para uso offline", {
        id: "offline-save",
      });
    } catch (error) {
      console.error("Error saving for offline:", error);
      toast.error("Error al guardar para offline", { id: "offline-save" });
    }
  };

  const cacheImages = async (itineraryData) => {
    const imagePromises = [];

    itineraryData.boards.forEach((board) => {
      board.favorites?.forEach((fav) => {
        if (fav.experienceId?.photo) {
          imagePromises.push(
            cacheImage(fav.experienceId.photo, fav.experienceId._id)
          );
        }
      });
    });

    await Promise.allSettled(imagePromises);
  };

  const cacheImage = async (imageUrl, experienceId) => {
    try {
      if (!imageUrl.startsWith("http")) return; // Skip non-URL images

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onloadend = () => {
          localStorage.setItem(`offline_image_${experienceId}`, reader.result);
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn("Failed to cache image:", imageUrl, error);
    }
  };

  const removeFromOfflineStorage = () => {
    try {
      localStorage.removeItem(`offline_itinerary_${itinerary._id}`);

      // Remove cached images
      boards.forEach((board) => {
        board.favorites?.forEach((fav) => {
          localStorage.removeItem(`offline_image_${fav.experienceId?._id}`);
        });
      });

      setOfflineData(null);
      setIsOfflineEnabled(false);
      calculateStorageUsed();

      toast.success("Itinerario eliminado del almacenamiento offline");
    } catch (error) {
      console.error("Error removing offline data:", error);
      toast.error("Error al eliminar datos offline");
    }
  };

  const generatePDF = async () => {
    try {
      setDownloadingPDF(true);
      toast.loading("Generando PDF...", { id: "pdf-generate" });

      // Create hidden container for PDF content
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.width = "210mm"; // A4 width
      pdfContainer.style.backgroundColor = "white";
      pdfContainer.style.padding = "20px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";

      document.body.appendChild(pdfContainer);

      // Generate PDF content
      pdfContainer.innerHTML = generatePDFContent();

      // Convert to canvas and then PDF
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "white",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Cleanup
      document.body.removeChild(pdfContainer);

      // Download PDF
      const fileName = `${itinerary.name?.replace(/[^a-z0-9]/gi, "_") || "itinerario"}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast.success("PDF descargado exitosamente", { id: "pdf-generate" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar PDF", { id: "pdf-generate" });
    } finally {
      setDownloadingPDF(false);
    }
  };

  const generatePDFContent = () => {
    const formatDate = (date) => {
      if (!date) return "Fecha no especificada";
      return new Date(date).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const totalExperiences = boards.reduce(
      (sum, board) => sum + (board.favorites?.length || 0),
      0
    );

    return `
      <div style="max-width: 100%; margin: 0 auto; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e91e63; padding-bottom: 20px;">
          <h1 style="color: #e91e63; margin: 0; font-size: 28px; font-weight: bold;">
            ${itinerary.name || "Mi Itinerario"}
          </h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">
            Itinerario de viaje generado el ${new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <!-- Trip Overview -->
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">📋 Resumen del Viaje</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong>🗓️ Fecha de inicio:</strong><br>
              ${formatDate(startDate)}
            </div>
            <div>
              <strong>📅 Duración:</strong><br>
              ${itinerary.travelDays || boards.length} días
            </div>
            <div>
              <strong>🎯 Total de experiencias:</strong><br>
              ${totalExperiences} actividades
            </div>
            <div>
              <strong>💰 Presupuesto total:</strong><br>
              ¥${itinerary.totalBudget || 0}
            </div>
          </div>
        </div>

        <!-- Daily Itinerary -->
        <div>
          <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">🗓️ Itinerario Diario</h2>
          ${boards
            .map(
              (board, index) => `
            <div style="margin-bottom: 25px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <div style="background: #e91e63; color: white; padding: 15px;">
                <h3 style="margin: 0; font-size: 18px;">
                   Día ${index + 1} - ${formatDate(board.date)}
                </h3>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">
                  Presupuesto diario: ¥${board.dailyBudget || 0}
                </p>
              </div>
              <div style="padding: 20px;">
                ${
                  board.favorites && board.favorites.length > 0
                    ? board.favorites
                        .map(
                          (fav, favIndex) => `
                    <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #eee; border-radius: 6px;">
                      <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">
                        ${favIndex + 1}. ${fav.experienceId?.title || "Experiencia sin título"}
                      </h4>
                      ${
                        fav.experienceId?.prefecture
                          ? `
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                           ${fav.experienceId.prefecture}
                        </p>
                      `
                          : ""
                      }
                      ${
                        fav.experienceId?.description
                          ? `
                        <p style="margin: 0 0 8px 0; color: #555; font-size: 14px; line-height: 1.4;">
                          ${fav.experienceId.description}
                        </p>
                      `
                          : ""
                      }
                      <div style="display: flex; gap: 15px; align-items: center; margin-top: 10px;">
                        ${
                          fav.experienceId?.price
                            ? `
                          <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            ¥${fav.experienceId.price}
                          </span>
                        `
                            : ""
                        }
                        ${
                          fav.experienceId?.categories
                            ? `
                          <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            ${fav.experienceId.categories}
                          </span>
                        `
                            : ""
                        }
                        ${
                          fav.experienceId?.rating
                            ? `
                          <span style="color: #ff9800; font-size: 12px; font-weight: bold;">
                            ⭐ ${fav.experienceId.rating}/5
                          </span>
                        `
                            : ""
                        }
                      </div>
                    </div>
                  `
                        )
                        .join("")
                    : `
                  <p style="color: #999; text-align: center; padding: 20px; font-style: italic;">
                    No hay experiencias planificadas para este día
                  </p>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Generado por Navippon</p>
          <p>Fecha de generación: ${new Date().toLocaleString("es-ES")}</p>
        </div>
      </div>
    `;
  };

  const clearAllOfflineData = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.startsWith("offline_itinerary_") ||
          key.startsWith("offline_image_")
        ) {
          localStorage.removeItem(key);
        }
      });

      setOfflineData(null);
      setIsOfflineEnabled(false);
      calculateStorageUsed();

      toast.success("Todos los datos offline eliminados");
    } catch (error) {
      console.error("Error clearing offline data:", error);
      toast.error("Error al limpiar datos offline");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <FileText size={24} />
          <Typography variant="h6">Offline & PDF</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {isOnline ? (
              <Chip
                icon={<Wifi size={16} />}
                label="Online"
                color="success"
                size="small"
              />
            ) : (
              <Chip
                icon={<WifiOff size={16} />}
                label="Offline"
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box space={3}>
          {/* Offline Storage Section */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Uso Offline
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Guarda tu itinerario para acceder sin conexión a internet
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={isOfflineEnabled}
                  onChange={handleOfflineToggle}
                  color="primary"
                />
              }
              label={
                isOfflineEnabled ? "Disponible offline" : "Habilitar offline"
              }
            />

            {isOfflineEnabled && offlineData && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Itinerario guardado para uso offline
                  <br />
                  Guardado:{" "}
                  {new Date(offlineData.savedAt).toLocaleString("es-ES")}
                  <br />
                  Tamaño: ~{storageUsed} KB
                </Typography>
              </Alert>
            )}
          </Box>

          <Divider />

          {/* PDF Download Section */}
          <Box mt={3} mb={3}>
            <Typography variant="h6" gutterBottom>
              Descargar PDF
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Genera una versión PDF completa de tu itinerario
            </Typography>

            <Button
              variant="contained"
              startIcon={
                downloadingPDF ? (
                  <CircularProgress size={16} />
                ) : (
                  <Download size={16} />
                )
              }
              onClick={generatePDF}
              disabled={downloadingPDF}
              fullWidth
              sx={{ mb: 2, textTransform: "none", borderRadius: 30 }}
            >
              {downloadingPDF ? "Generando PDF..." : "Descargar PDF"}
            </Button>

            <Typography variant="caption" color="text.secondary">
              El PDF incluirá todos los detalles del itinerario, experiencias,
              fechas y presupuestos
            </Typography>
          </Box>

          <Divider />

          {/* Storage Management */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Gestión de Almacenamiento
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Espacio usado para datos offline: {storageUsed} KB
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Trash2 size={16} />}
              onClick={clearAllOfflineData}
              color="error"
              sx={{ textTransform: "none", borderRadius: 30 }}
              fullWidth
            >
              Limpiar todos los datos offline
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfflineManager;
