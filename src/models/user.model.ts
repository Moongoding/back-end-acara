import mongoose, { SchemaType, SchemaTypeOptions } from "mongoose";
import { encrypt } from "../utills/encryption";
import { ROLES } from "../utills/constanst";


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
        unique: true,
        lowercase: true
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: [ROLES.ADMIN, ROLES.MEMBER],
        default: ROLES.MEMBER,
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
    // timestamps: true,
    timestamps: { currentTime: () => new Date() },
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
});
UserSchema.index({ email: 1 }, { unique: true });

// 👉 **Getter untuk format waktu lebih mudah dibaca**
UserSchema.path("createdAt").get(function (value: Date) {
    return value ? value.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : null;
});
UserSchema.path("updatedAt").get(function (value: Date) {
    return value ? value.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : null;
});


// Middleware untuk mengenkripsi password dan generate activation code sebelum disimpan
UserSchema.pre("save", function (next) {

    if (this.isModified("password")) {
        console.log("------------------------")
        console.log("🔒 Mengenkripsi password untuk user:", this.email);
        console.log("------------------------")
        this.password = encrypt(this.password)
    }

    if (!this.activationCode) {
        console.log("------------------------")
        console.log("🔑 Membuat activation code untuk:", this.email);
        console.log("------------------------")
        this.activationCode = encrypt(this._id.toString() + this.password);
    }

    next();
    // const user = this;
    // user.password = encrypt(user.password);
    // // Enkripsi activation code dari ID user + password yang sudah terenkripsi
    // user.activationCode = encrypt(user._id.toString() + user.password);
    // // user.activationCode = encrypt(user.id);
});

// Sekarang fungsinya pindah ke controller
// UserSchema.post("save", async function (doc, next) {
//     const user = doc;

//     try {

//         console.log("Fullname:", user.fullName);
//         console.log("createdAt:", user.createdAt);
//         console.log("activationLink:", user.activationCode);


//         // Render HTML untuk email
//         const contentMail = await renderMailHtml("registration-success.ejs", {
//             username: user.username,
//             fullName: user.fullName,
//             email: user.email,
//             createdAt: user.createdAt,
//             activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
//         });

//         // Kirim email
//         await sendMail({
//             from: EMAIL_SMTP_USER,
//             to: user.email,
//             subject: "Aktivasi Akun Anda",
//             html: contentMail,
//         });
//         console.log("Send Email to:", user.email);

//         next(); // Panggil next() untuk melanjutkan proses setelah email dikirim
//     } catch (error) {
//         console.error("Terjadi kesalahan saat mengirim email:", error);
//         // Jika ada error, kita bisa memanggil next dengan error atau melakukan penanganan lainnya
//         next(error as CallbackError); // Untuk melanjutkan dengan error jika diperlukan
//     } finally {

//         // console.log("Proses pengiriman email selesai.");
//         next();
//     }
// });


UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;