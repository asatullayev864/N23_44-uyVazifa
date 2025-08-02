import { Schema, model } from "mongoose";

const OwnerCourseSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        default: 0,
        min: 0
    },
    experience: {
        type: String,
        default: 'Beginner',
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
}, {
    timestamps: true,
    versionKey: false
});



const OwnerCourse = model('OwnerCourse', OwnerCourseSchema);
export default OwnerCourse;