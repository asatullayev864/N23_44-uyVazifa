import { Schema, model } from "mongoose";

const OwnerSchema = new Schema({
    email: {
        type: String
    },
    userName: {
        type: String
    },
    fullName: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    hashedPassword: {
        type: String
    },
    wallet: {
        type: Number
    },
    experience: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

const Owner = model('Owner', OwnerSchema);
export default Owner;