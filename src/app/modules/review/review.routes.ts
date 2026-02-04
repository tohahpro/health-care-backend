import { UserRole } from '@prisma/client';
import express  from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';


const router = express.Router();

router.post('/', auth(UserRole.Patient), ReviewController.insertIntoDB);
router.get('/', ReviewController.getAllFromDB);
router.get('/:id', ReviewController.getSingleFromDB);

export const ReviewRoutes = router;