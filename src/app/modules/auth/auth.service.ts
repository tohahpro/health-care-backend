import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs"
import { jwtHelper } from "../../helper/jwtHelper"


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.Active
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password)
    if(!isCorrectPassword){
        throw new Error("Password is incorrect.")
    }
    const accessToken = jwtHelper.generateToken({email: user.email, role: user.role}, "secret_key", "1h")

    const refreshToken = jwtHelper.generateToken({email: user.email, role: user.role}, "secret_key_change", "80d")

    return {
        accessToken, 
        refreshToken,
        needPasswordChange: user.needPasswordChange
    };
}

export const AuthService = {
    login,

}