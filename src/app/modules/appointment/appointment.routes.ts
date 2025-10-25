import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.Patient), AppointmentController.createAppointment)
router.get('/', auth(UserRole.Admin), AppointmentController.getAllAppointments);
router.get('/my-appointments', auth(UserRole.Patient, UserRole.Doctor), AppointmentController.getMyAppointments);

export const AppointmentRoutes = router;