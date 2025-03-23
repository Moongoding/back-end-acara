import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utills/encryption";
import { generateToken } from "../utills/jwt";
import { IReqUser } from "../utills/intercace";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utills/env";
import { renderMailHtml, sendMail } from "../utills/mail/mail";

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
        /**
            #swagger.tags = ['Auth']
            #swagger.requestBody = {
                required:true,
                schema:{$ref:'#/components/schemas/RegisterRequest'}
            }
        */
        const { username, fullName, email, password, confirmPassword } =
            req.body as unknown as TRegister;

        console.log("------------------------")
        console.log("📥 Data register masuk:", { username, fullName, email });
        console.log("------------------------")

        const session = await UserModel.startSession();
        session.startTransaction(); // Mulai transaksi

        try {
            console.log("------------------------")
            console.log("🔍 Validasi data...");
            console.log("------------------------")

            await registerValidateSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword,
            });


            console.log("------------------------")
            console.log("🔎 Mengecek apakah email sudah terdaftar...");
            console.log("------------------------")

            // Cek apakah email sudah terdaftar sebelum membuat user baru
            const existingUser = await UserModel.findOne({ email }).session(session);
            if (existingUser) {
                console.log("------------------------")
                console.log("⚠️ Email sudah digunakan:", email);
                console.log("------------------------")

                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: "Email sudah terdaftar, gunakan email lain.",
                    data: null,
                });
            }

            // Jika email belum terdaftar, lanjutkan pembuatan user

            console.log("------------------------")
            console.log("📝 Membuat user baru...");
            console.log("------------------------")

            // const result = await UserModel.create({
            const user = new UserModel({
                fullName,
                email,
                username,
                password, // di enkrip sebelum di simpan
            });

            // Simpan user(result) sementara dalam transaksi
            await user.save({ session });
            console.log("------------------------")
            console.log("✅ User berhasil dibuat, tetapi belum dikomit ke database.");
            console.log("------------------------")



            console.log("------------------------")
            console.log("✉️ Menyiapkan email aktivasi...");
            console.log("------------------------")

            const activationLink = `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`; // Buat activation link
            const contentMail = await renderMailHtml("registration-success.ejs", {             // Render HTML untuk email
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                activationLink: activationLink,
            });

            // Kirim email aktivasi
            console.log("------------------------")
            console.log("🚀 Mengirim email aktivasi ke:", user.email);
            console.log("------------------------")
            await sendMail({
                from: EMAIL_SMTP_USER,
                to: user.email,
                subject: "Aktivasi Akun Anda",
                html: contentMail,
            });

            // Jika email berhasil dikirim, commit transaksi
            await session.commitTransaction();
            session.endSession();
            console.log("🎉 Data user dan email aktivasi berhasil disimpan!");

            res.status(200).json({
                message: "Registrasi berhasil! Silakan cek email untuk aktivasi akun.",
                data: null,
            });

        } catch (error: any) {
            console.error("❌ Error dalam registrasi:", error.message);
            await session.abortTransaction(); // Batalkan transaksi jika ada error
            session.endSession();

            if (error.code === 11000) {
                console.log("⚠️ Duplicate email error:", email);
                return res.status(400).json({
                    message: "Email sudah digunakan, silakan gunakan email lain.",
                    data: null,
                });
            }
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    },

    async login(req: Request, res: Response) {

        /**
            #swagger.tags = ['Auth']
            #swagger.requestBody = {
            required:true,
            schema:{$ref:"#/components/schemas/LoginRequest"}
            }
         */

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
                ],
                isActive: true,
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
        /**
            #swagger.tags = ['Auth']
            #swagger.security =[{
            "bearerAuth":[]
        }]
         */
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
            });
        }
    },

    async activation(req: Request, res: Response) {

        /**
            #swagger.tags = ['Auth']
            #swagger.requestBody = {
                required:true,
                schema:{$ref:'#/components/schemas/ActivationRequest'}
            }
         */

        try {
            const { code } = req.body as { code: string };

            const user = await UserModel.findOneAndUpdate({
                activationCode: code,
            }, {
                isActive: true,
            }, {
                new: true,
            });

            res.status(200).json({
                message: "User Successfully activated",
                data: user,
            });

        } catch (error) {
            const err = error as unknown as Error;
            // const err = error as Yup.ValidationError;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
}