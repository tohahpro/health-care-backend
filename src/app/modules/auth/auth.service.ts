import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs"
import { jwtHelper } from "../../helper/jwtHelper"
import config from "../../../config"
import httpStatus from "http-status"
import ApiError from "../../errors/ApiError"

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

export const AuthService = {
    login,

}