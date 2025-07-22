import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    wallet: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const Client = model("Client", ClientSchema);
export default Client;