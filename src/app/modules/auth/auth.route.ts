import express from 'express'
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get("/me", AuthController.getMe)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/change-password', auth(UserRole.Admin, UserRole.Doctor, UserRole.Patient), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword)

export const AuthRoutes = router