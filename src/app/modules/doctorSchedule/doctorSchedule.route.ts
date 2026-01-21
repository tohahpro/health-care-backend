import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { DoctorScheduleController } from './doctorSchedule.controller';
import express from "express";
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();

router.post("/", auth(UserRole.Doctor), validateRequest(DoctorScheduleValidation.createDoctorScheduleValidation), DoctorScheduleController.createDoctorSchedule)
router.get('/', auth(UserRole.Admin, UserRole.Doctor, UserRole.Patient), DoctorScheduleController.getAllFromDB);
router.get('/my-schedule', auth(UserRole.Doctor), DoctorScheduleController.getMySchedule);
router.delete('/:id', auth(UserRole.Doctor), DoctorScheduleController.deleteFromDB);


export const DoctorScheduleRoutes = router;