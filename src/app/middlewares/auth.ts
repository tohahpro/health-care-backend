import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new Error("You are not authorized!!")
            }
            const verifyUser = jwtHelper.verifyToken(token, config.JWT.JWT_ACCESS_SECRET as string)

            req.user = verifyUser

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authorized!!")
            }
            next()

        } catch (error) {
            next(error)
        }
    }
}

export default auth