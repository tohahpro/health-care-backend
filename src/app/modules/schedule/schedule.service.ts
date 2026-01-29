import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma, Schedule } from "@prisma/client";
import { IJWTPayload } from "../../types";


const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}

const insertIntoDB = async (payload: any) => {

    const { startDate, endDate, startTime, endTime } = payload;

    const intervalTime = 30;

    const schedules = [];

    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate) // end date

    while (currentDate <= lastDate) {
        // 09:30  ---> ['09', '30']
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {          
            const start = await convertDateTime(startDateTime);
            const end = await convertDateTime(addMinutes(startDateTime, intervalTime))

            const scheduleData = {
                startDateTime: start,
                endDateTime: end
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
}

const schedulesForDoctor = async (user: IJWTPayload, options: IOptions, filters: any) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        // Both dates provided - find schedules within the date range
        const startOfDay = new Date(startDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(endDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    } else if (startDate) {
        // Only start date - find schedules on that specific day
        const startOfDay = new Date(startDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    } else if (endDate) {
        // Only end date - find schedules on that specific day
        const startOfDay = new Date(endDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(endDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
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

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}

const getScheduleById = async (id: string): Promise<Schedule | null> => {
    const result = await prisma.schedule.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const deleteScheduleFromDB = async (id: string) => {
    if (!id) {
        Error("Schedule are not exits!")
    }
    return await prisma.schedule.delete({
        where: { id }
    })
}

export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor,
    getScheduleById,
    deleteScheduleFromDB,

}