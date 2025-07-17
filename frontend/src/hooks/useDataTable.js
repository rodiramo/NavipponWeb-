import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Trash2, AlertTriangle } from "lucide-react";

let isFirstRun = true;

export const useDataTable = ({
  dataQueryFn,
  dataQueryKey,
  mutateDeleteFn,
  deleteDataMessage,
  deleteConfirmTitle = "Confirmar eliminación",
  deleteConfirmMessage = "¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.",
}) => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    data: null,
  });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryFn: dataQueryFn,
    queryKey: [dataQueryKey],
  });

  const { mutate: mutateDeletePost, isLoading: isLoadingDeleteData } =
    useMutation({
      mutationFn: mutateDeleteFn,
      onSuccess: (data) => {
        queryClient.invalidateQueries([dataQueryKey]);
        toast.success(deleteDataMessage);
        setDeleteDialog({ open: false, data: null });
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
        setDeleteDialog({ open: false, data: null });
      },
    });

  useEffect(() => {
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [refetch, currentPage]);

  const searchKeywordHandler = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };

  const submitSearchKeywordHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const deleteDataHandler = ({ slug, token }) => {
    setDeleteDialog({
      open: true,
      data: { slug, token },
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.data) {
      mutateDeletePost(deleteDialog.data);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, data: null });
  };

  // Delete Confirmation Dialog Component
  const DeleteConfirmationDialog = () => (
    <Dialog
      open={deleteDialog.open}
      onClose={handleDeleteCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? "16px" : "20px",
          m: isMobile ? 1 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 1,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          fontWeight: "bold",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: "50%",
            backgroundColor: `${theme.palette.error.main}15`,
            color: theme.palette.error.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={isMobile ? 20 : 24} />
        </Box>
        {deleteConfirmTitle}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            lineHeight: 1.5,
            color: theme.palette.text.primary,
          }}
        >
          {deleteConfirmMessage}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 1,
          gap: isMobile ? 1 : 2,
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        <Button
          onClick={handleDeleteCancel}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            borderRadius: "25px",
            textTransform: "none",
            fontSize: isMobile ? "0.875rem" : "1rem",
            py: isMobile ? 1.5 : 1,
            px: isMobile ? 2 : 3,
          }}
          disabled={isLoadingDeleteData}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleDeleteConfirm}
          variant="contained"
          color="error"
          fullWidth={isMobile}
          disabled={isLoadingDeleteData}
          startIcon={
            isLoadingDeleteData ? null : <Trash2 size={isMobile ? 16 : 18} />
          }
          sx={{
            borderRadius: "25px",
            textTransform: "none",
            fontSize: isMobile ? "0.875rem" : "1rem",
            fontWeight: "bold",
            py: isMobile ? 1.5 : 1,
            px: isMobile ? 2 : 3,
            backgroundColor: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
          }}
        >
          {isLoadingDeleteData ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    userState,
    currentPage,
    searchKeyword,
    data,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
    DeleteConfirmationDialog, // Export the dialog component
  };
};
