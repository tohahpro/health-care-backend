import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../types";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IOptions, paginationHelper } from '../../helper/paginationHelper';


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

const getPrescriptions = async (user: IJWTPayload, options: IOptions) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

export const PrescriptionService = {
    createPrescription,
    getPrescriptions,
}