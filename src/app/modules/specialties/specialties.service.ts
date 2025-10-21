import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Specialties } from "@prisma/client";


const insertSpecialtiesIntoDB = async (req: Request) => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};

const getAllSpecialties = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
};

const deleteSpecialties = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialtiesService = {
    insertSpecialtiesIntoDB,
    getAllSpecialties,
    deleteSpecialties
}