import dotenv from "dotenv";

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
