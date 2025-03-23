import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

mongoose.set("strictQuery", false);


const connect = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "db-acara",
            connectTimeoutMS: 30000,  // 30 detik untuk koneksi
            socketTimeoutMS: 30000,   // 30 detik untuk socket
        });
        return Promise.resolve("Database Connected");
    } catch (error) {
        return Promise.reject(error);
    }
};
export default connect;