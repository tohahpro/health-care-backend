import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs"
import { jwtHelper } from "../../helper/jwtHelper"
import config from "../../../config"
import httpStatus from "http-status"
import ApiError from "../../errors/ApiError"
import { Secret } from "jsonwebtoken"
import emailSender from "./emailSender"

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.Active
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password)
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect.")
    }
    const jwtPayload = {
        email: user.email,
        role: user.role
    }
    const accessToken = jwtHelper.generateToken(jwtPayload, config.JWT.JWT_ACCESS_SECRET as string, config.JWT.JWT_ACCESS_EXPIRES as string)

    const refreshToken = jwtHelper.generateToken(jwtPayload, config.JWT.JWT_REFRESH_SECRET as string, config.JWT.JWT_REFRESH_EXPIRES as string)

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    };
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, config.JWT.JWT_REFRESH_SECRET as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.Active
        }
    });

    const accessToken = jwtHelper.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.JWT.JWT_REFRESH_SECRET as Secret,
        config.JWT.JWT_REFRESH_EXPIRES as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.Active
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(config.bcryptSalt));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.Active
        }
    });

    const resetPassToken = jwtHelper.generateToken(
        { email: userData.email, role: userData.role },
        config.JWT.RESET_PASS_SECRET as Secret,
        config.JWT.RESET_PASS_TOKEN_EXPIRES as string
    )

    const resetPassLink = config.JWT.RESET_PASS_LINK + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.Active
        }
    });

    const isValidToken = jwtHelper.verifyToken(token, config.JWT.RESET_PASS_SECRET as Secret)

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, Number(config.bcryptSalt));

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};

const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = jwtHelper.verifyToken(accessToken, config.JWT.JWT_ACCESS_SECRET as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.Active
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
            doctor:{
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    designation: true,
                    averageRating: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    doctorSpecialties: {
                        include: {
                            specialities: true
                        }
                    }
                }
            },
            patient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    patientHealthData: true,
                }
            }
        }
    });  

    return userData;

}

export const AuthService = {
    login,
    changePassword,
    forgotPassword,
    refreshToken,
    resetPassword,
    getMe
}