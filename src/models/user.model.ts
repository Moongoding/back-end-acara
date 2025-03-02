import mongoose, { SchemaType, SchemaTypeOptions } from "mongoose";
import { encrypt } from "../utills/encryption";
import { renderMailHtml, sendMail } from "../utills/mail/mail";
import { CallbackError } from 'mongoose';
import { render } from "ejs";
import { register } from "ts-node";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utills/env";


export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: string;
}

const Schema = mongoose.Schema;
const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user",
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg",
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type: Schema.Types.String,

    }
}, {
    timestamps: true,
});

// Pre-save middleware untuk mengenkripsi password dan generate activation code

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    // Enkripsi activation code dari ID user + password yang sudah terenkripsi
    user.activationCode = encrypt(user._id.toString() + user.password);
    // user.activationCode = encrypt(user.id);
    next();
});


// UserSchema.post("save", async function (doc, next) {
//     const user = doc;

//     console.log("Send Email to :", user.email);

//     const contentMail = await renderMailHtml("registration-succsess.ejs", {
//         username: user.username,
//         fullName: user.fullName,
//         email: user.email,
//         createdAt: user.createdAt,
//         // activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
//         activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
//     });

//     await sendMail({
//         from: "ilmasulis29@gmail.com",
//         to: user.email,
//         subject: "Aktivasi Akun Anda",
//         html: contentMail,
//     });

//     next();
// });


UserSchema.post("save", async function (doc, next) {
    const user = doc;

    try {

        console.log("Fullname:", user.fullName);
        console.log("createdAt:", user.createdAt);
        console.log("activationLink:", user.activationCode);


        // Render HTML untuk email
        const contentMail = await renderMailHtml("registration-success.ejs", {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
        });

        // Kirim email
        await sendMail({
            from: EMAIL_SMTP_USER,
            to: user.email,
            subject: "Aktivasi Akun Anda",
            html: contentMail,
        });
        console.log("Send Email to:", user.email);

        next(); // Panggil next() untuk melanjutkan proses setelah email dikirim
    } catch (error) {
        console.error("Terjadi kesalahan saat mengirim email:", error);
        // Jika ada error, kita bisa memanggil next dengan error atau melakukan penanganan lainnya
        next(error as CallbackError); // Untuk melanjutkan dengan error jika diperlukan
    } finally {

        // console.log("Proses pengiriman email selesai.");
        next();
    }
});


UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;