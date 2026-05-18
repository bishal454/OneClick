import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IUser {
    _id: string;
    name: string,
    email: string,
    image: string,
    role: string,
    restaurantId?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login - No auth header",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                message: "please login  - token  missing ."
            })
            return;
        }

        const decodeValue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload

        if (!decodeValue || !decodeValue.user) {
            res.status(401).json({
                message: "Invalid token."
            })
            return;
        }

        req.user = decodeValue.user;
        next();

    }
    catch (error) {
        res.status(500).json({
            message: "Please login -jwt error."
        })
    }
};


export const isSeller = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const user = req.user;

    if (user && user.role !== "seller") {

        res.status(401).json({
            message: "You are not an authorized seller",

        });
        return;

    }
    next();


};

