import { model, Schema } from "mongoose";

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['SUPERADMIN', 'ADMIN'],
        default: 'ADMIN'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Admin = model('Admin', adminSchema);
export default Admin;