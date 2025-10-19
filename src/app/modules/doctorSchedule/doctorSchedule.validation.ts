import z from 'zod';

const createDoctorScheduleValidation = z.object({
    body: z.object({
        scheduleIds: z.array(z.string())
    })
})

export const DoctorScheduleValidation = {
    createDoctorScheduleValidation
}