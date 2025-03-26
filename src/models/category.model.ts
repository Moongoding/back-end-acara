import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema

export const categoryDAO = Yup.object({
    name: Yup.string().required(),
    description: Yup.string().required(),
    icon: Yup.string().required(),
});

export type Category = Yup.InferType<typeof categoryDAO>;

const CategorySchema = new Schema<Category>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    icon: {
        type: Schema.Types.String,
        required: true,
    },
}, {
    // timestamps: true
    timestamps: { currentTime: () => new Date() },
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
});

// 👉 **Getter untuk format waktu lebih mudah dibaca**
CategorySchema.path("createdAt").get(function (value: Date) {
    return value ? value.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : null;
});
CategorySchema.path("updatedAt").get(function (value: Date) {
    return value ? value.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : null;
});

const CategoryModel = mongoose.model('Category', CategorySchema);


export default CategoryModel;