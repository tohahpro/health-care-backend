import { Gender } from "@prisma/client";

export type IDoctorUpdateInput = {
    email: string;
    contactNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    name: string;
    address: string;
    registrationNumber: string;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
        isDeleted?: boolean;
    }[]
}