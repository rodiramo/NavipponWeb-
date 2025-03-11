import express from 'express';
const router = express.Router();
import {
  createEmailweb,
  getEmailwebs,
  getEmailwebById,  
  deleteEmailweb,
} from '../controllers/emailwebController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
  .route('/')
  .post(createEmailweb)  
  .get(authGuard, adminGuard, getEmailwebs);  

router
  .route('/:id')
  .get(authGuard, adminGuard, getEmailwebById)  
  .delete(authGuard, adminGuard, deleteEmailweb);  

export default router;