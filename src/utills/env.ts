import dotenv from "dotenv";
import { boolean, number } from "yup";

dotenv.config();
// export const DATABASE_URL: string = process.env.DATABASE_URL;

// Pastikan variabel-variabel lingkungan sudah terdefinisi
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}
if (!process.env.SECRET) {
    throw new Error("SECRET is not defined in the environment variables.");
}

// Mendeklarasikan dan mengekspor variabel
export const DATABASE_URL: string = process.env.DATABASE_URL!;
export const SECRET: string = process.env.SECRET!;
export const EMAIL_SMTP_SECURE: boolean =
    Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS!;
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER!;
export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST!;
export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME!;
export const CLIENT_HOST: String = process.env.CLIENT_HOST || "http://localhost:3000";
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";

