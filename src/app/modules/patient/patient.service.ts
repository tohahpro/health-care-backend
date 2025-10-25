import { Patient, Prisma, UserStatus } from '@prisma/client';
import { IOptions, paginationHelper } from '../../helper/paginationHelper';
import { patientSearchableFields } from './patient.constant';
import { IPatientFilterRequest } from './patient.interface';
import { prisma } from '../../shared/prisma';
import { IJWTPayload } from '../../types';


const getAllFromDB = async (
    filters: IPatientFilterRequest,
    options: IOptions,
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }
    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                }
    });
    const total = await prisma.patient.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
};


const softDelete = async (id: string): Promise<Patient | null> => {
    return await prisma.$transaction(async transactionClient => {
        const deletedPatient = await transactionClient.patient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deletedPatient.email,
            },
            data: {
                status: UserStatus.Deleted,
            },
        });

        return deletedPatient;
    });
};

// PatientHealthData, MedicalReport, Patient
const updateIntoDB = async (user: IJWTPayload, payload: any) => {
    const { medicalReport, patientHealthData, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false
        },
    });

    return await prisma.$transaction(async (tnx) => {
        await tnx.patient.update({
            where: { id: patientInfo.id },
            data: patientData,
        });

        if (patientHealthData) {
            await tnx.patientHealthData.upsert({     // upsert = update or insert
                where: {
                    patientId: patientInfo.id,
                },
                update: patientHealthData,
                create: {
                    /* create e to ar patient id thake na.
                    Tai create korar somoy patientid tau dite hobe*/
                    ...patientHealthData,
                    patientId: patientInfo.id,
                }
            });
        };

        // medical report er khetre onek gula report thakte pare
        if (medicalReport) {
            await tnx.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id,
                }
            })
        }

        const result = await tnx.patient.findUnique({
            where: { id: patientInfo.id },
            include: {
                patientHealthData: true,
                medicalReports: true,
            },
        })
        return result;
    })
}

export const PatientService = {
    getAllFromDB,
    getByIdFromDB,
    softDelete,
    updateIntoDB,
};