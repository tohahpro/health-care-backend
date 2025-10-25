import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../types";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";


const createPrescription = async (user: IJWTPayload, payload: Partial<Prescription>) => {
    if (!payload.appointmentId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "appointmentId is required");
    }
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.Completed,
            paymentStatus: PaymentStatus.Paid
        },
        include: {
            doctor: true
        }
    });

    if (!appointmentData) {
        throw new Error("Appointment not found");
    }

    if (user.role === UserRole.Doctor) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized to create this prescription");
        }
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: payload.appointmentId,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null
        },
        include: {
            patient: true
        }
    });
    
    return result;
}


export const PrescriptionService = {
    createPrescription
}