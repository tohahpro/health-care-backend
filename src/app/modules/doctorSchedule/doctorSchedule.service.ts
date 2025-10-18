import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types";


const createDoctorSchedule = async (user: IJWTPayload, payload: { scheduleIds: string[] }) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
           email: user.email
        }
    })
    const doctorScheduleData = payload.scheduleIds.map(scheduleId=>({
        doctorId : doctorData.id,
        scheduleId
    }))

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })

    return result;
}


export const DoctorScheduleService = {
    createDoctorSchedule,

}