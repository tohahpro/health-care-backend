import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { DoctorScheduleController } from './doctorSchedule.controller';
import express from "express";

const router = express.Router();

router.post("/", auth(UserRole.Doctor), DoctorScheduleController.createDoctorSchedule)

export const DoctorScheduleRoutes = router;