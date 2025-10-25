import { UserRole } from '@prisma/client';
import express  from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';


const router = express.Router();

router.post('/', auth(UserRole.Patient), ReviewController.insertIntoDB);


export const ReviewRoutes = router;