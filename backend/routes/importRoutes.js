// routes/import.js
import express from "express";
import { ImportController } from "../controllers/importController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();
const importController = new ImportController();

// Routes
router.get(
  "/search-external",
  authGuard,
  importController.searchExternal.bind(importController)
);

router.post(
  "/import",
  authGuard,

  importController.importExperiences.bind(importController)
);

router.post(
  "/quick-import",
  authGuard,
  importController.quickImport.bind(importController)
);

router.get(
  "/stats",
  authGuard,
  importController.getStats.bind(importController)
);

export default router;
