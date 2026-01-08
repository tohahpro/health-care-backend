import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validations';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.Admin),
    AdminController.getAllFromDB
);

router.get(
    '/:id',
    auth(UserRole.Admin),
    AdminController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.Admin),
    validateRequest(adminValidationSchemas.update),
    AdminController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.Admin),
    AdminController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.Admin),
    AdminController.softDeleteFromDB
);

export const AdminRoutes = router;