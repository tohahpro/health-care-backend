import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.Patient),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

router.get("/", auth(UserRole.Admin), AppointmentController.getAllAppointments);

router.get(
  "/my-appointments",
  auth(UserRole.Patient, UserRole.Doctor),
  AppointmentController.getMyAppointments
);

router.get(
  "/:id",
  auth(UserRole.Admin),
  AppointmentController.getAppointmentsById
);

router.patch(
  "/status/:id",
  auth(UserRole.Doctor, UserRole.Admin),
  AppointmentController.updateAppointmentStatus
);

export const AppointmentRoutes = router;
