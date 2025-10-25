import { stripe } from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (user: IJWTPayload, payload: { doctorId: string, scheduleId: string }) => {
    // Check if patient exists
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!patientData) {
        throw new Error("Patient not found");
    }

    // Check if doctor exists
    const doctorData = await prisma.doctor.findUnique({
        where: {
            id: payload.doctorId,
            isDeleted: false
        },
    });
    if (!doctorData) {
        throw new Error("Doctor not found");
    }

    // Check if schedule exists
    const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });
    if (isBookedOrNot.isBooked === true) {
        throw new Error("Schedule is already booked");
    }

    // Create video call link
    const videoCallLink = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingID: videoCallLink
            }
        })

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })
        const transactionId = uuidv4();
        // for strip payment
        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId: transactionId,

            }
        })


        // strip payment integration will be here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id
            },
            success_url: `http://localhost:3000`,
            cancel_url: `http://localhost:3000/payment-failed`,
        });

        return { paymentUrl: session.url };
        
    })


    return result;

}

export const AppointmentService = {
    createAppointment,
};