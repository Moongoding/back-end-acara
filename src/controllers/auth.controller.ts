import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utills/encryption";
import { generateToken } from "../utills/jwt";
import { IReqUser } from "../middleware/auth.Middleware";

type TRegister = {
    fullName: string;
    username: string;
    email: string
    password: string;
    confirmPassword: string;
};

type TLogin = {
    indentifier: string;
    password: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    // confirmPassword: Yup.string().required(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required(),
})

export default {
    async register(req: Request, res: Response) {
        const { username, fullName, email, password, confirmPassword } =
            req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword,
            });

            const result = await UserModel.create({
                fullName,
                email,
                username,
                password,
            });

            res.status(200).json({
                message: "Succsess Registration!",
                data: result,
            })
        } catch (error) {
            const err = error as unknown as Error;
            // const err = error as Yup.ValidationError;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    },



    async login(req: Request, res: Response) {
        const { indentifier, password } =
            req.body as unknown as TLogin;
        try {
            // Ambil data user berdasarkan "indentifier" -> email dan username

            const userByIndentifier = await UserModel.findOne({
                $or: [
                    {
                        email: indentifier,
                    },
                    {
                        username: indentifier,
                    },
                ]
            });
            if (!userByIndentifier) {
                return res.status(403).json({
                    message: "User not Found",
                    data: null
                });
            }

            // Validasi Password
            const validatePassword: boolean =
                encrypt(password) === userByIndentifier.password;

            if (!validatePassword) {
                return res.status(403).json({
                    message: "User not Found",
                    data: null
                });
            }

            const token = generateToken({
                id: userByIndentifier._id,
                role: userByIndentifier.role,
            });

            res.status(200).json({
                message: "Login Success",
                // data: userByIndentifier,
                data: token,
            })


        } catch (error) {
            const err = error as unknown as Error;
            // const err = error as Yup.ValidationError;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    },

    async me(req: IReqUser, res: Response) {
        try {
            const user = req.user;
            if (!user || !user.id) {
                return res.status(400).json({
                    message: "User not found",
                    data: null
                });
            }

            const result = await UserModel.findById(user?.id);
            if (!result) {
                return res.status(404).json({
                    message: "User not found in database",
                    data: null
                });
            }
            res.status(200).json({
                message: "Succses get user Profile",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;
            // const err = error as Yup.ValidationError;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    }
}